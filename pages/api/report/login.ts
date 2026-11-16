import type { NextApiRequest, NextApiResponse } from "next";
import {
  applyPrivateHeaders,
  createSessionToken,
  roleForCredentials,
  setSessionCookie,
} from "lib/report/auth.ts";

const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (raw ?? req.socket.remoteAddress ?? "sconosciuto").split(",")[0].trim();
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry === undefined || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function readField(body: unknown, name: string): string {
  if (typeof body !== "object" || body === null) return "";
  const value = Reflect.get(body, name);
  return typeof value === "string" ? value : "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  applyPrivateHeaders(res);
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo non consentito" });
    return;
  }
  if (rateLimited(clientKey(req))) {
    res.status(429).json({ error: "Troppi tentativi. Riprova fra qualche minuto." });
    return;
  }

  const user = readField(req.body, "user");
  const password = readField(req.body, "password");
  const role = roleForCredentials(user, password);
  if (role === null) {
    res.status(401).json({ error: "Credenziali non valide" });
    return;
  }

  const token = await createSessionToken(user.trim().toLowerCase(), role);
  setSessionCookie(res, token, (req.headers["x-forwarded-proto"] ?? "https") === "https");
  res.status(200).json({ ok: true, role });
}
