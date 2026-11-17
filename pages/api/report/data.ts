import type { NextApiRequest, NextApiResponse } from "next";
import { applyPrivateHeaders, currentSession } from "lib/report/auth.ts";
import type { Role } from "lib/report/auth.ts";
import { buildSiteReport } from "lib/report/build-report.ts";
import { REPORT } from "lib/report/config.ts";
import type { SiteReport } from "lib/report/types.ts";

export const config = { runtime: "nodejs" };

function withoutAgencyOnlyFields(report: SiteReport, role: Role): SiteReport {
  if (role === "agency") return report;
  return {
    ...report,
    upsell: report.upsell.map((signal) => ({ ...signal, prompt: "" })),
  };
}

function readNumber(
  raw: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (typeof raw !== "string") return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  applyPrivateHeaders(res);
  const session = await currentSession(req);
  if (session === null) {
    res.status(401).json({ error: "Sessione scaduta" });
    return;
  }
  const weeks = readNumber(
    req.query.settimane,
    REPORT.defaultWindowWeeks,
    1,
    52
  );
  const periodsBack = readNumber(req.query.indietro, 0, 0, 12);
  try {
    const report = await buildSiteReport(weeks, periodsBack);
    res.status(200).json({
      report: withoutAgencyOnlyFields(report, session.role),
      weeks,
      periodsBack,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message.slice(0, 220)
          : "errore sconosciuto",
    });
  }
}
