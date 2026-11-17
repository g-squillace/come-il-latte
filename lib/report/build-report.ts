import { LEAD_EVENTS, fetchAnalytics, propertyId } from "./analytics.ts";
import type { AnalyticsPeriod, AnalyticsTotals } from "./analytics.ts";
import { REPORT } from "./config.ts";
import { readEnv } from "./env.ts";
import {
  buildHeadline,
  demandGap,
  invisibleQueries,
  isBranded,
  portfolioMatcher,
  strikingDistance,
  upsellSignals,
} from "./insights.ts";
import { completePeriod, periodWeekBuckets } from "./period.ts";
import { fetchSearchConsole, siteUrl } from "./search-console.ts";
import type { SearchPeriod, SearchTotals } from "./search-console.ts";
import { demoAnalytics, demoSearch } from "./demo.ts";
import type {
  LeadsSection,
  MetricPair,
  NamedRow,
  PageRow,
  PeriodRange,
  SearchSection,
  SiteReport,
  SourceState,
  TrafficSection,
  TrendPoint,
} from "./types.ts";

const CACHE_TTL_MS = 5 * 60 * 1000;
const LOCAL_DEMAND_TOPIC = "gelateria a Roma";

interface CacheEntry {
  report: SiteReport;
  storedAt: number;
}

const cache = new Map<string, CacheEntry>();

function pair(current: number, previous: number): MetricPair {
  return { current, previous };
}

function missingVars(candidates: Array<{ name: string; resolved: string | null }>): string {
  const missing = candidates.filter((item) => item.resolved === null).map((item) => item.name);
  return missing.length > 0 ? missing.join(", ") : "credenziali non valide";
}

async function catalogTitles(): Promise<string[]> {
  const token = readEnv("NEXT_DATOCMS_API_TOKEN");
  if (token === null) return [];
  try {
    const response = await fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "{ allIcecreams { title } }" }),
    });
    if (!response.ok) return [];
    const payload: unknown = await response.json();
    const data: unknown =
      typeof payload === "object" && payload !== null
        ? Reflect.get(payload, "data")
        : null;
    const rows: unknown =
      typeof data === "object" && data !== null
        ? Reflect.get(data, "allIcecreams")
        : null;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => (typeof row === "object" && row !== null ? Reflect.get(row, "title") : null))
      .filter((title): title is string => typeof title === "string");
  } catch {
    return [];
  }
}

function buildTrend(
  period: PeriodRange,
  analytics: AnalyticsPeriod,
  search: SearchPeriod,
): TrendPoint[] {
  return periodWeekBuckets(period).map((bucket) => {
    let sessions = 0;
    let clicks = 0;
    let impressions = 0;
    for (const day of bucket.days) {
      sessions += analytics.daily.get(day)?.sessions ?? 0;
      const searchDay = search.daily.get(day);
      clicks += searchDay?.clicks ?? 0;
      impressions += searchDay?.impressions ?? 0;
    }
    return { start: bucket.start, label: bucket.label, sessions, clicks, impressions };
  });
}

function buildTraffic(current: AnalyticsPeriod, previous: AnalyticsTotals): TrafficSection {
  return {
    sessions: pair(current.totals.sessions, previous.sessions),
    users: pair(current.totals.users, previous.users),
    newUsers: pair(current.totals.newUsers, previous.newUsers),
    pageViews: pair(current.totals.pageViews, previous.pageViews),
    engagementRate: pair(current.totals.engagementRate, previous.engagementRate),
    averageSessionSeconds: pair(
      current.totals.averageSessionSeconds,
      previous.averageSessionSeconds,
    ),
    channels: current.channels,
    devices: current.devices,
    topPages: current.pages,
  };
}

function leadRows(events: NamedRow[]): NamedRow[] {
  return events.filter((row) => LEAD_EVENTS.includes(row.label));
}

function buildLeads(current: NamedRow[], previous: NamedRow[]): LeadsSection {
  const currentRows = leadRows(current);
  const total = currentRows.reduce((sum, row) => sum + row.value, 0);
  const previousTotal = leadRows(previous).reduce((sum, row) => sum + row.value, 0);
  return {
    total: pair(total, previousTotal),
    byEvent: currentRows,
    tracked: currentRows.length > 0,
  };
}

function searchPages(rows: SearchPeriod["pages"]): PageRow[] {
  return rows.map((row) => ({ path: row.query, views: row.impressions, sessions: row.clicks }));
}

