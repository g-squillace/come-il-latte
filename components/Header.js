import Image from 'next/image';
import Link from 'next/link';
import i18n from "lib/i18n";
import slugify from '@sindresorhus/slugify';

export default function Header({ site, style, page, locale }) {
  const siteName = site.globalSeo && site.globalSeo.siteName;
  const locales = site.locales;
  const logoUrl = style.logo.url;
  const mainNavLabel = i18n.mainNav.label[locale];
  const localeNavLabel = i18n.localeNav.label[locale];
  const menuItems = page.contentBlocks.map(({ menuLabel }) => menuLabel)
    .filter(e => e)

  return (
    <header className="sticky top-0 bg-back z-30">
      <div className="container flex items-center justify-between py-2 xl:py-4">
        <div className="flex-1 max-w-[160px] xl:max-w-[220px]">
          <Image
            src={logoUrl}
            alt={`Logo ${siteName}`}
            width={220}
            height={90}
            priority='true'
            className=""
          />
        </div>
        {menuItems && (
          <nav
            aria-label={mainNavLabel}
          >
            <ul
              className="flex gap-2"
            >
              {menuItems.map((item) => (
                <li
                  className="flex-1"
                  key={item}
                >
                  <a
                    className="button uppercase"
                    href={`#${slugify(item)}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <nav
          className="flex-none"
          aria-label={localeNavLabel}
        >
          <ul>
            <li>
              {locales && locales.map((l, i) => {
                if (l == locale) {
                  return
                }
                return (
                  <Link href="/" locale={l} key={i}>
                    <a className="button-arrow uppercase">
                      {i18n.switchLocale.label[locale]}{" "}
                    </a>
                  </Link>
                )
              })}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
