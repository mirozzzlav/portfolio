import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { pageRoutes } from "../pages/index.jsx";
import { className } from "../styles/classNames.js";
import { Button } from "./Button.jsx";
import { NavigationLink } from "./NavigationLink.jsx";

const styles = {
  header: {
    position: "relative",
    zIndex: 20,
    width: "100%",
    padding: "var(--space-2) 0",
    background: "var(--surface-frosted)",
    backdropFilter: "blur(12px)"
  },

  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-4)",
    width: "100%",
    margin: "0 auto",
    padding: "0 var(--space-5)",

    "@media (max-width: 780px)": {
      padding: "0 var(--main-inline-pad)"
    }
  },

  brand: {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "var(--line-height-none)",

    img: {
      display: "block",
      width: "60px",
      height: "auto"
    }
  },

  menu: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },

  menuToggle: {
    gap: "var(--space-0)",
    minWidth: "70px",
    height: "40px",
    minHeight: "40px",
    padding: "var(--space-1) var(--space-2)"
  },

  menuToggleLabel: {
    fontSize: "0.84rem",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-solid)"
  },

  menuToggleIcon: {
    display: "block",
    width: "22px",
    height: "22px",
    color: "currentColor",
    transition: "color 160ms ease"
  },

  nav: {
    position: "absolute",
    top: "calc(100% + var(--space-2))",
    right: 0,
    display: "grid",
    minWidth: "190px",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    background: "var(--surface-solid)",
    boxShadow: "var(--shadow-menu)",
    color: "var(--color-ink)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-regular)",
    pointerEvents: "none",
    transform: "translateY(calc(-1 * var(--space-1)))",
    visibility: "hidden",
    transition: "transform 160ms ease, visibility 160ms ease"
  },

  navOpen: {
    pointerEvents: "auto",
    transform: "translateY(0)",
    visibility: "visible"
  }
};

export function Header() {
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
        <Link className={className(styles.brand)} to="/" aria-label="Domov">
          <img src="/assets/logo.svg" alt="Logo" />
        </Link>

        <div className={className(styles.menu)} ref={menuRef}>
          <Button
            className={className(styles.menuToggle)}
            type="button"
            aria-controls="site-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Zatvoriť menu" : "Otvoriť menu"}
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span className={className(styles.menuToggleLabel)}>Menu</span>
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
            aria-label="Hlavná navigácia"
          >
            {pageRoutes.map((item) => (
              <NavigationLink
                item={item}
                key={item.path}
                onSelect={() => setIsMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
