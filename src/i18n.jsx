import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  getContent,
  getLanguageFromPathname,
  getLanguageLinks
} from "./content/index.js";
import { I18nContext } from "./i18nContext.js";
import { getPageRouteDefinitions, getRedirectRoutes } from "./routes.js";

export function I18nProvider({ children }) {
  const location = useLocation();
  const language = getLanguageFromPathname(location.pathname);

  const value = useMemo(() => {
    const content = getContent(language);

    return {
      content,
      language,
      routes: getPageRouteDefinitions(language),
      redirects: getRedirectRoutes(language),
      languageLinks: getLanguageLinks(location.pathname)
    };
  }, [language, location.pathname]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
