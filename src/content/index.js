import en from "./en.json" with { type: "json" };
import sk from "./sk.json" with { type: "json" };

export const defaultLanguage = "sk";
export const supportedLanguages = [defaultLanguage, "en"];
export const languageContent = {
  sk,
  en
};

export function isSupportedLanguage(language) {
  return supportedLanguages.includes(language);
}

export function normalizePathname(pathname = "/") {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const trimmedPathname = normalizedPathname.replace(/\/+$/, "");

  return trimmedPathname || "/";
}

export function canonicalizePathname(pathname = "/") {
  const normalizedPathname = normalizePathname(pathname);

  return normalizedPathname === "/" ? "/" : `${normalizedPathname}/`;
}

export function getContent(language = defaultLanguage) {
  return languageContent[language] || languageContent[defaultLanguage];
}

export function getLanguageFromPathname(pathname) {
  const firstSegment = normalizePathname(pathname).split("/").filter(Boolean)[0];

  return isSupportedLanguage(firstSegment) ? firstSegment : defaultLanguage;
}

export function removeLanguagePrefix(pathname) {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);

  if (isSupportedLanguage(segments[0])) {
    return normalizePathname(`/${segments.slice(1).join("/")}`);
  }

  return normalizePathname(pathname);
}

export function localizePath(pathname, language) {
  const normalizedPathname = normalizePathname(pathname);
  const localizedPathname =
    language === defaultLanguage
      ? normalizedPathname
      : `/${language}${normalizedPathname === "/" ? "" : normalizedPathname}`;

  return canonicalizePathname(localizedPathname);
}

export function getAlternatePath(pathname, language) {
  return localizePath(removeLanguagePrefix(pathname), language);
}

export function getLanguageLinks(pathname) {
  return supportedLanguages.map((language) => ({
    ...getContent(language).language,
    path: getAlternatePath(pathname, language)
  }));
}

export function getSeoAlternates(pathname) {
  const alternates = supportedLanguages.map((language) => ({
    hrefLang: getContent(language).language.htmlLang,
    path: getAlternatePath(pathname, language)
  }));

  return [
    ...alternates,
    {
      hrefLang: "x-default",
      path: getAlternatePath(pathname, defaultLanguage)
    }
  ];
}
