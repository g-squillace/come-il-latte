import { formatNumber } from "lib/report/format.ts";
import type { TrendPoint } from "lib/report/types.ts";

interface Props {
  points: TrendPoint[];
}

export default function TrendChart({ points }: Props) {
  const peak = Math.max(1, ...points.map((point) => point.sessions));

  return (
    <section className="mt-10" aria-labelledby="andamento">
      <h2 id="andamento" className="text-lg font-semibold text-slate-900">
        Settimana per settimana
      </h2>
      <div className="mt-4 flex items-end gap-1" aria-hidden="true">
        {points.map((point) => (
          <span
            key={point.start}
            title={`${point.label}: ${point.sessions} visite`}
            style={{ height: `${Math.max(4, (point.sessions / peak) * 120)}px` }}
            className="flex-1 rounded-t-sm bg-slate-400"
          />
        ))}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Visite, clic da Google e volte in cui il sito è comparso, settimana per settimana
          </caption>
          <thead>
            <tr className="border-b border-slate-300">
              <th scope="col" className="py-2 pr-4 font-medium text-slate-900">
                Settimana dal
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium text-slate-900">
                Visite
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium text-slate-900">
                Clic
              </th>
              <th scope="col" className="py-2 text-right font-medium text-slate-900">
                Comparso
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.start} className="border-b border-slate-200">
                <th scope="row" className="py-2 pr-4 font-normal text-slate-900">
                  {point.label}
                </th>
                <td className="py-2 pr-4 text-right tabular-nums text-slate-900">
                  {formatNumber(point.sessions)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-slate-900">
                  {formatNumber(point.clicks)}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-900">
                  {formatNumber(point.impressions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
