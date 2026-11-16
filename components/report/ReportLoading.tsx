interface Props {
  weeks: number;
}

const BAR_DELAYS = ["0ms", "120ms", "240ms", "360ms", "480ms"];

export default function ReportLoading({ weeks }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center"
    >
      <div className="flex items-end gap-2" aria-hidden="true">
        {BAR_DELAYS.map((delay, index) => (
          <span
            key={delay}
            className="w-3 origin-bottom animate-report-bar rounded-sm bg-slate-700 motion-reduce:animate-none"
            style={{ height: `${16 + index * 6}px`, animationDelay: delay }}
          />
        ))}
      </div>
      <h1 className="mt-8 text-xl font-semibold text-slate-900">Sto chiedendo i numeri</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Google Analytics e Search Console non tengono niente di pronto: ogni volta ricontano{" "}
        {weeks} settimane da capo. Un paio di secondi e ci siamo.
      </p>
    </div>
  );
}
