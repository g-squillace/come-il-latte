import { readEnv } from "./env.ts";
import type { PerformanceSnapshot } from "./performance-view.ts";

function isSnapshot(value: unknown): value is PerformanceSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const measuredAt: unknown = Reflect.get(value, "measuredAt");
  const targets: unknown = Reflect.get(value, "targets");
  return typeof measuredAt === "string" && Array.isArray(targets);
}

export async function fetchPerformanceSnapshot(): Promise<PerformanceSnapshot | null> {
  const token = readEnv("REPORT_SNAPSHOT_TOKEN");
  const base = readEnv("URL") ?? readEnv("DEPLOY_URL");
  if (token === null || base === null) return null;
  try {
    const response = await fetch(
      `${base}/.netlify/functions/report-performance?token=${encodeURIComponent(
        token
      )}`
    );
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    const snapshot: unknown =
      typeof payload === "object" && payload !== null
        ? Reflect.get(payload, "snapshot")
        : null;
    return isSnapshot(snapshot) ? snapshot : null;
  } catch {
    return null;
  }
}
