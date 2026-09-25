import { mergeClassNames } from "../styles/classNames.js";

const activeButton = {
  borderColor: "var(--palette-accent-fine)",
  background: "var(--palette-accent-fine)",
  color: "var(--color-on-accent)"
};

const styles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    justifySelf: "start",
    gap: "var(--space-1)",
    minHeight: "46px",
    padding: "0 var(--space-4)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.84rem",
    fontWeight: "var(--font-weight-semibold)",
    letterSpacing: 0,
    lineHeight: "var(--line-height-solid)",
    textTransform: "uppercase",
    transition: "background 160ms ease, border-color 160ms ease, color 160ms ease",

    svg: {
      flex: "none"
    }
  },

  compact: {
    gap: "0.4rem",
    minHeight: "38px",
    padding: "0 var(--space-2)",

    svg: {
      width: "16px",
      height: "16px"
    }
  },

  outline: {
    background: "var(--color-surface)",
    color: "var(--color-ink)",

    "&:hover": {
      borderColor: "var(--palette-ink)",
      background: "var(--color-surface)",
      outline: "3px solid var(--color-focus-ring)",
      outlineOffset: "var(--space-0)"
    },

    "&:active, &[aria-expanded='true']": activeButton
  },

  primary: {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-soft)",
    color: "var(--palette-ink)",

    "&:hover": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)",
      color: "var(--color-on-accent)",
      outline: "3px solid var(--palette-accent-soft)",
      outlineOffset: "var(--space-0)"
    }
  },

  disabled: {
    cursor: "not-allowed",
    opacity: 0.58,

    "&:hover": {
      outline: "none"
    }
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
