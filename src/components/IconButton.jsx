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
    width: "var(--selection-indicator-size)",
    height: "var(--selection-indicator-size)",
    border: 0,
    borderRadius: "var(--radius-xs)",
    background: "var(--color-transparent)",

    "&:hover [data-selection-indicator], &:active [data-selection-indicator]": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)"
    }
  },

  md: {
    width: "var(--control-height-md)",
    height: "var(--control-height-md)"
  },

  lg: {
    width: "var(--control-height-lg)",
    height: "var(--control-height-lg)"
  },

  active: activeButton
};

const sizes = {
  md: styles.md,
  lg: styles.lg
};

export function IconButton({
  as: Component = "button",
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
    <Component
      aria-label={ariaLabel}
      className={mergeClassNames(
        isSelector ? styles.selectorButton : styles.button,
        !isSelector && sizes[size],
        !isSelector && isActive && styles.active,
        className
      )}
      type={Component === "button" ? type : undefined}
      {...props}
    >
      {isSelector ? <SelectionIndicator isActive={isActive} /> : children}
    </Component>
  );
}
