import { mergeClassNames } from "src/styles/classNames.js";
import { Button } from "src/components/Button.jsx";

const styles = {
  nav: {
    width: "var(--icon-button-size-xl)",
    height: "var(--icon-button-size-xl)",

    "&:disabled, &:disabled:hover, &:disabled:active": {
      borderColor: "var(--color-border)",
      background: "var(--surface-solid)",
      boxShadow: "none",
      color: "var(--color-text)",
      cursor: "default",
      opacity: "var(--opacity-disabled)"
    }
  }
};

export function ArrowButton({ direction, className, ...props }) {
  const isPrevious = direction === "previous";

  return (
    <Button {...props} className={mergeClassNames(styles.nav, className)} iconOnly>
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
