/** @jsxImportSource @emotion/react */

const styles = {
  label: {
    display: "grid",
    gap: "var(--space-1)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)"
  },

  control: {
    width: "100%",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    font: "inherit",
    transition:
      "background 160ms ease, border-color 160ms ease, outline-color 160ms ease",

    "&:focus": {
      background: "var(--color-surface)",
      borderColor: "var(--color-accent)",
      outline: "3px solid var(--color-focus-ring)"
    }
  },

  input: {
    minHeight: "44px",
    padding: "0 var(--space-2)"
  },

  textarea: {
    minHeight: "132px",
    resize: "none",
    padding: "var(--space-2)"
  }
};

export function Field({ as = "input", label, ...props }) {
  const Control = as;

  return (
    <label css={styles.label}>
      {label}
      <Control css={[styles.control, styles[as]]} {...props} />
    </label>
  );
}