function buildSearch(current: SearchPeriod, previous: SearchTotals): SearchSection {
  const brandedClicks = current.queries
    .filter((row) => isBranded(row.query))
    .reduce((sum, row) => sum + row.clicks, 0);
  return {
    clicks: pair(current.totals.clicks, previous.clicks),
    impressions: pair(current.totals.impressions, previous.impressions),
    ctr: pair(current.totals.ctr, previous.ctr),
    position: pair(current.totals.position, previous.position),
    topQueries: current.queries,
    topPages: searchPages(current.pages),
    brandedClicks,
    nonBrandedClicks: Math.max(0, current.totals.clicks - brandedClicks),
    visibleImpressions: current.queries.reduce((sum, row) => sum + row.impressions, 0),
    freshUntil: current.freshUntil,
  };
}

async function loadAnalytics(
  period: PeriodRange,
  previous: PeriodRange,
): Promise<{
  data: { current: AnalyticsPeriod; previous: AnalyticsTotals; previousEvents: NamedRow[] };
  source: SourceState;
}> {
  if (propertyId() === null || readEnv("GOOGLE_SERVICE_ACCOUNT_JSON") === null) {
    return {
      data: demoAnalytics(period),
      source: {
        status: "demo",
        message: `Dati di esempio: mancano ${missingVars([
          { name: "GA4_PROPERTY_ID", resolved: propertyId() },
          { name: "GOOGLE_SERVICE_ACCOUNT_JSON", resolved: readEnv("GOOGLE_SERVICE_ACCOUNT_JSON") },
        ])}`,
      },
    };
  }
  try {
    return { data: await fetchAnalytics(period, previous), source: { status: "live", message: null } };
  } catch (error) {
    return {
      data: demoAnalytics(period),
      source: {
        status: "error",
        message: error instanceof Error ? error.message.slice(0, 220) : "errore sconosciuto",
      },
    };
  }
}

async function loadSearch(
  period: PeriodRange,
  previous: PeriodRange,
): Promise<{ data: { current: SearchPeriod; previous: SearchTotals }; source: SourceState }> {
  if (siteUrl() === null || readEnv("GOOGLE_SERVICE_ACCOUNT_JSON") === null) {
    return {
      data: demoSearch(period),
      source: {
        status: "demo",
        message: `Dati di esempio: mancano ${missingVars([
          { name: "SEARCH_CONSOLE_SITE_URL", resolved: siteUrl() },
          { name: "GOOGLE_SERVICE_ACCOUNT_JSON", resolved: readEnv("GOOGLE_SERVICE_ACCOUNT_JSON") },
        ])}`,
      },
    };
  }
  try {
    return {
      data: await fetchSearchConsole(period, previous),
      source: { status: "live", message: null },
    };
  } catch (error) {
    return {
      data: demoSearch(period),
      source: {
        status: "error",
        message: error instanceof Error ? error.message.slice(0, 220) : "errore sconosciuto",
      },
    };
  }
}

export async function buildSiteReport(weeks: number, periodsBack: number): Promise<SiteReport> {
  const key = `${weeks}:${periodsBack}`;
  const cached = cache.get(key);
  if (cached !== undefined && Date.now() - cached.storedAt < CACHE_TTL_MS) {
    return cached.report;
  }

  const now = new Date();
  const period = completePeriod(now, weeks, periodsBack);
  const previousPeriod = completePeriod(now, weeks, periodsBack + 1);

  const [analytics, search, titles] = await Promise.all([
    loadAnalytics(period, previousPeriod),
    loadSearch(period, previousPeriod),
    catalogTitles(),
  ]);

  const isCatalog = portfolioMatcher(titles);
  const isGeneral = (query: string): boolean => !isCatalog(query);

  const queries = search.data.current.queries;
  const leads = buildLeads(analytics.data.current.events, analytics.data.previousEvents);
  const gap = demandGap(queries, isGeneral, LOCAL_DEMAND_TOPIC);

  const report: SiteReport = {
    period,
    previousPeriod,
    generatedAt: new Date().toISOString(),
    leads,
    traffic: buildTraffic(analytics.data.current, analytics.data.previous),
    search: buildSearch(search.data.current, search.data.previous),
    trend: buildTrend(period, analytics.data.current, search.data.current),
    demandGap: gap,
    opportunities: strikingDistance(queries, isGeneral),
    portfolioOpportunities: strikingDistance(queries, isCatalog),
    invisible: invisibleQueries(queries, isGeneral),
    upsell: upsellSignals(queries, period.label, isGeneral),
    headline: buildHeadline(gap, leads.total.current, leads.tracked),
    analyticsSource: analytics.source,
    searchSource: search.source,
  };

  cache.set(key, { report, storedAt: Date.now() });
  return report;
}

export { REPORT };
