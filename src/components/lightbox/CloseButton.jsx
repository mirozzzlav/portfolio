import { mergeClassNames } from "src/styles/classNames.js";
import { Button } from "src/components/Button.jsx";
import { mediaQueries } from "src/styles/mediaQueries.js";

const styles = {
  close: {
    flexShrink: 0,
    padding: "0 var(--space-2)",
    color: "var(--palette-accent-fine)",
    fontWeight: "var(--font-weight-regular)",

    svg: {
      display: "block",
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)"
    }
  },

  fullLabel: {
    [`@media ${mediaQueries.mobile}`]: {
      display: "none"
    }
  },

  shortLabel: {
    display: "none",

    [`@media ${mediaQueries.mobile}`]: {
      display: "inline"
    }
  }
};

export function CloseButton({
  className,
  label = "Close",
  shortLabel = label,
  ...props
}) {
  return (
    <Button
      className={mergeClassNames(styles.close, className)}
      aria-label={label}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M6 6l12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span className={mergeClassNames(styles.fullLabel)}>{label}</span>
      <span className={mergeClassNames(styles.shortLabel)}>{shortLabel}</span>
    </Button>
  );
}
