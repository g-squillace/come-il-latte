import { addressCountry, siteUrl, urlForLocale } from "lib/site";

function plainText(html) {
  if (!html) {
    return null;
  }

  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0 ? text : null;
}

function withoutEmptyValues(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  );
}

export default function StructuredData({
  site,
  org,
  visual,
  locale,
  defaultLocale,
  imageUrl,
}) {
  const streetAddress = plainText(org.streetAddress);
  const sameAs = [org.facebookUrl, org.instagramUrl].filter(Boolean);
  const name = site.globalSeo && site.globalSeo.siteName;

  const shop = withoutEmptyValues({
    "@context": "https://schema.org",
    "@type": "IceCreamShop",
    "@id": `${siteUrl}/#shop`,
    name,
    url: urlForLocale(locale, defaultLocale),
    telephone: org.phoneNumber,
    email: org.emailAddress,
    image: imageUrl,
    logo:
      visual.logo && visual.logo.responsiveImage
        ? visual.logo.responsiveImage.src
        : null,
    sameAs,
    address: streetAddress
      ? withoutEmptyValues({
          "@type": "PostalAddress",
          streetAddress,
          addressCountry,
        })
      : null,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(shop) }}
    />
  );
}
