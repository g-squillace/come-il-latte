const defaultLocale = process.env.NEXT_DEFAULT_LOCALE
const locales = process.env.NEXT_LOCALES.split(',')

module.exports = {
  i18n: {
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: false,
  },
  reactStrictMode: true,
  images: {
    domains: ["www.datocms-assets.com"],
  },
};
