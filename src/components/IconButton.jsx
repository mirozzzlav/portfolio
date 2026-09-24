/** @jsxImportSource @emotion/react */

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
    lineHeight: 1,
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

  sm: {
    width: "0.66rem",
    height: "0.66rem",
    borderRadius: "2px"
  },

  md: {
    width: "40px",
    height: "40px"
  },

  lg: {
    width: "44px",
    height: "44px"
  },

  active: {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-fine)",
    color: "var(--color-on-accent)",
    boxShadow: "0 0 0 var(--space-0) var(--color-focus-ring)"
  }
};

const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg
};

export function IconButton({
  "aria-label": ariaLabel,
  children,
  css: cssProp,
  isActive = false,
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      aria-label={ariaLabel}
      css={[styles.button, sizes[size], isActive && styles.active, cssProp]}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
