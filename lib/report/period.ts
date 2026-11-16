import type { PeriodRange } from "./types.ts";

const DAY_MS = 86_400_000;

const MONTHS = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function startOfIsoWeek(date: Date): Date {
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const weekday = (new Date(utcMidnight).getUTCDay() + 6) % 7;
  return new Date(utcMidnight - weekday * DAY_MS);
}

function formatRange(start: Date, end: Date): string {
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = MONTHS[start.getUTCMonth()] ?? "";
  const endMonth = MONTHS[end.getUTCMonth()] ?? "";
  const endYear = end.getUTCFullYear();
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${startDay}–${endDay} ${endMonth} ${endYear}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
}

function shortDate(date: Date): string {
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
}

export function completePeriod(
  reference: Date,
  weeks: number,
  periodsBack: number
): PeriodRange {
  const lastMonday = startOfIsoWeek(reference);
  const end = new Date(
    lastMonday.getTime() - (periodsBack * weeks * 7 + 1) * DAY_MS
  );
  const start = new Date(end.getTime() - (weeks * 7 - 1) * DAY_MS);
  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
    label: formatRange(start, end),
    shortLabel: shortDate(start),
    weeks,
    periodsBack,
  };
}

export function periodDays(range: PeriodRange): string[] {
  const start = parseIsoDate(range.start);
  return Array.from({ length: range.weeks * 7 }, (_, index) =>
    toIsoDate(new Date(start.getTime() + index * DAY_MS))
  );
}

export interface WeekBucket {
  start: string;
  label: string;
  days: string[];
}

export function periodWeekBuckets(range: PeriodRange): WeekBucket[] {
  const start = parseIsoDate(range.start);
  return Array.from({ length: range.weeks }, (_, index) => {
    const from = new Date(start.getTime() + index * 7 * DAY_MS);
    return {
      start: toIsoDate(from),
      label: shortDate(from),
      days: Array.from({ length: 7 }, (_, offset) =>
        toIsoDate(new Date(from.getTime() + offset * DAY_MS))
      ),
    };
  });
}
