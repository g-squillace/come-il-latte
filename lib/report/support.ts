import { SUPPORT_SOURCE } from "./config.ts";
import { readEnv } from "./env.ts";
import type { PeriodRange, SupportEntry, SupportSection } from "./types.ts";

interface RemoteEntry {
  date: string;
  hours: number;
  description: string;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asEntry(value: unknown): RemoteEntry | null {
  if (typeof value !== "object" || value === null) return null;
  const date: unknown = Reflect.get(value, "date");
  const hours = asNumber(Reflect.get(value, "hours"));
  const description: unknown = Reflect.get(value, "description");
  if (typeof date !== "string" || hours === null) return null;
  return {
    date,
    hours,
    description: typeof description === "string" ? description : "",
  };
}

function asEntries(value: unknown): RemoteEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map(asEntry).filter((entry): entry is RemoteEntry => entry !== null);
}

export async function buildSupport(period: PeriodRange): Promise<SupportSection | null> {
  const token = readEnv("ASSISTENZA_API_TOKEN");
  const base = readEnv("ASSISTENZA_API_BASE");
  if (SUPPORT_SOURCE === "" || token === null || base === null) return null;

  let payload: unknown;
  try {
    const response = await fetch(`${base}/api/assistenza/${SUPPORT_SOURCE}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    payload = await response.json();
  } catch {
    return null;
  }

  if (typeof payload !== "object" || payload === null) return null;

  const totalHours = asNumber(Reflect.get(payload, "totalHours"));
  const startedOn: unknown = Reflect.get(payload, "startedOn");
  const remoteEntries = asEntries(Reflect.get(payload, "entries"));
  if (totalHours === null || remoteEntries.length === 0) return null;

  const entries: SupportEntry[] = remoteEntries
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((entry) => ({
      ...entry,
      inPeriod: entry.date >= period.start && entry.date <= period.end,
    }));

  const usedHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return {
    totalHours,
    usedHours,
    remainingHours: Math.max(0, totalHours - usedHours),
    usedThisPeriod: entries
      .filter((entry) => entry.inPeriod)
      .reduce((sum, entry) => sum + entry.hours, 0),
    startedOn: typeof startedOn === "string" ? startedOn : entries[entries.length - 1].date,
    entries,
  };
}
