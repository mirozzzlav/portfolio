export const siteSeo = {
  siteUrl: "https://mirofurinda.com",
  title: "Mirovo portfólio - Webové stránky a aplikácie",
  description:
    "Tvorba webových stránok a aplikácií so zmyslom pre dizajn, detail, funkčnosť a prirodzené používanie.",
  imagePath: "/assets/social.jpg",
  locale: "sk_SK",
  twitterCard: "summary_large_image"
};

export function normalizeSiteUrl(siteUrl) {
  return siteUrl.replace(/\/+$/, "");
}

export function createAbsoluteUrl(pathname, siteUrl = siteSeo.siteUrl) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${normalizeSiteUrl(siteUrl)}${normalizedPathname}`;
}

export function getRouteSeo(pathname, siteUrl = siteSeo.siteUrl) {
  return {
    ...siteSeo,
    canonicalUrl: createAbsoluteUrl(pathname, siteUrl),
    imageUrl: createAbsoluteUrl(siteSeo.imagePath, siteUrl)
  };
}
