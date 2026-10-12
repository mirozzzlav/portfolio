import { useLocation } from "react-router-dom";
import { normalizePathname } from "src/content/index.js";
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

  square: {
    marginRight: "var(--space-0)",
    transform: "translateY(calc(0.01em + 1px))"
  }
};

export function NavigationLink({
  animation = "slide",
  arrow = "right",
  className,
  hasSquare = true,
  isCurrent,
  item,
  onSelect,
  size = "sm",
  variant = "menu"
}) {
  const location = useLocation();
  const matchedRoute =
    normalizePathname(location.pathname) === normalizePathname(item.path);
  const isActive = isCurrent ?? matchedRoute;

  return (
    <IconLink
      animation={animation}
      arrow={arrow}
      aria-current={isActive ? "true" : undefined}
      className={mergeClassNames(styles.link, className)}
      underline={variant !== "menu"}
      leading={
        hasSquare ? (
          <SelectionIndicator
            className={mergeClassNames(styles.square)}
            isActive={isActive}
          />
        ) : null
      }
      to={item.path}
      onClick={onSelect}
      size={size}
    >
      {item.label}
    </IconLink>
  );
}
