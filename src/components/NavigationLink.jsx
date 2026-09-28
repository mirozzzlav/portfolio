import { useLocation } from "react-router-dom";
import { normalizePathname } from "../content/index.js";
import { UiLink } from "./UiLink.jsx";

export function NavigationLink({ isCurrent, item, onSelect, variant = "header" }) {
  const location = useLocation();
  const matchedRoute =
    normalizePathname(location.pathname) === normalizePathname(item.path);
  const isActive = isCurrent ?? matchedRoute;
  const uiVariant = variant === "footer" ? "footer" : "menu";

  return (
    <UiLink isCurrent={isActive} to={item.path} variant={uiVariant} onClick={onSelect}>
      {item.label}
    </UiLink>
  );
}
