import type { ServerResponse } from 'http';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { REPORT } from './config.ts';
import { readEnv } from './env.ts';
import { subtle } from './subtle.ts';

export const SESSION_COOKIE = 'gs_report_session';

export type Role = 'client' | 'agency';

const SESSION_HOURS = 12;
const encoder = new TextEncoder();

interface SessionPayload {
  user: string;
  role: Role;
  exp: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

function sessionSecret(): string {
  const explicit = readEnv('REPORT_SESSION_SECRET');
  if (explicit !== null) return explicit;
  return `fallback:${expectedUser()}:${readEnv('REPORT_PASSWORD') ?? ''}`;
}

async function sign(value: string): Promise<string> {
  const key = await subtle.importKey(
    'raw',
    encoder.encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await subtle.sign('HMAC', key, encoder.encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== 'object' || value === null) return false;
  const candidate: Record<string, unknown> = { ...value };
  return (
    typeof candidate.user === 'string' &&
    typeof candidate.exp === 'number' &&
    (candidate.role === 'client' || candidate.role === 'agency')
  );
}

function expectedUser(): string {
  return readEnv('REPORT_USER') ?? REPORT.reportUser;
}

export function missingCredentialVars(): string[] {
  return ['REPORT_PASSWORD', 'REPORT_SESSION_SECRET'].filter((name) => readEnv(name) === null);
}

export function credentialsConfigured(): boolean {
  return readEnv('REPORT_PASSWORD') !== null;
}

export function roleForCredentials(user: string, password: string): Role | null {
  const candidate = user.trim().toLowerCase();
  const agencyPassword = readEnv('REPORT_AGENCY_PASSWORD');
  if (
    agencyPassword !== null &&
    constantTimeEquals(candidate, REPORT.agencyUser.toLowerCase()) &&
    constantTimeEquals(password, agencyPassword)
  ) {
    return 'agency';
  }
  const clientPassword = readEnv('REPORT_PASSWORD');
  if (
    clientPassword !== null &&
    constantTimeEquals(candidate, expectedUser().toLowerCase()) &&
    constantTimeEquals(password, clientPassword)
  ) {
    return 'client';
  }
  return null;
}

export function verifyCredentials(user: string, password: string): boolean {
  return roleForCredentials(user, password) !== null;
}

export async function createSessionToken(user: string, role: Role): Promise<string> {
  const payload: SessionPayload = {
    user,
    role,
    exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(body);
  return `${body}.${signature}`;
}

export async function readSession(token: string | undefined): Promise<SessionPayload | null> {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const separator = token.lastIndexOf('.');
  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = await sign(body);
  if (!constantTimeEquals(signature, expected)) return null;
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(base64UrlDecode(body)));
    if (!isSessionPayload(parsed)) return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function serializeCookie(
  name: string,
  value: string,
  options: { maxAge: number; secure: boolean },
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${options.maxAge}`,
  ];
  if (options.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function setSessionCookie(res: NextApiResponse, token: string, secure: boolean): void {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(SESSION_COOKIE, token, { maxAge: SESSION_HOURS * 60 * 60, secure }),
  );
}

export function clearSessionCookie(res: NextApiResponse, secure: boolean): void {
  res.setHeader('Set-Cookie', serializeCookie(SESSION_COOKIE, '', { maxAge: 0, secure }));
}

type RequestWithCookies = NextApiRequest | GetServerSidePropsContext['req'];

export async function currentSession(
  req: RequestWithCookies,
): Promise<{ user: string; role: Role } | null> {
  const session = await readSession(req.cookies?.[SESSION_COOKIE]);
  return session === null ? null : { user: session.user, role: session.role };
}

export async function isAuthenticated(req: RequestWithCookies): Promise<boolean> {
  return (await currentSession(req)) !== null;
}

export function applyPrivateHeaders(res: NextApiResponse | ServerResponse): void {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Vary', 'Cookie');
}
