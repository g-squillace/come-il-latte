const defaultLocale = process.env.NEXT_DEFAULT_LOCALE
const locales = process.env.NEXT_LOCALES.split(',')

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
