export const CATEGORY_LABELS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'performance', label: 'Prestazioni' },
  { id: 'accessibility', label: 'Accessibilità' },
  { id: 'best-practices', label: 'Buone pratiche' },
  { id: 'seo', label: 'SEO' },
];

export const AUDIT_LABELS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'largest-contentful-paint', label: 'LCP' },
  { id: 'cumulative-layout-shift', label: 'CLS' },
  { id: 'total-blocking-time', label: 'TBT' },
];

export interface AuditIssue {
  id: string;
  category: string;
  title: string;
  detail: string | null;
  weight: number;
}

export interface StrategyResult {
  scores: Record<string, number | null>;
  audits: Record<string, string | null>;
  issues: AuditIssue[];
  error: string | null;
}

export interface TargetResult {
  label: string;
  url: string;
  mobile: StrategyResult;
  desktop: StrategyResult;
}

export interface PerformanceSnapshot {
  measuredAt: string;
  targets: TargetResult[];
}

const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  CATEGORY_LABELS.map((category) => [category.id, category.label]),
);

export function targetIssues(target: TargetResult): AuditIssue[] {
  const seen = new Map<string, AuditIssue>();
  for (const strategy of [target.mobile, target.desktop]) {
    for (const issue of strategy.issues ?? []) {
      const existing = seen.get(issue.id);
      if (existing === undefined || issue.weight > existing.weight) seen.set(issue.id, issue);
    }
  }
  return [...seen.values()].sort((left, right) => right.weight - left.weight);
}

export function buildPerformancePrompt(target: TargetResult, measuredAt: string): string | null {
  const describe = (strategy: StrategyResult, device: string): string[] => {
    const issues = strategy.issues ?? [];
    if (issues.length === 0) return [];
    return [
      `Su ${device}:`,
      ...issues.map(
        (issue) =>
          `- [${CATEGORY_NAMES[issue.category] ?? issue.category}] ${issue.title}${issue.detail === null ? '' : ` — ${issue.detail}`}`,
      ),
    ];
  };

  const mobile = describe(target.mobile, 'telefono');
  const desktop = describe(target.desktop, 'computer');
  if (mobile.length === 0 && desktop.length === 0) return null;

  const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' }).format(
    new Date(measuredAt),
  );

  return [
    `Lighthouse ha trovato dei problemi sulla pagina ${target.label} (${target.url}), misurati il ${when}.`,
    '',
    ...mobile,
    ...(mobile.length > 0 && desktop.length > 0 ? [''] : []),
    ...desktop,
    '',
    "Cosa voglio da te, in quest'ordine:",
    '1. Apri il codice della pagina e dimmi quali di questi punti sono reali e quali sono rumore di Lighthouse, con il motivo.',
    '2. Ordinali per quanto pesano davvero sulla persona che usa il sito, non per quanto pesano sul punteggio.',
    '3. Per i problemi di accessibilità dimmi anche quale criterio WCAG 2.2 viene violato.',
    '4. Proponi la correzione per ciascuno, indicando file e riga.',
    '',
    'Fermati prima di scrivere codice: voglio approvare cosa tocchiamo.',
  ].join('\n');
}

