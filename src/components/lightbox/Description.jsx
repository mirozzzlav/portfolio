import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";

const styles = {
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--lightbox-spacing) * 2 / 3)",
    width: "fit-content",
    maxWidth: "100%",
    marginInline: "auto",
    padding: "calc(var(--lightbox-spacing) * 2 / 3) var(--lightbox-spacing)",
    marginBottom: 0,
    border: "var(--lightbox-border-width) solid var(--lightbox-border-color)",
    borderRadius: "var(--lightbox-radius)",
    background: "var(--lightbox-caption-background)",
    color: "var(--lightbox-text-color)",
    fontSize: "var(--lightbox-font-size)",
    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: 1.5,
    textAlign: "center",
    overflowWrap: "anywhere"
  },

  titleIcon: {
    display: "block",
    flex: "none",
    width: "calc(var(--lightbox-icon-size) * 1.5)",
    height: "calc(var(--lightbox-icon-size) * 1.5)",
    color: "var(--lightbox-text-color)",

    [`@media ${mediaQueries.mobile}`]: {
      width: "calc(var(--lightbox-icon-size) * 1.25)",
      height: "calc(var(--lightbox-icon-size) * 1.25)"
    }
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
