import { mergeClassNames } from "../styles/classNames.js";
import {
  compactControlSize,
  controlFrame,
  controlSurface,
  pillContent
} from "../styles/controlStyles.js";

const styles = {
  pill: {
    ...controlFrame,
    ...controlSurface,
    ...pillContent
  },

  normal: {
    ...compactControlSize,
    fontSize: "var(--font-size-xs)"
  },

  compact: {
    gap: "var(--control-gap-sm)",
    minHeight: "var(--control-height-sm)",
    padding: "0 var(--space-1)",
    fontSize: "var(--font-size-2xs)",

    svg: {
      width: "var(--icon-size-sm)",
      height: "var(--icon-size-sm)"
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
