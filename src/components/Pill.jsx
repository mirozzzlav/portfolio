import { mergeClassNames } from "../styles/classNames.js";

const styles = {
  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    background: "var(--color-surface)",
    color: "var(--color-ink)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-solid)",
    textTransform: "uppercase",

    svg: {
      flex: "none",
      color: "var(--palette-accent-fine)"
    }
  },

  normal: {
    gap: "0.4rem",
    minHeight: "38px",
    padding: "0 var(--space-2)",
    fontSize: "0.84rem",

    svg: {
      width: "16px",
      height: "16px"
    }
  },

  compact: {
    gap: "0.32rem",
    minHeight: "30px",
    padding: "0 var(--space-1)",
    fontSize: "0.78rem",

    svg: {
      width: "14px",
      height: "14px"
    }
  }
};

const sizeStyles = {
  compact: styles.compact,
  normal: styles.normal
};

export function Pill({
  as: Component = "span",
  children,
  className,
  size = "normal",
  ...props
}) {
  return (
    <Component
      className={mergeClassNames(styles.pill, sizeStyles[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
