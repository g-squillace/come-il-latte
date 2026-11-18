import { formatNumber, formatPercent } from "lib/report/format.ts";
import type { LanguagesSection } from "lib/report/types.ts";

interface Props {
  languages: LanguagesSection;
}

interface BarRow {
  key: string;
  label: string;
  value: number;
  share: number;
}

function Bars({ caption, unit, rows }: { caption: string; unit: string; rows: BarRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">{caption}</h3>
      <table className="mt-3 w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="pb-2 font-medium text-slate-700">
              Lingua
            </th>
            <th scope="col" className="pb-2 pl-4 text-right font-medium text-slate-700">
              {unit}
            </th>
            <th scope="col" className="pb-2 pl-4 text-right font-medium text-slate-700">
              Quota
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-slate-100">
              <th scope="row" className="py-2 font-normal text-slate-900">
                {row.label}
                <span
                  aria-hidden="true"
                  className="mt-1 block h-1.5 rounded-full bg-slate-800"
                  style={{ width: `${Math.max(row.share * 100, row.value > 0 ? 2 : 0)}%` }}
                />
              </th>
              <td className="py-2 pl-4 text-right align-top tabular-nums text-slate-900">
                {formatNumber(row.value)}
              </td>
              <td className="py-2 pl-4 text-right align-top tabular-nums text-slate-700">
                {formatPercent(row.share, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LanguageSplit({ languages }: Props) {
  if (languages.versions.length < 2 && languages.visitors.length === 0) return null;

  const versions: BarRow[] = languages.versions.map((row) => ({
    key: row.code,
    label: row.label,
    value: row.views,
    share: row.share,
  }));

  const visitors: BarRow[] = languages.visitors.map((row) => ({
    key: row.label,
    label: row.label,
    value: row.value,
    share: row.share,
  }));

  return (
    <section className="mt-12" aria-labelledby="lingue">
      <h2 id="lingue" className="text-lg font-semibold text-slate-900">
        In che lingua vi leggono
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
        A sinistra quale versione del sito viene davvero aperta, a destra in che lingua è impostato
        il computer di chi arriva. Le due cose non coincidono, ed è lì che si capisce se una lingua
        serve.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Bars caption="Versione del sito aperta" unit="Pagine viste" rows={versions} />
        <Bars caption="Lingua di chi visita" unit="Visite" rows={visitors} />
      </div>
      {languages.note !== null && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700">{languages.note}</p>
      )}
    </section>
  );
}
