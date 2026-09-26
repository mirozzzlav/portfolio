import { Fragment } from "react";
import { pageRoutes } from "../pages/index.jsx";
import { className } from "../styles/classNames.js";
import { CurrentYear } from "./CurrentYear.jsx";
import { NavigationLink } from "./NavigationLink.jsx";

const styles = {
  footer: {
    position: "fixed",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "var(--space-3)",
    width: "100%",
    margin: "0 auto",
    padding: "var(--space-2) var(--space-4)",
    background: "var(--surface-overlay-strong)",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 -6px 16px color-mix(in srgb, var(--palette-ink) 4%, var(--color-transparent))",
    color: "var(--color-ink)",
    fontSize: "var(--font-size-sm)",

    p: {
      fontWeight: "var(--font-weight-semibold)",
      marginBottom: 0,
      textAlign: "right"
    },

    "@media (max-width: 780px)": {
      gridTemplateColumns: "1fr auto",
      justifyItems: "stretch",
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)",

      p: {
        textAlign: "right"
      }
    }
  },

  nav: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "var(--space-2)",
    color: "var(--color-ink)",
    fontWeight: "var(--font-weight-medium)",

    "@media (max-width: 780px)": {
      gap: "var(--space-1)"
    }
  },

  separator: {
    color: "var(--color-border)",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: "var(--line-height-solid)"
  },

  year: {
    display: "inline-block",
    color: "var(--color-ink)",
    fontFamily: "var(--font-family-digital-numeric)",
    fontSize: "0.78em",
    fontWeight: "var(--font-weight-bold)",
    letterSpacing: "0.04em",
    lineHeight: "var(--line-height-solid)"
  }
};

export function Footer() {
  return (
    <footer className={className(styles.footer)}>
      <nav className={className(styles.nav)} aria-label="Navigácia v päte">
        {pageRoutes.map((item, itemIndex) => (
          <Fragment key={item.path}>
            {itemIndex > 0 ? (
              <span className={className(styles.separator)} aria-hidden="true">
                |
              </span>
            ) : null}
            <NavigationLink item={item} variant="footer" />
          </Fragment>
        ))}
      </nav>
      <p>
        &copy;{" "}
        <span className={className(styles.year)}>
          <CurrentYear />
        </span>
      </p>
    </footer>
  );
}
