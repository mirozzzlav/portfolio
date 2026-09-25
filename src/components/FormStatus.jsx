import { className } from "../styles/classNames.js";

const styles = {
  status: {
    display: "inline-flex",
    alignItems: "flex-start",
    gap: "var(--space-1)",
    width: "100%",
    maxWidth: "100%",
    margin: "var(--space-1) 0 0",
    padding: "var(--space-1) var(--space-2)",
    border: "1px solid currentColor",
    borderRadius: "var(--radius-xl)",
    fontSize: "0.92rem",
    fontWeight: "var(--font-weight-medium)",
    lineHeight: "var(--line-height-body)",
    textWrap: "pretty"
  },

  icon: {
    display: "block",
    flex: "none",
    width: "1.28rem",
    height: "1.28rem",
    marginTop: "0.08rem"
  },

  success: {
    background:
      "color-mix(in srgb, var(--color-success) 10%, var(--color-transparent))",
    color: "var(--color-success)"
  },

  error: {
    background: "color-mix(in srgb, var(--color-error) 10%, var(--color-transparent))",
    color: "var(--color-error)"
  }
};

function FormStatusIcon({ type }) {
  if (type === "success") {
    return (
      <svg className={className(styles.icon)} viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M13.25 4.75 6.75 11.25 3.5 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      </svg>
    );
  }

  return (
    <svg className={className(styles.icon)} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 5.5v3.25m0 2.25h.01M7.1 2.9 2.05 11.7A1.15 1.15 0 0 0 3.05 13.5h9.9a1.15 1.15 0 0 0 1-1.8L8.9 2.9a1.04 1.04 0 0 0-1.8 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

export function FormStatus({ children, type = "error" }) {
  if (!children) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <p
      className={className([styles.status, isSuccess ? styles.success : styles.error])}
      role={isSuccess ? "status" : "alert"}
    >
      <FormStatusIcon type={type} />
      {children}
    </p>
  );
}
