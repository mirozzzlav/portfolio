import { mergeClassNames } from "../styles/classNames.js";

const styles = {
  indicator: {
    display: "block",
    flex: "none",
    width: "0.66rem",
    height: "0.66rem",
    border: "1px solid var(--color-border)",
    borderRadius: "2px",
    background: "var(--color-surface)",
    boxShadow: "none",
    transition:
      "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease"
  },

  active: {
    borderColor: "var(--palette-accent-fine)",
    background: "var(--palette-accent-fine)",
    boxShadow: "0 0 0 var(--space-0) var(--color-focus-ring)"
  }
};

export function SelectionIndicator({ className, isActive = false }) {
  return (
    <span
      className={mergeClassNames(styles.indicator, isActive && styles.active, className)}
      data-selection-indicator
      aria-hidden="true"
    />
  );
}
