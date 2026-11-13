import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";

const styles = {
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-1)",
    padding: "var(--space-1) 0",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    lineHeight: "var(--line-height-tight)",

    [`@media ${mediaQueries.mobile}`]: {
      padding: 0,
      fontSize: "var(--font-size-xs)",

      svg: {
        display: "none"
      }
    }
  },

  titleIcon: {
    display: "block",
    flex: "none",
    width: "var(--icon-size-lg)",
    height: "var(--icon-size-lg)",
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
