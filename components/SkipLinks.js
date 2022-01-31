import i18n from "../lib/i18n";

export default function Skiplinks({ locale }) {
  return (
    <div className="p-1 relative z-10">
      <a href="#content" className="bg-accent text-alt sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:inline-block focus-visible:p-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2">
        {i18n.skipLinks.content[locale]}{" "}
      </a>
      <a href="#footer" className="bg-accent text-alt sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:inline-block focus-visible:p-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2">
        {i18n.skipLinks.footer[locale]}{" "}
      </a>
    </div>
  );
}
