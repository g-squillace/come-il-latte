import test from "node:test";
import assert from "node:assert/strict";
import {
  SERVICE_SIGNALS,
  demandGap,
  isBranded,
  portfolioMatcher,
  strikingDistance,
  upsellSignals,
} from "./insights.ts";
import type { QueryRow } from "./types.ts";

const CATALOG_TITLES = [
  "Pistacchio di Bronte",
  "Nocciola Piemonte",
  "Zuppa Inglese",
  "Crema all'uovo",
  "Fragola",
  "Limone",
];

const isCatalog = portfolioMatcher(CATALOG_TITLES);
const notCatalog = (query: string): boolean => !isCatalog(query);

test("riconosce le ricerche sui nomi dei gusti", () => {
  for (const query of [
    "pistacchio di bronte",
    "gelato nocciola piemonte",
    "zuppa inglese gelato",
  ]) {
    assert.equal(isCatalog(query), true, query);
  }
});

test("lascia passare le ricerche commerciali che contengono parole di settore", () => {
  for (const query of [
    "gelateria roma",
    "migliore gelateria roma",
    "gelato artigianale roma",
    "best gelato rome",
    "torta gelato roma",
    "gelato senza lattosio",
  ]) {
    assert.equal(isCatalog(query), false, query);
  }
});

test("riconosce le ricerche sul nome della gelateria", () => {
  assert.equal(isBranded("come il latte"), true);
  assert.equal(isBranded("Come il Latte Roma"), true);
  assert.equal(isBranded("comeillatte"), true);
  assert.equal(isBranded("gelateria roma"), false);
});

test("propone solo le ricerche a portata, ordinate per clic recuperabili", () => {
  const rows: QueryRow[] = [
    { query: "gelateria roma", clicks: 4, impressions: 388, ctr: 0.01, position: 11.8 },
    { query: "torta gelato roma", clicks: 2, impressions: 58, ctr: 0.034, position: 8.7 },
    { query: "come il latte", clicks: 38, impressions: 112, ctr: 0.339, position: 1.2 },
    { query: "gelato senza lattosio", clicks: 0, impressions: 64, ctr: 0, position: 26.1 },
    { query: "best gelato rome", clicks: 0, impressions: 3, ctr: 0, position: 11 },
  ];
  const found = strikingDistance(rows).map((item) => item.query);
  assert.deepEqual(found, ["gelateria roma", "torta gelato roma"]);
});

test("i nomi dei gusti restano fuori dai temi di upselling", () => {
  const rows: QueryRow[] = [
    { query: "pistacchio di bronte", clicks: 7, impressions: 410, ctr: 0.017, position: 3.1 },
    { query: "torta gelato roma", clicks: 3, impressions: 340, ctr: 0.009, position: 11.4 },
  ];
  const signals = upsellSignals(rows, "17 agosto – 15 novembre 2026", notCatalog);
  const matched = signals.flatMap((signal) => signal.queries.map((row) => row.query));
  assert.equal(matched.includes("pistacchio di bronte"), false);
  assert.equal(matched.includes("torta gelato roma"), true);
});

test("la domanda locale generica finisce in un unico tema", () => {
  const rows: QueryRow[] = [
    { query: "gelateria roma", clicks: 3, impressions: 462, ctr: 0.006, position: 29.2 },
    { query: "gelaterie roma", clicks: 0, impressions: 136, ctr: 0, position: 12.8 },
    { query: "migliore gelateria roma", clicks: 0, impressions: 370, ctr: 0, position: 75.8 },
    { query: "pistacchio di bronte", clicks: 7, impressions: 410, ctr: 0.017, position: 3.1 },
  ];
  const signals = upsellSignals(rows, "17 agosto – 15 novembre 2026", notCatalog);
  const local = signals[0];
  assert.ok(local !== undefined);
  assert.equal(local.service, SERVICE_SIGNALS[0]?.service);
  assert.equal(local.impressions, 968);
  assert.equal(
    local.queries.some((row) => row.query === "pistacchio di bronte"),
    false
  );
});

test("il divario conta solo chi non cercava la gelateria per nome", () => {
  const rows: QueryRow[] = [
    { query: "come il latte", clicks: 11, impressions: 23, ctr: 0.478, position: 2.3 },
    { query: "gelateria roma", clicks: 3, impressions: 462, ctr: 0.006, position: 30 },
    { query: "pistacchio di bronte", clicks: 7, impressions: 410, ctr: 0.017, position: 3.1 },
  ];
  const gap = demandGap(rows, notCatalog, "gelateria a Roma");
  assert.ok(gap !== null);
  assert.equal(gap.impressions, 462);
  assert.equal(gap.clicks, 3);
  assert.equal(gap.position, 30);
});
