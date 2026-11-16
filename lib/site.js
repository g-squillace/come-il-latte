const fallbackSiteUrl = "https://comeillatte.it";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/+$/, "");

export const addressCountry = "IT";

export function urlForLocale(locale, defaultLocale) {
  return locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`;
}
