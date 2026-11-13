import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  button: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    gap: "calc(var(--lightbox-spacing) * 2 / 3)",
    minHeight: "var(--lightbox-button-size)",
    padding: "0 var(--lightbox-spacing)",
    border: "var(--lightbox-border-width) solid var(--lightbox-border-color)",
    borderRadius: "var(--lightbox-button-radius)",
    background: "var(--lightbox-background)",
    color: "var(--lightbox-text-color)",
    font: "inherit",
    fontSize: "calc(var(--lightbox-font-size) * 0.9)",
    fontWeight: 600,
    lineHeight: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transition:
      "background var(--lightbox-transition-duration) ease, border-color var(--lightbox-transition-duration) ease, color var(--lightbox-transition-duration) ease",

    svg: {
      display: "block",
      flex: "none",
      width: "var(--lightbox-icon-size)",
      height: "var(--lightbox-icon-size)",
      color: "inherit"
    },

    "&:enabled:hover": {
      borderColor: "var(--lightbox-text-color)"
    },

    "&:focus-visible": {
      outline: "var(--lightbox-focus-width) solid var(--lightbox-text-color)",
      outlineOffset: "var(--lightbox-focus-offset)",
      boxShadow: "none"
    },

    "&:enabled:active": {
      background: "var(--lightbox-text-color)",
      color: "var(--lightbox-background)"
    },

    "&:disabled": {
      opacity: "var(--lightbox-disabled-opacity)",
      cursor: "default"
    },

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none"
    }
  },

  iconOnly: {
    width: "var(--lightbox-button-size)",
    height: "var(--lightbox-button-size)",
    padding: 0,
    gap: 0
  }
};

export function LightboxButton({
  children,
  className,
  iconOnly = false,
  type = "button",
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={mergeClassNames(styles.button, iconOnly && styles.iconOnly, className)}
    >
      {children}
    </button>
  );
}
