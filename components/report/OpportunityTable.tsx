import { formatDecimal, formatNumber } from "lib/report/format.ts";
import type { Opportunity } from "lib/report/types.ts";

interface Props {
  id: string;
  title: string;
  description: string;
  rows: Opportunity[];
}

export default function OpportunityTable({ id, title, description, rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">{description}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b border-slate-300">
              <th scope="col" className="py-2 pr-4 font-medium text-slate-900">
                Ricerca
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium text-slate-900">
                Comparso
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium text-slate-900">
                Clic
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium text-slate-900">
                Posizione
              </th>
              <th scope="col" className="py-2 font-medium text-slate-900">
                Perché
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.query} className="border-b border-slate-200 align-top">
                <th scope="row" className="py-2 pr-4 font-normal text-slate-900">
                  {row.query}
                </th>
                <td className="py-2 pr-4 text-right tabular-nums text-slate-900">
                  {formatNumber(row.impressions)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-slate-900">
                  {formatNumber(row.clicks)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-slate-900">
                  {formatDecimal(row.position)}
                </td>
                <td className="py-2 text-slate-700">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
