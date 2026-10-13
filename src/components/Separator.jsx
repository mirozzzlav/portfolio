import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  base: {
    display: "block",
    flex: "none",
    alignSelf: "stretch",
    color: "var(--color-border)",
    background: "currentColor"
  },

  vertical: {
    width: "var(--border-width-thin)"
  },

  horizontal: {
    height: "var(--border-width-thin)"
  }
};

export function Separator({ className, orientation = "vertical" }) {
  return (
    <span
      className={mergeClassNames(styles.base, styles[orientation], className)}
      aria-hidden="true"
    />
  );
}
