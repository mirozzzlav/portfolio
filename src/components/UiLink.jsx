import { mergeClassNames } from "src/styles/classNames.js";
import { IconLink } from "src/components/IconLink.jsx";
import { SelectionIndicator } from "src/components/SelectionIndicator.jsx";

const styles = {
  link: {
    display: "flex",
    paddingInline: "var(--space-1)",

    "&:not(:disabled):hover [data-selection-indicator]": {
      borderColor: "var(--palette-accent-fine)",
      background: "var(--palette-accent-fine)"
    },

    "&:disabled [data-selection-indicator]": {
      borderColor: "var(--color-border)",
      background: "var(--color-surface)"
    }
  },

  menu: {
    "&:not(:disabled):hover, &:not(:disabled):focus-visible": {
      textDecorationLine: "none",

      "> [data-link-text]": {
        textDecorationLine: "none"
      }
    }
  },

  square: {
    marginRight: "var(--space-0)",
    transform: "translateY(calc(0.01em + 1px))"
  }
};

export function UiLink({
  animation = "slide",
  arrow = "right",
  children,
  className,
  hasSquare = true,
  icon,
  isCurrent = false,
  size = "sm",
  variant = "standard",
  ...props
}) {
  return (
    <IconLink
      animation={animation}
      arrow={arrow}
      aria-current={isCurrent ? "true" : undefined}
      className={mergeClassNames(
        styles.link,
        variant === "menu" && styles.menu,
        className
      )}
      leading={
        hasSquare ? (
          <SelectionIndicator
            className={mergeClassNames(styles.square)}
            isActive={isCurrent}
          />
        ) : null
      }
      icon={icon}
      size={size}
      {...props}
    >
      {children}
    </IconLink>
  );
}
