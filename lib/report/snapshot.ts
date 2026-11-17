import { googlePost } from "./google.ts";
import { completePeriod } from "./period.ts";
import { propertyId } from "./analytics.ts";
import { siteUrl } from "./search-console.ts";
import type { PeriodRange, QueryRow } from "./types.ts";

const DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const SEARCH_CONSOLE_API = "https://searchconsole.googleapis.com/webmasters/v3";

const LEAD_EVENT_NAMES = ["click_email", "click_phone", "generate_lead"];

export interface WeekSnapshot {
  week: string;
  end: string;
  capturedAt: string;
  sessions: number;
  users: number;
  newUsers: number;
  pageViews: number;
  engagementRate: number;
  leads: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: QueryRow[];
}

export interface SnapshotStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  list(): Promise<string[]>;
}

export function snapshotKey(week: PeriodRange): string {
  return `week-${week.start}`;
}

function numberAt(row: unknown, index: number): number {
  if (typeof row !== "object" || row === null) return 0;
  const values: unknown = Reflect.get(row, "metricValues");
  if (!Array.isArray(values)) return 0;
  const cell: unknown = values[index];
  if (typeof cell !== "object" || cell === null) return 0;
  const value: unknown = Reflect.get(cell, "value");
  return typeof value === "string" ? Number.parseFloat(value) || 0 : 0;
}

function firstRow(report: unknown): unknown {
  if (typeof report !== "object" || report === null) return null;
  const rows: unknown = Reflect.get(report, "rows");
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

function allRows(payload: unknown): unknown[] {
  if (typeof payload !== "object" || payload === null) return [];
  const rows: unknown = Reflect.get(payload, "rows");
  return Array.isArray(rows) ? rows : [];
}

function reportsOf(payload: unknown): unknown[] {
  if (typeof payload !== "object" || payload === null) return [];
  const reports: unknown = Reflect.get(payload, "reports");
  return Array.isArray(reports) ? reports : [];
}

function dimensionAt(row: unknown, index: number): string {
  if (typeof row !== "object" || row === null) return "";
  const values: unknown = Reflect.get(row, "dimensionValues");
  if (!Array.isArray(values)) return "";
  const cell: unknown = values[index];
  if (typeof cell !== "object" || cell === null) return "";
  const value: unknown = Reflect.get(cell, "value");
  return typeof value === "string" ? value : "";
}

function searchNumber(row: unknown, field: string): number {
  if (typeof row !== "object" || row === null) return 0;
  const value: unknown = Reflect.get(row, field);
  return typeof value === "number" ? value : 0;
}

function searchKey(row: unknown): string {
  if (typeof row !== "object" || row === null) return "";
  const keys: unknown = Reflect.get(row, "keys");
  if (!Array.isArray(keys)) return "";
  const first: unknown = keys[0];
  return typeof first === "string" ? first : "";
}

export async function captureWeek(week: PeriodRange): Promise<WeekSnapshot> {
  const property = propertyId();
  const site = siteUrl();
  if (property === null) throw new Error("GA4_PROPERTY_ID non è configurato");
  if (site === null) throw new Error("SEARCH_CONSOLE_SITE_URL non è configurato");

  const dateRanges = [{ startDate: week.start, endDate: week.end }];
  const searchBody = {
    startDate: week.start,
    endDate: week.end,
    dataState: "all",
  };

  const [analytics, daily, queries] = await Promise.all([
    googlePost(`${DATA_API}/properties/${property}:batchRunReports`, {
      requests: [
        {
          dateRanges,
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "newUsers" },
            { name: "screenPageViews" },
            { name: "engagementRate" },
          ],
        },
        {
          dateRanges,
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          limit: 60,
        },
      ],
    }),
    googlePost(
      `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(
        site
      )}/searchAnalytics/query`,
      { ...searchBody, dimensions: ["date"], rowLimit: 10 }
    ),
    googlePost(
      `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(
        site
      )}/searchAnalytics/query`,
      { ...searchBody, dimensions: ["query"], rowLimit: 100 }
    ),
  ]);

  const reports = reportsOf(analytics);
  const totals = firstRow(reports[0]);
  const leads = allRows(reports[1])
    .filter((row) => LEAD_EVENT_NAMES.includes(dimensionAt(row, 0)))
    .reduce<number>((sum, row) => sum + numberAt(row, 0), 0);

  const dailyRows = allRows(daily);
  const clicks = dailyRows.reduce<number>(
    (sum, row) => sum + searchNumber(row, "clicks"),
    0
  );
  const impressions = dailyRows.reduce<number>(
    (sum, row) => sum + searchNumber(row, "impressions"),
    0
  );
  const weighted = dailyRows.reduce<number>(
    (sum, row) =>
      sum + searchNumber(row, "position") * searchNumber(row, "impressions"),
    0
  );

  return {
    week: week.start,
    end: week.end,
    capturedAt: new Date().toISOString(),
    sessions: numberAt(totals, 0),
    users: numberAt(totals, 1),
    newUsers: numberAt(totals, 2),
    pageViews: numberAt(totals, 3),
    engagementRate: numberAt(totals, 4),
    leads,
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: impressions > 0 ? weighted / impressions : 0,
    topQueries: allRows(queries).map((row) => ({
      query: searchKey(row),
      clicks: searchNumber(row, "clicks"),
      impressions: searchNumber(row, "impressions"),
      ctr: searchNumber(row, "ctr"),
      position: searchNumber(row, "position"),
    })),
  };
}

export interface CaptureResult {
  key: string;
  week: string;
  status: "written" | "kept";
  impressions: number;
  sessions: number;
}

export async function captureWeeks(
  store: SnapshotStore,
  weeksBack: number[],
  overwrite: boolean
): Promise<CaptureResult[]> {
  const results: CaptureResult[] = [];
  for (const back of weeksBack) {
    const week = completePeriod(new Date(), 1, back);
    const key = snapshotKey(week);
    if (!overwrite && (await store.get(key)) !== null) {
      results.push({
        key,
        week: week.start,
        status: "kept",
        impressions: 0,
        sessions: 0,
      });
      continue;
    }
    const snapshot = await captureWeek(week);
    await store.set(key, JSON.stringify(snapshot));
    results.push({
      key,
      week: week.start,
      status: "written",
      impressions: snapshot.impressions,
      sessions: snapshot.sessions,
    });
  }
  return results;
}
