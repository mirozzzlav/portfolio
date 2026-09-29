import { mergeClassNames } from "src/styles/classNames.js";
import {
  controlAccent,
  controlFrame,
  controlSurface
} from "src/styles/controlStyles.js";
import { SelectionIndicator } from "src/components/SelectionIndicator.jsx";

const iconButtonBase = {
  appearance: "none",
  WebkitTapHighlightColor: "var(--color-transparent)",
  display: "inline-grid",
  placeItems: "center",
  flex: "none",
  padding: 0,
  cursor: "pointer",
  font: "inherit",
  lineHeight: "var(--line-height-solid)",

  "&::-moz-focus-inner": {
    border: 0
  }
};

const activeButton = {
  ...controlAccent,
  boxShadow: "0 0 0 var(--space-0) var(--palette-accent-soft)"
};

const styles = {
  button: {
    ...iconButtonBase,
    ...controlFrame,
    ...controlSurface,
    boxShadow: "none",
    transition:
      "background var(--transition-duration-fast) ease, border-color var(--transition-duration-fast) ease, box-shadow var(--transition-duration-fast) ease, color var(--transition-duration-fast) ease",

    "&:hover, &:active": controlAccent
  },

  selectorButton: {
    ...iconButtonBase,
    width: "0.66rem",
    height: "0.66rem",
    border: 0,
    borderRadius: "2px",
    background: "var(--color-transparent)",

    "&:hover [data-selection-indicator], &:active [data-selection-indicator]": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)"
    }
  },

  md: {
    width: "var(--icon-button-size-md)",
    height: "var(--icon-button-size-md)"
  },

  lg: {
    width: "var(--icon-button-size-lg)",
    height: "var(--icon-button-size-lg)"
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
