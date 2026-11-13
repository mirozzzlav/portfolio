import { mergeClassNames } from "src/styles/classNames.js";
import { LightboxButton } from "src/components/lightbox/LightboxButton.jsx";

const styles = {
  nav: {
    width: "calc(var(--lightbox-button-size) * 1.2)",
    height: "calc(var(--lightbox-button-size) * 1.2)"
  }
};

export function ArrowButton({ direction, className, ...props }) {
  const isPrevious = direction === "previous";

  return (
    <LightboxButton
      {...props}
      className={mergeClassNames(styles.nav, className)}
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
    </LightboxButton>
  );
}
