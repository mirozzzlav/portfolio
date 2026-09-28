import { useLocation } from "react-router-dom";
import { normalizePathname } from "src/content/index.js";
import { UiLink } from "src/components/UiLink.jsx";

export function NavigationLink({
  arrow = "right",
  className,
  hasSquare = true,
  isCurrent,
  item,
  onSelect
}) {
  const location = useLocation();
  const matchedRoute =
    normalizePathname(location.pathname) === normalizePathname(item.path);
  const isActive = isCurrent ?? matchedRoute;

  return (
    <UiLink
      arrow={arrow}
      className={className}
      hasSquare={hasSquare}
      isCurrent={isActive}
      to={item.path}
      onClick={onSelect}
    >
      {item.label}
    </UiLink>
  );
}
