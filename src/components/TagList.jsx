/** @jsxImportSource @emotion/react */

const styles = {
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-1)",
    margin: 0,
    minHeight: "1.85rem",
    padding: 0,
    listStyle: "none",

    li: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: "24px",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-pill)",
      padding: "0 var(--space-1)",
      background: "var(--palette-accent-soft)",
      color: "var(--palette-ink)",
      fontSize: "0.78rem",
      fontWeight: "var(--font-weight-medium)",
      lineHeight: 1
    },

    "li:nth-of-type(2n)": {
      background: "var(--palette-surface-muted)"
    },

    "li:nth-of-type(3n)": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)",
      color: "var(--color-on-accent)"
    }
  }
};

export function TagList({ ariaLabel, items }) {
  return (
    <ul css={styles.list} aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
