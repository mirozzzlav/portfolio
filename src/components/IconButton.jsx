import { mergeClassNames } from "../styles/classNames.js";
import { SelectionIndicator } from "./SelectionIndicator.jsx";

const activeButton = {
  borderColor: "var(--palette-accent-fine)",
  background: "var(--palette-accent-fine)",
  color: "var(--color-on-accent)",
  boxShadow: "0 0 0 var(--space-0) var(--color-focus-ring)"
};

const styles = {
  button: {
    appearance: "none",
    WebkitTapHighlightColor: "var(--color-transparent)",
    display: "inline-grid",
    placeItems: "center",
    flex: "none",
    padding: 0,
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    background: "var(--color-surface)",
    color: "var(--color-ink)",
    cursor: "pointer",
    font: "inherit",
    lineHeight: "var(--line-height-solid)",
    outline: "none",
    boxShadow: "none",
    transition:
      "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",

    "&:hover, &:active": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)",
      color: "var(--color-on-accent)"
    },

    "&:focus": {
      outline: 0,
      boxShadow: "none"
    },

    "&:focus-visible": {
      outline: 0,
      boxShadow: "0 0 0 var(--space-0) var(--color-focus-ring)"
    },

    "&::-moz-focus-inner": {
      border: 0
    }
  },

  selectorButton: {
    appearance: "none",
    WebkitTapHighlightColor: "var(--color-transparent)",
    display: "inline-grid",
    placeItems: "center",
    flex: "none",
    width: "0.66rem",
    height: "0.66rem",
    padding: 0,
    border: 0,
    borderRadius: "2px",
    background: "var(--color-transparent)",
    cursor: "pointer",
    font: "inherit",
    lineHeight: "var(--line-height-solid)",
    outline: "none",

    "&:hover [data-selection-indicator], &:active [data-selection-indicator]": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)"
    },

    "&:focus": {
      outline: 0
    },

    "&:focus-visible [data-selection-indicator]": {
      boxShadow: "0 0 0 var(--space-0) var(--color-focus-ring)"
    },

    "&::-moz-focus-inner": {
      border: 0
    }
  },

  md: {
    width: "40px",
    height: "40px"
  },

  lg: {
    width: "44px",
    height: "44px"
  },

  active: activeButton
};

const sizes = {
  md: styles.md,
  lg: styles.lg
};

export function IconButton({
  "aria-label": ariaLabel,
  children,
  className,
  isActive = false,
  size = "md",
  type = "button",
  ...props
}) {
  const isSelector = size === "sm" && !children;

  return (
    <button
      aria-label={ariaLabel}
      className={mergeClassNames(
        isSelector ? styles.selectorButton : styles.button,
        !isSelector && sizes[size],
        !isSelector && isActive && styles.active,
        className
      )}
      type={type}
      {...props}
    >
      {isSelector ? <SelectionIndicator isActive={isActive} /> : children}
    </button>
  );
}
