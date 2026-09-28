import { Link as RouterLink } from "react-router-dom";
import { mergeClassNames } from "../styles/classNames.js";
import { SelectionIndicator } from "./SelectionIndicator.jsx";

const arrowRestTransform = "translateY(calc(0.16em - 1px)) rotate(45deg)";
const arrowActiveTransform =
  "translateX(var(--space-0)) translateY(calc(0.16em - 1px)) rotate(45deg)";

const activeMenuItem = {
  fontWeight: "var(--font-weight-semibold)",

  "[data-navigation-arrow]": {
    opacity: 1,
    transform: arrowActiveTransform
  }
};

const hoverMenuItem = {
  "[data-navigation-arrow]": {
    opacity: 1,
    transform: arrowActiveTransform
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
    columnGap: "var(--space-2)",
    position: "relative",
    borderRadius: "var(--radius-md)",
    padding: "var(--space-2) var(--space-3) var(--space-2) var(--space-2)",
    textAlign: "left",
    transition: "background 160ms ease, color 160ms ease",

    "&:not(:last-child)": {
      borderBottom: "1px solid var(--palette-surface-muted)"
    },

    "&:not([aria-current='true']):hover": hoverMenuItem
  },

  menuWithoutIndicator: {
    gridTemplateColumns: "1fr auto"
  },

  menuArrow: {
    gridColumn: 3,
    gridRow: 1,
    alignSelf: "center",
    justifySelf: "center",
    width: "7px",
    height: "7px",
    borderTop: "2px solid currentColor",
    borderRight: "2px solid currentColor",
    opacity: "var(--opacity-medium)",
    transform: arrowRestTransform,
    transition: "opacity 160ms ease, transform 160ms ease"
  },

  menuActive: activeMenuItem,

  menuLabel: {
    display: "block",
    lineHeight: "var(--line-height-solid)"
  },

  menuIndicator: {
    gridColumn: 1,
    gridRow: 1,
    alignSelf: "center",
    justifySelf: "center",
    transform: "translateY(calc(0.01em + 1px))"
  },

  menuText: {
    gridColumn: 2,
    gridRow: 1,
    display: "block",
    lineHeight: "var(--line-height-solid)",
    transform: "translateY(-0.01em)"
  },

  menuTextWithoutIndicator: {
    gridColumn: 1
  },

  menuArrowWithoutIndicator: {
    gridColumn: 2
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
    color: "var(--palette-accent-fine)"
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

export function NavigationArrowIndicator({ className }) {
  return (
    <span
      aria-hidden="true"
      className={mergeClassNames(styles.menuArrow, className)}
      data-navigation-arrow
    />
  );
}

export function MenuItemContent({ children, isCurrent = false, showIndicator = true }) {
  return (
    <>
      {showIndicator ? (
        <SelectionIndicator
          className={mergeClassNames(styles.menuIndicator)}
          isActive={isCurrent}
        />
      ) : null}
      <span
        className={mergeClassNames(
          styles.menuText,
          !showIndicator && styles.menuTextWithoutIndicator
        )}
      >
        {children}
      </span>
      <NavigationArrowIndicator
        className={mergeClassNames(!showIndicator && styles.menuArrowWithoutIndicator)}
      />
    </>
  );
}

function renderLinkContent(children, isCurrent, variant, showIndicator) {
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
    <MenuItemContent isCurrent={isCurrent} showIndicator={showIndicator}>
      {children}
    </MenuItemContent>
  );
}

export function UiLink({
  children,
  className,
  href,
  isCurrent = false,
  showIndicator = true,
  to,
  variant = "footer",
  ...props
}) {
  const linkClassName = mergeClassNames(
    linkVariants[variant],
    variant === "menu" && !showIndicator && styles.menuWithoutIndicator,
    isCurrent && activeLinkVariants[variant],
    className
  );
  const content = renderLinkContent(children, isCurrent, variant, showIndicator);

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
