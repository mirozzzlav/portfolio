import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";

const styles = {
  frame: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    padding: "var(--space-4) var(--space-5)",
    border: "var(--border-width-thin) solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--palette-surface-muted)",

    [`@media ${mediaQueries.mobile}`]: {
      padding: "var(--space-2) var(--space-3)"
    }
  }
};

export function ProjectPreviewFrame({ children }) {
  return <div className={mergeClassNames(styles.frame)}>{children}</div>;
}
