import { className } from "../styles/classNames.js";

const styles = {
  label: {
    display: "grid",
    rowGap: "var(--space-1)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-semibold)"
  },

  control: {
    width: "100%",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    font: "inherit",
    transition:
      "background 160ms ease, border-color 160ms ease, outline-color 160ms ease",

    "&:focus": {
      background: "var(--color-surface)",
      borderColor: "var(--color-accent)",
      outline: "3px solid var(--color-focus-ring)"
    },

    "&[aria-invalid='true']": {
      borderColor: "var(--color-error)"
    }
  },

  input: {
    minHeight: "44px",
    padding: "0 var(--space-2)"
  },

  textarea: {
    minHeight: "132px",
    borderRadius: "var(--radius-xl)",
    resize: "none",
    padding: "var(--space-2)"
  },

  error: {
    marginTop: "calc(-1 * var(--space-0))",
    color: "var(--color-error)",
    fontSize: "0.84rem",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: "var(--line-height-body)"
  }
};

export function Field({ as = "input", error, id, label, ...props }) {
  const Control = as;
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <label className={className(styles.label)}>
      {label}
      <Control
        aria-describedby={errorId}
        aria-invalid={error ? "true" : undefined}
        className={className([styles.control, styles[as]])}
        id={id}
        {...props}
      />
      {error ? (
        <span className={className(styles.error)} id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
