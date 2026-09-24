import { Link as RouterLink } from "react-router-dom";
import { mergeClassNames } from "../styles/classNames.js";
import { SelectionIndicator } from "./SelectionIndicator.jsx";

const activeMenuItem = {
  fontWeight: "var(--font-weight-semibold)",

  "&::before": {
    opacity: 1,
    transform: "translateX(var(--space-0)) rotate(45deg)"
  }
};

const hoverMenuItem = {
  "&::before": {
    opacity: 1,
    transform: "translateX(var(--space-0)) rotate(45deg)"
  },

  "[data-selection-indicator]": {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-fine)"
  }
};

const styles = {
  menu: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "var(--space-3)",
    position: "relative",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-2) var(--space-3) var(--space-2) var(--space-2)",
    textAlign: "left",
    transition: "background 160ms ease, color 160ms ease",

    "&:not(:last-child)": {
      borderBottom: "1px solid var(--palette-surface-muted)"
    },

    "&::before": {
      gridColumn: 3,
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

    "&:not([aria-current='true']):hover": hoverMenuItem
  },

  menuActive: activeMenuItem,

  menuLabel: {
    display: "block",
    lineHeight: "var(--line-height-solid)"
  },

  footer: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-1)",
    borderRadius: "var(--radius-pill)",
    padding: "var(--space-0) 0",
    transition: "color 160ms ease",

    "&:not([aria-current='true']):hover": {
      color: "var(--color-ink)",

      "[data-selection-indicator]": {
        borderColor: "var(--palette-accent-fine)",
        background: "var(--palette-accent-fine)"
      }
    },

    "&[aria-current='true']:hover": {
      color: "var(--palette-accent-fine)"
    }
  },

  footerActive: {
    color: "var(--palette-accent-fine)",
    fontWeight: "var(--font-weight-medium)"
  }
};

const linkVariants = {
  footer: styles.footer,
  menu: styles.menu
};

const activeLinkVariants = {
  footer: styles.footerActive,
  menu: styles.menuActive
};

function renderLinkContent(children, isCurrent, variant) {
  if (variant === "footer") {
    return (
      <>
        <SelectionIndicator isActive={isCurrent} />
        <span className={mergeClassNames(styles.menuLabel)}>{children}</span>
      </>
    );
  }

  if (variant !== "menu") {
    return children;
  }

  return (
    <>
      <SelectionIndicator isActive={isCurrent} />
      <span className={mergeClassNames(styles.menuLabel)}>{children}</span>
    </>
  );
}

export function UiLink({
  children,
  className,
  href,
  isCurrent = false,
  to,
  variant = "footer",
  ...props
}) {
  const linkClassName = mergeClassNames(
    linkVariants[variant],
    isCurrent && activeLinkVariants[variant],
    className
  );
  const content = renderLinkContent(children, isCurrent, variant);

  if (to) {
    return (
      <RouterLink
        aria-current={isCurrent ? "true" : undefined}
        className={linkClassName}
        to={to}
        {...props}
      >
        {content}
      </RouterLink>
    );
  }

  return (
    <a
      aria-current={isCurrent ? "true" : undefined}
      className={linkClassName}
      href={href}
      {...props}
    >
      {content}
    </a>
  );
}
