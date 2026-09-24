/** @jsxImportSource @emotion/react */
import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "../pages/AboutPage.jsx";
import { ContactPage } from "../pages/ContactPage.jsx";
import { ProjectsPage } from "../pages/ProjectsPage.jsx";

const styles = {
  layout: {
    minHeight: 0,
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "55fr 45fr",
    gap: "var(--space-7)",

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
    height: "100%",
    overflow: "hidden",
    padding: "var(--space-6) var(--main-inline-pad) 0 var(--main-inline-pad)",

    "@media (max-width: 780px)": {
      padding: "0 var(--space-3)",
      paddingTop: `clamp(
        calc(var(--space-7) + var(--space-5)),
        12vh,
        calc(var(--space-7) * 2)
      )`
    }
  },

  visualPanel: {
    minHeight: 0,
    background:
      'var(--color-background) url("/assets/bg4.png") center / min(31.5vw, 465px) auto no-repeat',

    "@media (max-width: 1000px)": {
      display: "none"
    }
  }
};

export function PageShell() {
  return (
    <div css={styles.layout}>
      <main id="top" css={styles.main}>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <aside css={styles.visualPanel} aria-hidden="true" />
    </div>
  );
}
