import { mediaQueries } from "src/styles/mediaQueries.js";
import { Fragment } from "react";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { CurrentYear } from "src/components/CurrentYear.jsx";
import { NavigationLink } from "src/components/NavigationLink.jsx";
import { Separator } from "src/components/Separator.jsx";

const styles = {
  footer: {
    position: "fixed",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: "var(--layer-navigation)",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "var(--space-3)",
    width: "100%",
    margin: "0 auto",
    padding: "var(--space-2) var(--space-4)",
    borderTop: "var(--border-width-thin) solid var(--color-border)",
    background: "var(--surface-frosted)",
    backdropFilter: "blur(var(--blur-md))",
    boxShadow: "var(--shadow-footer)",
    color: "var(--color-ink)",

    p: {
      fontWeight: "var(--font-weight-semibold)",
      marginBottom: 0,
      textAlign: "right"
    },

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)"
    }
  },

  nav: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--space-1)"
  },

  link: {
    lineHeight: "var(--line-height-solid)",
    gap: "var(--space-1)"
  },

  year: {
    display: "inline-block",
    fontFamily: "var(--font-family-digital-numeric)",
    fontSize: "var(--font-size-footer-year)",
    fontWeight: "var(--font-weight-bold)",
    letterSpacing: "var(--letter-spacing-digital)",
    lineHeight: "var(--line-height-solid)"
  }
};

export function Footer() {
  const { content, routes } = useI18n();

  return (
    <footer className={className(styles.footer)}>
      <nav className={className(styles.nav)} aria-label={content.ui.footerNavigation}>
        {routes.map((item, itemIndex) => (
          <Fragment key={item.path}>
            {itemIndex > 0 ? <Separator /> : null}
            <NavigationLink
              arrow={null}
              className={className(styles.link)}
              item={item}
            />
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
