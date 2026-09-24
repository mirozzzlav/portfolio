/** @jsxImportSource @emotion/react */
import { navigationItems } from "../data/navigationItems.js";
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
    padding: "var(--space-2) var(--space-5)",
    background: "var(--surface-overlay-strong)",
    backdropFilter: "blur(12px)",
    color: "var(--color-ink)",
    fontSize: "var(--font-size-sm)",

    p: {
      marginBottom: 0,
      textAlign: "right"
    },

    "@media (max-width: 780px)": {
      gridTemplateColumns: "1fr auto",
      justifyItems: "stretch",
      gap: "var(--space-2)",
      padding: "var(--space-1) var(--space-3)",
      fontSize: "0.8rem",

      p: {
        textAlign: "right"
      }
    }
  },

  nav: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "var(--space-2)",
    color: "var(--color-ink)",
    fontWeight: "var(--font-weight-regular)",

    "@media (max-width: 780px)": {
      gap: "var(--space-1)"
    }
  }
};

export function Footer() {
  return (
    <footer css={styles.footer}>
      <nav css={styles.nav} aria-label="Navigácia v päte">
        {navigationItems.map((item) => (
          <NavigationLink item={item} key={item.path} variant="footer" />
        ))}
      </nav>
      <p>&copy; 2026</p>
    </footer>
  );
}
