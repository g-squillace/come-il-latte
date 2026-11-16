import test from "node:test";
import assert from "node:assert/strict";
import { completePeriod, periodDays, periodWeekBuckets } from "./period.ts";

const TUESDAY = new Date("2026-11-10T09:00:00.000Z");

test("il periodo finisce all'ultima domenica conclusa", () => {
  const period = completePeriod(TUESDAY, 13, 0);
  assert.equal(period.end, "2026-11-08");
  assert.equal(period.start, "2026-08-10");
  assert.equal(periodDays(period).length, 91);
});

test("il periodo precedente combacia senza sovrapporsi", () => {
  const current = completePeriod(TUESDAY, 13, 0);
  const previous = completePeriod(TUESDAY, 13, 1);
  assert.equal(previous.end, "2026-08-09");
  assert.equal(periodDays(previous).length, 91);
  assert.ok(previous.end < current.start);
});

test("ogni finestra inizia di lunedì e finisce di domenica", () => {
  for (const weeks of [4, 13, 26, 52]) {
    const period = completePeriod(TUESDAY, weeks, 0);
    assert.equal(new Date(`${period.start}T00:00:00Z`).getUTCDay(), 1, period.start);
    assert.equal(new Date(`${period.end}T00:00:00Z`).getUTCDay(), 0, period.end);
  }
});

test("le settimane del grafico coprono il periodo senza buchi", () => {
  const period = completePeriod(TUESDAY, 13, 0);
  const buckets = periodWeekBuckets(period);
  assert.equal(buckets.length, 13);
  assert.deepEqual(
    buckets.flatMap((bucket) => bucket.days),
    periodDays(period)
  );
});
