import { urlForLocale } from "lib/site";

export function withLargeTwitterCard(tags) {
  return tags.map((tag) =>
    tag.attributes && tag.attributes.name === "twitter:card"
      ? {
          ...tag,
          attributes: { ...tag.attributes, content: "summary_large_image" },
        }
      : tag
  );
}

export function withoutEmptyMetaTags(tags) {
  return tags.filter(
    (tag) => !(tag.tag === "meta" && tag.attributes && tag.attributes.content === "")
  );
}

export function canonicalAndAlternateTags({ locale, defaultLocale, locales }) {
  const canonical = urlForLocale(locale, defaultLocale);

  return [
    <link key="canonical" rel="canonical" href={canonical} />,
    <meta key="og-url" property="og:url" content={canonical} />,
    ...locales.map((alternate) => (
      <link
        key={`alternate-${alternate}`}
        rel="alternate"
        hrefLang={alternate}
        href={urlForLocale(alternate, defaultLocale)}
      />
    )),
    <link
      key="alternate-x-default"
      rel="alternate"
      hrefLang="x-default"
      href={urlForLocale(defaultLocale, defaultLocale)}
    />,
  ];
}

export function appTags(faviconTags) {
  const largestIcon = faviconTags.find(
    (tag) => tag.attributes && tag.attributes.sizes === "192x192"
  );

  const tags = [<link key="manifest" rel="manifest" href="/site.webmanifest" />];

  if (!largestIcon) {
    return tags;
  }

  const appleTouchIconHref = largestIcon.attributes.href
    .replace(/([?&])h=\d+/, "$1h=180")
    .replace(/([?&])w=\d+/, "$1w=180");

  return [
    <link
      key="apple-touch-icon"
      rel="apple-touch-icon"
      sizes="180x180"
      href={appleTouchIconHref}
    />,
    ...tags,
  ];
}

export function openGraphImageUrl(tags) {
  const imageTag = tags.find(
    (tag) => tag.attributes && tag.attributes.property === "og:image"
  );

  return imageTag ? imageTag.attributes.content : null;
}
