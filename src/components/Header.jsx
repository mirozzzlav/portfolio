import { mediaQueries } from "src/styles/mediaQueries.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { Button } from "src/components/Button.jsx";
import { NavigationLink } from "src/components/NavigationLink.jsx";
import EyeLogo from "src/components/EyeLogo.jsx";

const styles = {
  header: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    zIndex: "var(--layer-navigation)",
    width: "100%",
    padding: "var(--space-2) 0",
    background: "var(--surface-frosted)",
    backdropFilter: "blur(var(--blur-md))"
  },

  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-4)",
    width: "100%",
    margin: "0 auto",
    padding: "0 var(--space-4)",

    [`@media ${mediaQueries.mobile}`]: {
      padding: "0 var(--space-3)"
    }
  },

  brand: {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "var(--line-height-none)",

    svg: {
      display: "block",
      width: "auto",
      height: "var(--control-height-md)"
    }
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)"
  },

  languageToggle: {
    minWidth: "var(--header-control-width)"
  },

  languageFlag: {
    display: "block",
    fontSize: "var(--font-size-base)",
    lineHeight: "var(--line-height-solid)"
  },

  menu: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  menuToggle: {
    minWidth: "var(--header-control-width)",

    svg: {
      color: "var(--color-ink)",
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)"
    }
  },

  menuToggleIcon: {
    display: "block",
    transition: "color var(--transition-duration-fast) ease"
  },

  nav: {
    position: "absolute",
    top: "calc(100% + var(--space-2))",
    right: 0,
    display: "grid",
    minWidth: "var(--header-menu-width)",
    border: "var(--border-width-thin) solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    background: "var(--surface-solid)",
    boxShadow: "var(--shadow-menu)",
    color: "var(--color-ink)",
    fontWeight: "var(--font-weight-regular)",
    pointerEvents: "none",
    transform: "translateY(calc(-1 * var(--space-1)))",
    visibility: "hidden",
    transition:
      "transform var(--transition-duration-fast) ease, visibility var(--transition-duration-fast) ease"
  },

  navLink: {
    "&": {
      paddingInline: "var(--space-3)",
      paddingBlock: "var(--space-2)",
      borderRadius: "inherit"
    },
    "&:not(:last-child)": {
      borderBottom: "var(--border-width-thin) solid var(--palette-surface-muted)"
    }
  },

  navOpen: {
    pointerEvents: "auto",
    transform: "translateY(0)",
    visibility: "visible"
  }
};

export function Header() {
  const { content, language, languageLinks, routes } = useI18n();
  const alternateLanguage = languageLinks.find((item) => item.code !== language);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleDocumentKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);

  return (
    <header className={className(styles.header)}>
      <div className={className(styles.inner)}>
        <Link
          className={className(styles.brand)}
          to={routes[0].path}
          aria-label={content.ui.home}
        >
          <EyeLogo />
        </Link>

        <div className={className(styles.actions)}>
          {alternateLanguage ? (
            <Button
              as={Link}
              className={className(styles.languageToggle)}
              compact
              to={alternateLanguage.path}
              aria-label={`${content.ui.languageNavigation}: ${alternateLanguage.name}`}
            >
              <span className={className(styles.languageFlag)} aria-hidden="true">
                {alternateLanguage.flag}
              </span>
              {alternateLanguage.label}
            </Button>
          ) : null}

          <div className={className(styles.menu)} ref={menuRef}>
            <Button
              className={className(styles.menuToggle)}
              compact
              type="button"
              aria-controls="site-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? content.ui.closeMenu : content.ui.openMenu}
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              <span>{content.ui.menu}</span>
              <svg
                className={className(styles.menuToggleIcon)}
                viewBox="0 0 144 124.7"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M144 62.35 108 124.7H36L0 62.35 36 0h72ZM72 34.35a28 28 0 1 0 0 56 28 28 0 1 0 0-56Z"
                />
              </svg>
            </Button>

            <nav
              id="site-menu"
              className={className([styles.nav, isMenuOpen && styles.navOpen])}
              data-open={isMenuOpen ? "true" : "false"}
              aria-label={content.ui.mainNavigation}
            >
              {routes.map((item) => (
                <NavigationLink
                  variant="menu"
                  className={className(styles.navLink)}
                  item={item}
                  key={item.path}
                  onSelect={() => setIsMenuOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
