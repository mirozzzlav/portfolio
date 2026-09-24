/** @jsxImportSource @emotion/react */
import { Link, useMatch } from "react-router-dom";

const activeMenuItem = {
  background: "var(--color-nav-hover)",

  "&::before": {
    opacity: 1,
    transform: "translateX(var(--space-0)) rotate(45deg)"
  },

  "&::after": {
    transform: "translateY(-50%) scale(1)"
  }
};

const styles = {
  headerLink: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "var(--space-3)",
    position: "relative",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-2) var(--space-3) var(--space-2) var(--space-4)",
    textAlign: "left",
    transition: "background 160ms ease, color 160ms ease",

    "& + &": {
      borderTop: "1px solid var(--palette-surface-muted)"
    },

    "&::before": {
      gridColumn: 2,
      gridRow: 1,
      width: "7px",
      height: "7px",
      borderTop: "2px solid currentColor",
      borderRight: "2px solid currentColor",
      content: '""',
      opacity: "var(--opacity-medium)",
      transform: "rotate(45deg)",
      transition: "opacity 160ms ease, transform 160ms ease"
    },

    "&::after": {
      position: "absolute",
      top: "50%",
      left: "var(--space-2)",
      width: "7px",
      height: "7px",
      background: "var(--palette-accent-fine)",
      content: '""',
      transform: "translateY(-50%) scale(0)",
      transformOrigin: "center",
      transition: "transform 160ms ease"
    },

    "&:hover": activeMenuItem
  },

  headerLinkActive: activeMenuItem,

  footerLink: {
    borderRadius: "var(--radius-pill)",
    transition: "color 160ms ease",

    "& + &::before": {
      content: '"|"',
      marginRight: "var(--space-2)",
      color: "var(--color-border)",
      fontWeight: "var(--font-weight-regular)"
    },

    "&:hover": {
      color: "var(--palette-accent-fine)"
    }
  },

  footerLinkActive: {
    color: "var(--palette-accent-fine)"
  }
};

export function NavigationLink({ item, onSelect, variant = "header" }) {
  const isHome = item.path === "/";
  const isActive = Boolean(useMatch(isHome ? "/" : `${item.path}/*`));
  const linkStyles =
    variant === "footer"
      ? [styles.footerLink, isActive && styles.footerLinkActive]
      : [styles.headerLink, isActive && styles.headerLinkActive];

  return (
    <Link
      aria-current={isActive ? "true" : undefined}
      css={linkStyles}
      to={item.path}
      onClick={onSelect}
    >
      {item.label}
    </Link>
  );
}
