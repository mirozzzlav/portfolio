import { AppLayout } from "./layouts/AppLayout.jsx";
import { normalizePathname } from "./content/index.js";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { useI18n } from "./useI18n.js";
import { useLocation } from "react-router-dom";

export function App() {
  const location = useLocation();
  const { redirects, routes } = useI18n();
  const currentPathname = normalizePathname(location.pathname);
  const knownPathnames = [
    ...routes.map((route) => route.path),
    ...redirects.map((redirect) => redirect.from)
  ].map((pathname) => normalizePathname(pathname));

  if (!knownPathnames.includes(currentPathname)) {
    return <NotFoundPage />;
  }

  return <AppLayout />;
}
