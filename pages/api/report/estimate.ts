import type { NextApiRequest, NextApiResponse } from "next";
import { applyPrivateHeaders, currentSession } from "lib/report/auth.ts";
import { buildSiteReport } from "lib/report/build-report.ts";
import { REPORT } from "lib/report/config.ts";
import { readEnv } from "lib/report/env.ts";
import { formatDecimal, formatNumber } from "lib/report/format.ts";
import type { UpsellSignal } from "lib/report/types.ts";

export const config = { runtime: "nodejs" };

function compose(signal: UpsellSignal, periodLabel: string): string {
  const queries = signal.queries
    .map(
      (row) =>
        `  - ${row.query}: ${formatNumber(row.impressions)} volte comparsi, ${formatNumber(
          row.clicks
        )} clic, posizione ${formatDecimal(row.position)}`
    )
    .join("\n");

  return [
    `Richiesta di stima da ${REPORT.siteName} (${REPORT.siteUrl})`,
    `Tema: ${signal.service}`,
    `Periodo: ${periodLabel}`,
    "",
    `Totali del tema: ${formatNumber(signal.impressions)} volte comparsi, ${formatNumber(
      signal.clicks
    )} clic, posizione media ${formatDecimal(signal.position)}.`,
    "",
    "Ricerche:",
    queries,
    "",
    "Cosa era proposto nel cruscotto:",
    ...signal.solution.map((step) => `  - ${step}`),
    "",
    "Cosa serve dal cliente:",
    ...signal.needed.map((item) => `  - ${item}`),
    "",
    `Obiettivo dichiarato: ${signal.goal}`,
  ].join("\n");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  applyPrivateHeaders(res);
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo non consentito" });
    return;
  }
  if ((await currentSession(req)) === null) {
    res.status(401).json({ error: "Sessione scaduta" });
    return;
  }

  const service =
    typeof req.body === "object" && req.body !== null ? Reflect.get(req.body, "service") : null;
  if (typeof service !== "string") {
    res.status(400).json({ error: "Tema mancante" });
    return;
  }

  const report = await buildSiteReport(REPORT.defaultWindowWeeks, 0);
  const signal = report.upsell.find((item) => item.service === service);
  if (signal === undefined) {
    res.status(404).json({ error: "Tema non riconosciuto" });
    return;
  }

  res.status(200).json({
    subject: `Richiesta di stima — ${signal.service} — ${REPORT.siteName}`,
    message: compose(signal, report.period.label),
    accessKey: readEnv("WEB3FORMS_ACCESS_KEY") ?? "",
    to: REPORT.agencyEmail,
  });
}
