import { className } from "src/styles/classNames.js";

const styles = {
  pageTitle: {
    gridColumn: "1 / -1",
    position: "relative",
    display: "inline-block",
    width: "fit-content",
    margin: 0,
    padding: "0 var(--space-1) var(--space-0) 0",
    color: "var(--palette-ink)",
    fontSize: "clamp(1.8rem, 1.55rem + 1.25vw, 2.55rem)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-display)",
    letterSpacing: 0,

    "&::before": {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: "14%",
      zIndex: -1,
      height: "38%",
      borderRadius: "var(--radius-sm)",
      background: "var(--palette-accent-soft)",
      content: '""'
    }
  }
};

export function PageHeading({ title }) {
  return <h1 className={className(styles.pageTitle)}>{title}</h1>;
}
