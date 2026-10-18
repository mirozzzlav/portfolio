import { mediaQueries } from "src/styles/mediaQueries.js";
import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  title: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-1)",
    minHeight: "var(--space-7)",
    padding: "var(--space-2) var(--space-6)",
    background: "var(--surface-preview-title)",
    backdropFilter: "blur(var(--blur-md))",
    boxShadow: "var(--shadow-preview-title)",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-base)",
    fontWeight: "var(--font-weight-semibold)",

    [`@media ${mediaQueries.mobile}`]: {
      minHeight: "var(--preview-title-min-height-mobile)",
      padding: "var(--space-2) var(--space-5)",
      lineHeight: "var(--line-height-compact)"
    }
  },

  titleIcon: {
    display: "block",
    flex: "none",
    width: "var(--space-5)",
    height: "var(--space-5)",
    color: "var(--palette-accent-fine)"
  }
};

export function Description({ children, className, ...props }) {
  return (
    <div className={mergeClassNames(styles.title, className)} {...props}>
      <svg
        className={mergeClassNames(styles.titleIcon)}
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="12"
          cy="12"
          r="8.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M12 10.75v5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />

        <path
          d="M12 7.85h.01"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>

      {children}
    </div>
  );
}
