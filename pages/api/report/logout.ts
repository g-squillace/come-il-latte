import type { NextApiRequest, NextApiResponse } from "next";
import { applyPrivateHeaders, clearSessionCookie } from "lib/report/auth.ts";

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  applyPrivateHeaders(res);
  clearSessionCookie(res, (req.headers["x-forwarded-proto"] ?? "https") === "https");
  res.status(200).json({ ok: true });
}
