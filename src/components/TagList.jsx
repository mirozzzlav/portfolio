import { className } from "../styles/classNames.js";

const styles = {
  list: {
    display: "flex",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    columnGap: "var(--space-1)",
    rowGap: "0.3rem",
    height: "4.25rem",
    margin: 0,
    minHeight: "4.25rem",
    overflowX: "hidden",
    overflowY: "hidden",
    padding: 0,
    listStyle: "none",

    li: {
      display: "inline-flex",
      alignItems: "center",
      flex: "none",
      height: "27px",
      minHeight: "27px",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-pill)",
      padding: "0 var(--space-2)",
      background: "var(--color-surface)",
      color: "var(--palette-ink)",
      fontSize: "0.84rem",
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: "var(--line-height-solid)"
    }
  }
};

export function TagList({ ariaLabel, items }) {
  return (
    <ul className={className(styles.list)} aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
