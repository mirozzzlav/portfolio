import { mediaQueries } from "src/styles/mediaQueries.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { Button } from "src/components/Button.jsx";

const styles = {
  close: {
    position: "fixed",
    top: "var(--space-4)",
    right: "var(--space-4)",
    zIndex: "var(--layer-modal-control)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "var(--icon-button-size-xl)",
    height: "var(--icon-button-size-xl)",
    borderRadius: "var(--radius-pill)",
    background: "var(--surface-solid)",
    color: "var(--palette-accent-fine)",
    boxShadow: "var(--shadow-menu)",
    fontSize: "var(--font-size-lg)",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: "var(--line-height-solid)",

    svg: {
      display: "block",
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      top: "var(--space-3)",
      right: "var(--space-3)",
      width: "var(--control-height-lg)",
      height: "var(--control-height-lg)"
    }
  }
};

export function CloseButton({ className, label = "Close", ...props }) {
  return (
    <Button
      className={mergeClassNames(styles.close, className)}
      aria-label={label}
      {...props}
      iconOnly
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
    </Button>
  );
}
