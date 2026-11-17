const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://comeillatte.it").replace(
  /\/+$/,
  ""
);
const defaultLocale = process.env.NEXT_DEFAULT_LOCALE || "it";
const locales = (process.env.NEXT_LOCALES || "it,en,ja,ko").split(",");

const errorPages = ["/404", "/500"];
const privatePages = ["/report", "/report/login"];
const exclude = errorPages.concat(privatePages).concat(
  locales.reduce(
    (paths, locale) =>
      paths.concat(
        errorPages.concat(privatePages).map((page) => `/${locale}${page}`)
      ),
    []
  )
);

const alternateRefs = locales
  .map((locale) => ({
    href: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
    hreflang: locale,
    hrefIsAbsolute: true,
  }))
  .concat([{ href: siteUrl, hreflang: "x-default", hrefIsAbsolute: true }]);

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  autoLastmod: true,
  trailingSlash: false,
  changefreq: "weekly",
  priority: 0.7,
  exclude,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  },
  transform: async (config, path) => {
    if (errorPages.some((page) => path.endsWith(page))) {
      return undefined;
    }
    if (path === "/report" || path.startsWith("/report/") || path.includes("/report")) {
      return undefined;
    }

    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },
};
