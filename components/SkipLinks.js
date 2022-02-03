import i18n from "../lib/i18n";

export default function Skiplinks({ locale }) {
  return (
    <div className="p-1 relative z-10">
      <a href="#content" className="skiplink">
        {i18n.skipLinks.content[locale]}{" "}
      </a>
      <a href="#footer" className="skiplink">
        {i18n.skipLinks.footer[locale]}{" "}
      </a>
    </div>
  );
}
