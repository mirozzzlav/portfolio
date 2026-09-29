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
      outline: "3px solid var(--palette-accent-soft)",
      outlineOffset: "var(--space-0)"
    }
  },

  compact: compactControlSize,

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
    opacity: 0.58
  }
};

const buttonVariants = {
  outline: styles.outline,
  primary: styles.primary
};

export function Button({
  as: Component = "button",
  children,
  className,
  compact = false,
  variant = "outline",
  ...props
}) {
  return (
    <Component
      className={mergeClassNames(
        styles.button,
        buttonVariants[variant],
        compact && styles.compact,
        props.disabled && styles.disabled,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
