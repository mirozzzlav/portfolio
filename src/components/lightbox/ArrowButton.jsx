import { mediaQueries } from "src/styles/mediaQueries.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { Button } from "src/components/Button.jsx";

const styles = {
  nav: {
    position: "absolute",
    top: "50%",
    zIndex: 2,
    width: "var(--icon-button-size-xl)",
    height: "var(--icon-button-size-xl)",
    borderRadius: "var(--radius-pill)",
    background: "var(--surface-solid)",
    boxShadow: "var(--shadow-menu)",

    "&:disabled, &:disabled:hover, &:disabled:active": {
      borderColor: "var(--color-border)",
      background: "var(--surface-solid)",
      boxShadow: "none",
      color: "var(--color-text)",
      cursor: "default",
      opacity: "var(--opacity-disabled)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      width: "var(--control-height-lg)",
      height: "var(--control-height-lg)",
      boxShadow: "var(--shadow-menu)"
    }
  },

  navPrev: {
    left: "var(--space-3)",
    transform: "translateY(-50%)",

    [`@media ${mediaQueries.mobile}`]: {
      left: "var(--space-2)"
    }
  },

  navNext: {
    right: "var(--space-4)",
    transform: "translateY(-50%)",

    [`@media ${mediaQueries.mobile}`]: {
      right: "var(--space-3)"
    }
  }
};

export function ArrowButton({ direction, className, ...props }) {
  const isPrevious = direction === "previous";

  return (
    <Button
      {...props}
      className={mergeClassNames(
        styles.nav,
        isPrevious ? styles.navPrev : styles.navNext,
        className
      )}
      iconOnly
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d={isPrevious ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"}
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
