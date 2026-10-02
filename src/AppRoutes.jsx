import { Fragment, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { normalizePathname } from "src/content/index.js";
import { AppLayout } from "src/layouts/AppLayout.jsx";
import { NotFoundPage } from "src/pages/NotFoundPage.jsx";
import { attachPageComponents } from "src/pages/index.jsx";
import { useI18n } from "src/useI18n.js";

function CanonicalRedirect({ to }) {
  const location = useLocation();

  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
}

export function AppRoutes() {
  const location = useLocation();
  const { redirects, routes } = useI18n();
  const pageRoutes = attachPageComponents(routes);
  const currentPathname = normalizePathname(location.pathname);
  const currentRoute = pageRoutes.find(
    (route) => normalizePathname(route.path) === currentPathname
  );
  const isKnownPathname =
    Boolean(currentRoute) ||
    redirects.some((redirect) => normalizePathname(redirect.from) === currentPathname);

  useEffect(() => {
    if (isKnownPathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isKnownPathname, location.pathname]);

  if (!isKnownPathname) {
    return <NotFoundPage />;
  }

  return (
    <AppLayout sectionId={currentRoute?.sectionId} title={currentRoute?.title}>
      <Routes>
        {pageRoutes.map(({ Component, path }) => {
          const element = <Component />;
          const nonCanonicalPath = normalizePathname(path);

          return (
            <Fragment key={path}>
              <Route path={path} element={element} />
              {nonCanonicalPath === path ? null : (
                <Route
                  path={nonCanonicalPath}
                  element={<CanonicalRedirect to={path} />}
                />
              )}
            </Fragment>
          );
        })}
        {redirects.map(({ from, to }) => {
          const nonCanonicalFrom = normalizePathname(from);

          return (
            <Fragment key={from}>
              <Route path={from} element={<CanonicalRedirect to={to} />} />
              {nonCanonicalFrom === from ? null : (
                <Route
                  path={nonCanonicalFrom}
                  element={<CanonicalRedirect to={to} />}
                />
              )}
            </Fragment>
          );
        })}
        <Route path="*" element={<Navigate to={routes[0].path} replace />} />
      </Routes>
    </AppLayout>
  );
}
