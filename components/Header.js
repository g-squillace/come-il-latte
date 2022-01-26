import Image from 'next/image';
import Link from 'next/link';
import i18n from "../lib/i18n";

export default function Header({ site, design, locale }) {
  const siteName = site.globalSeo.siteName
  const locales = site.locales
  const logoUrl = design.logo.url

  return (
    <header className="container flex items-center justify-between py-2 xl:py-4">
      <div className="flex-1 max-w-[160px] xl:max-w-[220px]">
        <Image src={logoUrl} alt={`Logo ${siteName}`} width={220} height={90} layout='responsive' />
      </div>
      <nav className="flex-none">
        <ul>
          <li>
            {locales && locales.map((l, i) => {
              if (l == locale) {
                return
              }
              return (
                <Link href="/" locale={l} key={i}>
                  <a className="uppercase">{i18n.switchLocale.label[locale]}{" "}</a>
                </Link>
              )
            })}
          </li>
        </ul>
      </nav>
    </header>
  );
}
