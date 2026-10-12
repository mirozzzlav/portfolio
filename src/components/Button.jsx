import { mergeClassNames } from "src/styles/classNames.js";
import {
  compactControlSize,
  controlAccent,
  controlFrame,
  controlSurface,
  pillContent
} from "src/styles/controlStyles.js";

const activeButton = {
  ...controlAccent,

  svg: {
    color: "var(--color-on-accent)"
  }
};

const styles = {
  button: {
    font: "inherit",
    ...controlFrame,
    ...pillContent,
    justifySelf: "start",
    gap: "var(--space-1)",
    minHeight: "var(--control-height-lg)",
    padding: "0 var(--space-4)",
    cursor: "pointer",
    fontSize: "var(--font-size-xs)",
    letterSpacing: 0,
    transition:
      "background var(--transition-duration-fast) ease, border-color var(--transition-duration-fast) ease, color var(--transition-duration-fast) ease",

    "&:not(:disabled):not(:focus-visible):hover": {
      outline: "var(--outline-width-hover) solid var(--palette-accent-soft)",
      outlineOffset: "var(--space-0)"
    }
  },

  compact: compactControlSize,

  iconOnly: {
    appearance: "none",
    WebkitTapHighlightColor: "var(--color-transparent)",
    flex: "none",
    width: "var(--control-height-lg)",
    height: "var(--control-height-lg)",
    gap: 0,
    padding: 0,

    svg: {
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)"
    }
  },

  compactIconOnly: {
    width: "var(--control-height-md)",
    height: "var(--control-height-md)",

    svg: {
      width: "var(--icon-size-md)",
      height: "var(--icon-size-md)"
    }
  },

  outline: {
    ...controlSurface,

    "&:hover": {
      borderColor: "var(--palette-ink)",
      background: "var(--color-surface)"
    },

    "&:active, &[aria-expanded='true']": activeButton
  },

  primary: {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-soft)",
    color: "var(--palette-ink)",

    "&:hover": controlAccent
  },

  disabled: {
    cursor: "not-allowed",
    opacity: "var(--opacity-disabled-button)"
  }
};

export function Button({
  as: Component = "button",
  children,
  className,
  compact = false,
  iconOnly = false,
  type = "button",
  variant = "outline",
  ...props
}) {
  return (
    <Component
      className={mergeClassNames(
        styles.button,
        styles[variant],
        compact && styles.compact,
        iconOnly && styles.iconOnly,
        iconOnly && compact && styles.compactIconOnly,
        props.disabled && styles.disabled,
        className
      )}
      type={Component === "button" ? type : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
