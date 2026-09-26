import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BlurLoadedImage } from "../components/BlurLoadedImage.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { pageRoutes, redirectRoutes } from "../pages/index.jsx";
import { className } from "../styles/classNames.js";

const pageContentVariants = {
  projects: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "var(--space-1)",
    maxWidth: "none"
  }
};

const styles = {
  appBody: {
    display: "grid",
    gridTemplateColumns: "55fr 45fr",
    gap: "var(--space-6)",
    paddingTop: "var(--header-height)",

    "@media (max-width: 1000px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  },

  main: {
    position: "relative",
    zIndex: 10,
    display: "grid",
    alignItems: "start",
    width: "100%",
    padding:
      "var(--space-3) var(--main-inline-pad) var(--space-7) var(--main-inline-pad)",

    "@media (max-width: 780px)": {
      padding: "var(--space-3) var(--main-inline-pad) var(--space-7) var(--main-inline-pad)",
    },
  },

  visualPanel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
    padding:
      "var(--space-6) var(--main-inline-pad) var(--space-7) var(--main-inline-pad)",
    background: "var(--color-background)",

    "@media (max-width: 1000px)": {
      display: "none"
    }
  },
  visualImage: {
    display: "block",
    width: "min(100%, 520px)",
    aspectRatio: "1",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "var(--radius-sm)"
  },
  visualImageMedia: {
    display: "block",
    objectFit: "contain"
  },
  pageSection: {
    "--section-space": "var(--section-inline-gap)",

    gridArea: "1 / 1",
    width: "100%",
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "var(--section-space)",
    minHeight: 0,
    padding: 0,
    animation: "section-enter 280ms ease-out both",

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 1,
      transform: "none"
    },

    "@media (max-width: 780px)": {
      "--section-space": "var(--section-inline-gap)"
    }
  },

  pageHeading: {
    display: "grid",
    gap: "var(--space-1)"
  },

  pageTitle: {
    position: "relative",
    display: "inline-block",
    width: "fit-content",
    margin: 0,
    padding: "0 var(--space-1) var(--space-0) 0",
    color: "var(--palette-ink)",
    fontSize: "clamp(1.2rem, 3vw, 2.55rem)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-display)",
    letterSpacing: 0,

    "&::before": {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: "14%",
      zIndex: -1,
      height: "38%",
      borderRadius: "var(--radius-sm)",
      background: "var(--palette-accent-soft)",
      content: '""'
    },

    "@media (max-width: 780px)": {
      fontSize: "clamp(1.8rem, 8vw, 2.2rem)"
    }
  },

  pageContent: {
    maxWidth: "75ch",
    overflow: "visible",
    padding: 0,

    "@media (max-width: 780px)": {
      overflow: "visible"
    }
  }
};

function renderPage(Component, sectionId, title) {
  return (
    <section
      id={sectionId}
      className={className(styles.pageSection)}
      aria-label={title}
    >
      <div className={className(styles.pageHeading)}>
        <h2 className={className(styles.pageTitle)}>{title}</h2>
      </div>
      <div className={className([styles.pageContent, pageContentVariants[sectionId]])}>
        <Component />
      </div>
    </section>
  );
}

export function AppLayout() {
  const location = useLocation();
  const currentRoute = pageRoutes.find((route) => route.path === location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className={className(styles.appBody)}>
        <main
          id="top"
          className={className(styles.main)}
          data-section={currentRoute?.sectionId}
        >
          <Routes>
            {pageRoutes.map(({ Component, path, sectionId, title }) => (
              <Route
                path={path}
                element={renderPage(Component, sectionId, title)}
                key={path}
              />
            ))}
            {redirectRoutes.map(({ from, to }) => (
              <Route path={from} element={<Navigate to={to} replace />} key={from} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <aside className={className(styles.visualPanel)} aria-hidden="true">
          <BlurLoadedImage
            className={className(styles.visualImage)}
            imageClassName={className(styles.visualImageMedia)}
            src="/assets/bg.webp"
            placeholderSrc="/assets/bg-placeholder.webp"
            alt=""
          />
        </aside>
      </div>
      <Footer />
    </>
  );
}
