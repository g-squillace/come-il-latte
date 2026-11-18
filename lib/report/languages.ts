import { readEnv } from "./env.ts";
import type { LanguageRow, NamedRow, PageRow } from "./types.ts";

const UNKNOWN_LABEL = "Non rilevata";

export function siteLocales(): string[] {
  const raw = readEnv("NEXT_LOCALES");
  if (raw === null) return ["it"];
  const locales = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "");
  return locales.length > 0 ? locales : ["it"];
}

export function defaultSiteLocale(): string {
  return readEnv("NEXT_DEFAULT_LOCALE") ?? siteLocales()[0];
}

let cachedNames: Intl.DisplayNames | null | undefined;

function languageNames(): Intl.DisplayNames | null {
  if (cachedNames === undefined) {
    try {
      cachedNames = new Intl.DisplayNames(["it"], { type: "language" });
    } catch {
      cachedNames = null;
    }
  }
  return cachedNames;
}

export function languageLabel(code: string): string {
  const base = code.split("-")[0].toLowerCase();
  if (!/^[a-z]{2,3}$/.test(base)) return UNKNOWN_LABEL;
  const names = languageNames();
  if (names === null) return base;
  let resolved: string | undefined;
  try {
    resolved = names.of(base);
  } catch {
    return base;
  }
  if (typeof resolved !== "string" || resolved === base) return base;
  return resolved.charAt(0).toUpperCase() + resolved.slice(1);
}

export function localeOfPath(path: string, locales: string[], fallback: string): string {
  const segment = path.split("/").filter((part) => part !== "")[0];
  return segment !== undefined && locales.includes(segment) ? segment : fallback;
}

export function siteVersions(pages: PageRow[]): LanguageRow[] {
  const locales = siteLocales();
  const fallback = defaultSiteLocale();
  const totals = new Map<string, { views: number; sessions: number }>();

  for (const page of pages) {
    const locale = localeOfPath(page.path, locales, fallback);
    const current = totals.get(locale) ?? { views: 0, sessions: 0 };
    totals.set(locale, {
      views: current.views + page.views,
      sessions: current.sessions + page.sessions,
    });
  }

  const overall = Array.from(totals.values()).reduce((sum, item) => sum + item.views, 0);

  return locales
    .map((code) => {
      const item = totals.get(code) ?? { views: 0, sessions: 0 };
      return {
        code,
        label: languageLabel(code),
        views: item.views,
        sessions: item.sessions,
        share: overall > 0 ? item.views / overall : 0,
      };
    })
    .sort((left, right) => right.views - left.views);
}

export function visitorLanguages(rows: NamedRow[], limit: number): NamedRow[] {
  const totals = new Map<string, number>();
  let overall = 0;

  for (const row of rows) {
    const label = languageLabel(row.label);
    totals.set(label, (totals.get(label) ?? 0) + row.value);
    overall += row.value;
  }

  return Array.from(totals.entries())
    .map(([label, value]) => ({
      label,
      value,
      share: overall > 0 ? value / overall : 0,
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, limit);
}
