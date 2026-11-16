import { delta } from "lib/report/format.ts";
import type { MetricPair } from "lib/report/types.ts";

interface Props {
  label: string;
  value: string;
  pair: MetricPair;
  lowerIsBetter?: boolean;
  caption?: string;
}

const TONE = {
  up: "text-emerald-800",
  down: "text-red-800",
  flat: "text-slate-700",
};

export default function MetricCard({ label, value, pair, lowerIsBetter = false, caption }: Props) {
  const change = delta(pair.current, pair.previous, lowerIsBetter);
  const movement = change.ratio === null ? "" : change.ratio > 0 ? "▲" : change.ratio < 0 ? "▼" : "■";
  const quality =
    change.direction === "up" ? "in miglioramento" : change.direction === "down" ? "in peggioramento" : "stabile";

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-4">
      <dt className="text-sm font-medium text-slate-700">{label}</dt>
      <dd className="mt-1">
        <span className="block text-3xl font-semibold tabular-nums text-slate-900">{value}</span>
        <span className={`mt-1 block text-sm font-medium ${TONE[change.direction]}`}>
          <span aria-hidden="true">{movement} </span>
          {change.label}
          <span className="sr-only"> rispetto al periodo precedente, {quality}</span>
          <span className="ml-1 font-normal text-slate-700">({quality})</span>
        </span>
        {caption !== undefined && (
          <span className="mt-2 block text-xs leading-snug text-slate-700">{caption}</span>
        )}
      </dd>
    </div>
  );
}
