import type { AnalyticsPeriod, AnalyticsTotals } from "./analytics.ts";
import { periodDays } from "./period.ts";
import type { SearchPeriod, SearchTotals } from "./search-console.ts";
import type { NamedRow, PageRow, PeriodRange, QueryRow } from "./types.ts";

const DEMO_QUERIES: Array<[string, number, number, number]> = [
  ["gelateria roma", 14, 320, 8.4],
  ["gelato artigianale roma", 9, 240, 9.1],
  ["migliore gelateria roma centro", 6, 180, 11.2],
  ["come il latte", 52, 410, 1.2],
  ["come il latte roma", 31, 260, 1.1],
  ["gelato pistacchio roma", 3, 96, 14.7],
  ["gelateria vicino colosseo", 2, 88, 16.3],
  ["gelato senza lattosio roma", 1, 74, 18.9],
  ["torta gelato roma", 0, 61, 21.4],
  ["gelateria aperta ora roma", 0, 44, 24.8],
];

function shareOf(rows: Array<{ value: number }>): (value: number) => number {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (value) => (total === 0 ? 0 : value / total);
}

function named(entries: Array<[string, number]>): NamedRow[] {
  const rows = entries.map(([label, value]) => ({ label, value, share: 0 }));
  const share = shareOf(rows);
  return rows.map((row) => ({ ...row, share: share(row.value) }));
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed) * 10_000;
  return value - Math.floor(value);
}

export function demoAnalytics(period: PeriodRange): {
  current: AnalyticsPeriod;
  previous: AnalyticsTotals;
  previousEvents: NamedRow[];
} {
  const days = periodDays(period);
  const daily = new Map<string, { sessions: number; users: number }>();
  let sessions = 0;
  let users = 0;

  days.forEach((day, index) => {
    const weekend = index % 7 >= 5 ? 1.6 : 1;
    const value = Math.round((8 + pseudoRandom(index + 1) * 14) * weekend);
    const dayUsers = Math.round(value * 0.86);
    daily.set(day, { sessions: value, users: dayUsers });
    sessions += value;
    users += dayUsers;
  });

  const pages: PageRow[] = [
    { path: "/", views: Math.round(sessions * 1.3), sessions: Math.round(sessions * 0.74) },
    { path: "/en", views: Math.round(sessions * 0.28), sessions: Math.round(sessions * 0.16) },
    { path: "/ja", views: Math.round(sessions * 0.11), sessions: Math.round(sessions * 0.07) },
    { path: "/ko", views: Math.round(sessions * 0.05), sessions: Math.round(sessions * 0.03) },
  ];

  return {
    current: {
      totals: {
        sessions,
        users,
        newUsers: Math.round(users * 0.79),
        pageViews: Math.round(sessions * 1.42),
        engagementRate: 0.61,
        averageSessionSeconds: 48,
      },
      daily,
      channels: named([
        ["Organic Search", Math.round(sessions * 0.54)],
        ["Direct", Math.round(sessions * 0.27)],
        ["Organic Social", Math.round(sessions * 0.13)],
        ["Referral", Math.round(sessions * 0.06)],
      ]),
      devices: named([
        ["mobile", Math.round(sessions * 0.78)],
        ["desktop", Math.round(sessions * 0.18)],
        ["tablet", Math.round(sessions * 0.04)],
      ]),
      pages,
      events: named([
        ["page_view", Math.round(sessions * 1.42)],
        ["scroll", Math.round(sessions * 0.52)],
      ]),
    },
    previous: {
      sessions: Math.round(sessions * 0.88),
      users: Math.round(users * 0.9),
      newUsers: Math.round(users * 0.71),
      pageViews: Math.round(sessions * 1.3),
      engagementRate: 0.58,
      averageSessionSeconds: 45,
    },
    previousEvents: [],
  };
}

export function demoSearch(period: PeriodRange): {
  current: SearchPeriod;
  previous: SearchTotals;
} {
  const queries: QueryRow[] = DEMO_QUERIES.map(([query, clicks, impressions, position]) => ({
    query,
    clicks,
    impressions,
    ctr: impressions === 0 ? 0 : clicks / impressions,
    position,
  }));

  const clicks = queries.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = queries.reduce((sum, row) => sum + row.impressions, 0);
  const weighted = queries.reduce((sum, row) => sum + row.position * row.impressions, 0);

  const days = periodDays(period);
  const daily = new Map<string, { clicks: number; impressions: number }>();
  days.forEach((day, index) => {
    daily.set(day, {
      clicks: Math.round((clicks / days.length) * (0.6 + pseudoRandom(index + 7) * 0.8)),
      impressions: Math.round((impressions / days.length) * (0.6 + pseudoRandom(index + 11) * 0.8)),
    });
  });

  return {
    current: {
      totals: {
        clicks,
        impressions,
        ctr: impressions === 0 ? 0 : clicks / impressions,
        position: impressions === 0 ? 0 : weighted / impressions,
      },
      queries,
      pages: [
        { query: "https://comeillatte.it/", clicks: Math.round(clicks * 0.81), impressions: Math.round(impressions * 0.76), ctr: 0, position: 6.2 },
        { query: "https://comeillatte.it/en", clicks: Math.round(clicks * 0.14), impressions: Math.round(impressions * 0.18), ctr: 0, position: 9.8 },
      ],
      daily,
      freshUntil: period.end,
    },
    previous: {
      clicks: Math.round(clicks * 0.83),
      impressions: Math.round(impressions * 0.91),
      ctr: 0.062,
      position: 11.4,
    },
  };
}
