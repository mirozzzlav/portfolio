import { Link as RouterLink } from "react-router-dom";
import { mergeClassNames } from "src/styles/classNames.js";
import Arrow from "src/components/Arrow.jsx";
import { SelectionIndicator } from "src/components/SelectionIndicator.jsx";

const arrowYTransform = "translateY(calc(0.16em - 2px))";
const arrowRestTransform = `translateX(0) ${arrowYTransform}`;
const arrowLeftHoverTransform = `translateX(calc(-1 * var(--space-0))) ${arrowYTransform}`;
const arrowRightHoverTransform = `translateX(var(--space-0)) ${arrowYTransform}`;

const activeLink = {
  fontWeight: "var(--font-weight-semibold)"
};

const hoverLink = {
  "[data-navigation-arrow='left']": {
    transform: arrowLeftHoverTransform
  },

  "[data-navigation-arrow='right']": {
    transform: arrowRightHoverTransform
  },

  "[data-selection-indicator]": {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-fine)"
  }
};

const styles = {
  link: {
    appearance: "none",
    display: "flex",
    alignItems: "center",
    gap: "var(--space-0)",
    position: "relative",
    border: 0,
    borderRadius: "var(--radius-md)",
    paddingInline: "var(--space-1)",
    background: "var(--color-transparent)",
    color: "inherit",
    cursor: "pointer",
    font: "inherit",
    fontSize: "var(--font-size-sm)",
    textAlign: "left",
    transition: "background 160ms ease, color 160ms ease",

    "&:hover": hoverLink,

    "&:focus-visible": {
      "@media (forced-colors: active)": {
        outlineColor: "Highlight"
      }
    },

    "&:disabled": {
      cursor: "default",
      opacity: 0.36
    },

    "&:disabled [data-navigation-arrow]": {
      transform: arrowRestTransform
    },

    "&:disabled [data-selection-indicator]": {
      borderColor: "var(--color-border)",
      background: "var(--color-surface)"
    }
  },

  linkActive: activeLink,

  square: {
    flex: "none",
    marginRight: "var(--space-0)",
    transform: "translateY(calc(0.01em + 1px))"
  },

  text: {
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
    lineHeight: "var(--line-height-solid)",
    transform: "translateY(-0.01em)"
  },

  arrow: {
    transform: arrowRestTransform,
    transition: "transform 160ms ease"
  }
};

function LinkContent({
  arrow = "right",
  children,
  hasSquare = true,
  isCurrent = false
}) {
  const hasLeftArrow = arrow === "left";
  const hasRightArrow = arrow === "right";

  return (
    <>
      {hasSquare ? (
        <SelectionIndicator
          className={mergeClassNames(styles.square)}
          isActive={isCurrent}
        />
      ) : null}
      {hasLeftArrow ? (
        <Arrow
          className={mergeClassNames(styles.arrow)}
          data-navigation-arrow="left"
          direction="left"
        />
      ) : null}
      <span className={mergeClassNames(styles.text)}>{children}</span>
      {hasRightArrow ? (
        <Arrow
          className={mergeClassNames(styles.arrow)}
          data-navigation-arrow="right"
          direction="right"
        />
      ) : null}
    </>
  );
}

export function UiLink({
  arrow = "right",
  children,
  className,
  hasSquare = true,
  href,
  isCurrent = false,
  to,
  type = "button",
  ...props
}) {
  const linkClassName = mergeClassNames(
    styles.link,
    isCurrent && styles.linkActive,
    className
  );
  const content = (
    <LinkContent arrow={arrow} hasSquare={hasSquare} isCurrent={isCurrent}>
      {children}
    </LinkContent>
  );

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

  if (!href) {
    return (
      <button
        aria-current={isCurrent ? "true" : undefined}
        className={linkClassName}
        type={type}
        {...props}
      >
        {content}
      </button>
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
