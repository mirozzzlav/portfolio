import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  indicator: {
    display: "block",
    flex: "none",
    width: "var(--selection-indicator-size)",
    height: "var(--selection-indicator-size)",
    border: "var(--border-width-thin) solid var(--color-border)",
    borderRadius: "var(--radius-xs)",
    background: "var(--color-surface)",
    boxShadow: "none",
    transition:
      "background var(--transition-duration-fast) ease, border-color var(--transition-duration-fast) ease, box-shadow var(--transition-duration-fast) ease, opacity var(--transition-duration-fast) ease, transform var(--transition-duration-fast) ease"
  },

  active: {
    borderColor: "var(--palette-accent-brown)",
    background: "var(--palette-accent-brown)",
    boxShadow: "0 0 0 var(--space-0) var(--palette-accent-brown-soft)"
  }
};

export function SelectionIndicator({ className, isActive = false }) {
  return (
    <span
      className={mergeClassNames(
        styles.indicator,
        isActive && styles.active,
        className
      )}
      data-selection-indicator
      aria-hidden="true"
    />
  );
}
