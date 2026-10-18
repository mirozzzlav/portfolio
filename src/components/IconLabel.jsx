import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  wrapper: {
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    gap: "var(--space-0)",
    color: "var(--color-text)",
    font: "inherit",
    fontSize: "var(--font-size-base)",

    "> svg": {
      display: "block",
      flex: "none",
      width: "var(--icon-size-md)",
      height: "var(--icon-size-md)",
      color: "var(--palette-accent-fine)"
    }
  }
};

export function IconLabel({
  as: Component = "span",
  children,
  className,
  fontWeight = "var(--font-weight-medium)",
  icon,
  ...props
}) {
  return (
    <Component className={mergeClassNames(styles.wrapper, className)} {...props}>
      {icon}
      <span className={mergeClassNames({ fontWeight })}>{children}</span>
    </Component>
  );
}
