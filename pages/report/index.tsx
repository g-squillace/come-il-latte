import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import ReportLoading from "components/report/ReportLoading";
import MetricCard from "components/report/MetricCard";
import UpsellTheme from "components/report/UpsellTheme";
import OpportunityTable from "components/report/OpportunityTable";
import TrendChart from "components/report/TrendChart";
import LanguageSplit from "components/report/LanguageSplit";
import { currentSession } from "lib/report/auth.ts";
import { REPORT } from "lib/report/config.ts";
import {
  formatDate,
  formatDecimal,
  formatDuration,
  formatNumber,
  formatPercent,
} from "lib/report/format.ts";
import type { Role } from "lib/report/auth.ts";
import type { SiteReport } from "lib/report/types.ts";

interface Props {
  role: Role;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Vary", "Cookie");
  const session = await currentSession(req);
  if (session === null) {
    return { redirect: { destination: "/report/login", permanent: false } };
  }
  return { props: { role: session.role } };
};

function readWeeks(raw: string | string[] | undefined): number {
  const value = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return REPORT.windowChoices.includes(value as never) ? value : REPORT.defaultWindowWeeks;
}

export default function ReportPage({ role }: Props) {
  const router = useRouter();
  const weeks = readWeeks(router.query.settimane);
  const periodsBack = Number.parseInt(String(router.query.indietro ?? "0"), 10) || 0;

  const [report, setReport] = useState<SiteReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setReport(null);
    setError(null);
    try {
      const response = await fetch(
        `/api/report/data?settimane=${weeks}&indietro=${periodsBack}`
      );
      if (response.status === 401) {
        await router.replace("/report/login");
        return;
      }
      const payload: unknown = await response.json();
      const value =
        typeof payload === "object" && payload !== null ? Reflect.get(payload, "report") : null;
      if (!response.ok || value === null || value === undefined) {
        const message =
          typeof payload === "object" && payload !== null ? Reflect.get(payload, "error") : null;
        setError(typeof message === "string" ? message : "Lettura non riuscita");
        return;
      }
      setReport(value as SiteReport);
    } catch {
      setError("Lettura non riuscita: Google non ha risposto.");
    }
  }, [weeks, periodsBack, router]);

  useEffect(() => {
    if (!router.isReady) return;
    void load();
  }, [router.isReady, load]);

  const sources = report === null ? [] : [report.analyticsSource, report.searchSource];
  const warnings = sources.filter((source) => source.status !== "live" && source.message !== null);

  return (
    <>
      <Head>
        <title>{`Andamento del sito — ${REPORT.siteName}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-5xl px-4 py-10">
          <header className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Andamento del sito</h1>
              <p className="mt-1 text-sm text-slate-700">
                {REPORT.siteName}
                {report !== null && ` · ${report.period.label}`}
              </p>
            </div>
            <nav aria-label="Finestra temporale" className="flex flex-wrap items-center gap-2">
              {REPORT.windowChoices.map((choice) => (
                <a
                  key={choice}
                  href={`/report?settimane=${choice}`}
                  aria-current={choice === weeks ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center rounded-md border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                    choice === weeks
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-400 text-slate-900"
                  }`}
                >
                  {choice} sett.
                </a>
              ))}
            </nav>
          </header>

          {warnings.length > 0 && (
            <div role="status" className="mt-6 rounded-lg border border-amber-500 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                Questa pagina non sta mostrando i numeri veri.
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
                {warnings.map((source) => (
                  <li key={source.message}>{source.message}</li>
                ))}
              </ul>
            </div>
          )}

          {error !== null && (
            <div role="alert" className="mt-6 rounded-lg border border-red-500 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-3 inline-flex min-h-[44px] items-center rounded-md bg-red-900 px-4 text-sm font-medium text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-red-900"
              >
                Riprova
              </button>
            </div>
          )}

          {report === null && error === null && <ReportLoading weeks={weeks} />}

          {report !== null && (
            <>
              <p className="mt-8 text-lg leading-relaxed text-slate-900">{report.headline}</p>

              <section className="mt-10" aria-labelledby="visite">
                <h2 id="visite" className="text-lg font-semibold text-slate-900">
                  Quante persone sono arrivate
                </h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    label="Visite"
                    value={formatNumber(report.traffic.sessions.current)}
                    pair={report.traffic.sessions}
                  />
                  <MetricCard
                    label="Persone diverse"
                    value={formatNumber(report.traffic.users.current)}
                    pair={report.traffic.users}
                  />
                  <MetricCard
                    label="Tempo medio sul sito"
                    value={formatDuration(report.traffic.averageSessionSeconds.current)}
                    pair={report.traffic.averageSessionSeconds}
                  />
                  <MetricCard
                    label="Pagine viste"
                    value={formatNumber(report.traffic.pageViews.current)}
                    pair={report.traffic.pageViews}
                  />
                </dl>
              </section>

              <section className="mt-10" aria-labelledby="ricerche">
                <h2 id="ricerche" className="text-lg font-semibold text-slate-900">
                  Come vi trovano su Google
                </h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    label="Clic da Google"
                    value={formatNumber(report.search.clicks.current)}
                    pair={report.search.clicks}
                  />
                  <MetricCard
                    label="Volte che siete comparsi"
                    value={formatNumber(report.search.impressions.current)}
                    pair={report.search.impressions}
                  />
                  <MetricCard
                    label="Su cento che vi vedono, entrano"
                    value={formatPercent(report.search.ctr.current)}
                    pair={report.search.ctr}
                  />
                  <MetricCard
                    label="Posizione media"
                    value={formatDecimal(report.search.position.current)}
                    pair={report.search.position}
                    lowerIsBetter
                    caption="Più in basso è meglio: 1 è il primo risultato."
                  />
                </dl>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  Di {formatNumber(report.search.clicks.current)} clic,{" "}
                  {formatNumber(report.search.brandedClicks)} arrivano da chi cercava{" "}
                  {REPORT.siteName} per nome e {formatNumber(report.search.nonBrandedClicks)} da chi
                  non vi conosceva.
                </p>
              </section>

              <LanguageSplit languages={report.languages} />

              <TrendChart points={report.trend} />

              <OpportunityTable
                id="a-un-passo"
                title="Dove siete a un passo"
                description="Ricerche in cui comparite già ma troppo in basso perché qualcuno clicchi. Sono le più facili da recuperare."
                rows={report.opportunities}
              />

              {report.portfolioOpportunities.length > 0 && (
                <OpportunityTable
                  id="gusti"
                  title="Ricerche sui vostri gusti"
                  description="Chi cerca un gusto per nome: le tengo separate perché si comportano in modo diverso dalle ricerche di chi non vi conosce."
                  rows={report.portfolioOpportunities}
                />
              )}

              <OpportunityTable
                id="invisibili"
                title="Oltre la seconda pagina"
                description="Ricerche per cui esistete ma nessuno vi vede. Qui serve un contenuto nuovo, non una correzione."
                rows={report.invisible}
              />

              {report.upsell.length > 0 && (
                <section className="mt-12" aria-labelledby="proposte">
                  <h2 id="proposte" className="text-lg font-semibold text-slate-900">
                    Cosa si può fare
                  </h2>
                  <div className="mt-4 flex flex-col gap-6">
                    {report.upsell.map((signal) => (
                      <UpsellTheme key={signal.service} signal={signal} role={role} />
                    ))}
                  </div>
                </section>
              )}

              <footer className="mt-12 border-t border-slate-300 pt-6 text-sm leading-relaxed text-slate-700">
                <p>
                  Il periodo va da {formatDate(report.period.start)} a {formatDate(report.period.end)}:
                  sono settimane intere, da lunedì a domenica, e finiscono all&apos;ultima domenica
                  conclusa. Search Console consolida i dati con due o tre giorni di ritardo.
                </p>
                <p className="mt-2">
                  La somma delle singole ricerche è sempre minore del totale: Google nasconde le
                  ricerche troppo rare per essere mostrate senza identificare chi le ha fatte.
                </p>
                {!report.leads.tracked && (
                  <p className="mt-2">
                    I clic sul numero di telefono non sono ancora misurati, quindi non li trovi in
                    questa pagina: oggi sul sito sono l&apos;unico modo di farsi contattare.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    void fetch("/api/report/logout", { method: "POST" }).then(() =>
                      router.replace("/report/login")
                    );
                  }}
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-md border border-slate-400 px-4 font-medium text-slate-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Esci
                </button>
              </footer>
            </>
          )}
        </main>
      </div>
    </>
  );
}
