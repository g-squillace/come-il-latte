import { useState } from "react";
import { REPORT } from "lib/report/config.ts";
import { formatDecimal, formatNumber } from "lib/report/format.ts";
import type { Role } from "lib/report/auth.ts";
import type { UpsellSignal } from "lib/report/types.ts";

interface Props {
  signal: UpsellSignal;
  role: Role;
}

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback"; href: string; reason: string };

export default function UpsellTheme({ signal, role }: Props) {
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  async function requestEstimate(): Promise<void> {
    setState({ kind: "sending" });
    try {
      const prepared = await fetch("/api/report/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: signal.service }),
      });
      if (!prepared.ok) throw new Error("preparazione non riuscita");
      const payload: unknown = await prepared.json();
      const subject = String(Reflect.get(payload as object, "subject") ?? "");
      const message = String(Reflect.get(payload as object, "message") ?? "");
      const accessKey = Reflect.get(payload as object, "accessKey");

      if (typeof accessKey !== "string" || accessKey === "") {
        setState({
          kind: "fallback",
          href: `mailto:${REPORT.agencyEmail}?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(message)}`,
          reason:
            "L'invio automatico non è configurato, quindi il pulsante qui sotto apre il programma di posta con il messaggio già scritto.",
        });
        return;
      }

      const form = new FormData();
      form.append("access_key", accessKey);
      form.append("subject", subject);
      form.append("message", message);
      form.append("from_name", REPORT.siteName);

      const sent = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });
      if (!sent.ok) throw new Error("invio non riuscito");
      setState({ kind: "sent" });
    } catch {
      setState({
        kind: "fallback",
        href: `mailto:${REPORT.agencyEmail}?subject=${encodeURIComponent(
          `Richiesta di stima — ${signal.service}`
        )}`,
        reason:
          "L'invio automatico non è riuscito, quindi il pulsante qui sotto apre il programma di posta.",
      });
    }
  }

  return (
    <article className="rounded-lg border border-slate-300 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">{signal.service}</h3>
      <p className="mt-1 text-sm text-slate-700">
        {formatNumber(signal.impressions)} volte comparsi · {formatNumber(signal.clicks)} clic ·
        posizione media {formatDecimal(signal.position)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-900">{signal.pitch}</p>

      <h4 className="mt-4 text-sm font-semibold text-slate-900">Cosa propongo</h4>
      <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-slate-900">
        {signal.solution.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-semibold text-slate-900">Cosa serve da voi</h4>
      <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-slate-900">
        {signal.needed.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-semibold text-slate-900">Come capiamo se ha funzionato</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-900">{signal.goal}</p>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900">
          Le ricerche di questo tema ({signal.queries.length})
        </summary>
        <ul className="mt-2 text-sm text-slate-700">
          {signal.queries.map((row) => (
            <li key={row.query} className="py-0.5">
              {row.query} — {formatNumber(row.impressions)} volte, {formatNumber(row.clicks)} clic,
              posizione {formatDecimal(row.position)}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-5">
        {state.kind === "sent" ? (
          <p role="status" className="text-sm font-medium text-emerald-800">
            Richiesta inviata a {REPORT.agencyEmail}. Rispondo io.
          </p>
        ) : state.kind === "fallback" ? (
          <div role="status">
            <p className="text-sm text-slate-900">{state.reason}</p>
            <a
              href={state.href}
              className="mt-2 inline-flex min-h-[44px] items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Apri il messaggio già scritto
            </a>
            <p className="mt-2 text-sm text-slate-700">
              Oppure scrivete direttamente a {REPORT.agencyEmail}.
            </p>
          </div>
        ) : (
          <button
            type="button"
            disabled={state.kind === "sending"}
            onClick={() => void requestEstimate()}
            className="inline-flex min-h-[44px] items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-70"
          >
            {state.kind === "sending" ? "Sto inviando…" : "Chiedimi una stima"}
          </button>
        )}
      </div>

      {role === "agency" && signal.prompt !== "" && (
        <div className="mt-6 rounded-md border border-slate-300 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">Prompt per Claude Code</h4>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-900">
            {signal.prompt}
          </pre>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(signal.prompt).then(() => setCopied(true));
            }}
            className="mt-3 inline-flex min-h-[44px] items-center rounded-md border border-slate-400 px-4 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {copied ? "Copiato" : "Copia il prompt"}
          </button>
        </div>
      )}
    </article>
  );
}
