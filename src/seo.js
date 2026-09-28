import {
  canonicalizePathname,
  getContent,
  getLanguageFromPathname,
  getSeoAlternates
} from "./content/index.js";

export const siteSeo = {
  siteUrl: "https://mirofurinda.com",
  imagePath: "/assets/social.jpg",
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
  const language = getLanguageFromPathname(pathname);
  const content = getContent(language);
  const canonicalPathname = canonicalizePathname(pathname);

  return {
    ...siteSeo,
    title: content.seo.title,
    description: content.seo.description,
    htmlLang: content.language.htmlLang,
    language,
    locale: content.language.locale,
    canonicalUrl: createAbsoluteUrl(canonicalPathname, siteUrl),
    imageUrl: createAbsoluteUrl(siteSeo.imagePath, siteUrl),
    alternates: getSeoAlternates(pathname).map((alternate) => ({
      href: createAbsoluteUrl(alternate.path, siteUrl),
      hrefLang: alternate.hrefLang
    }))
  };
}
