import { useMatch } from "react-router-dom";
import { UiLink } from "./UiLink.jsx";

export function NavigationLink({ item, onSelect, variant = "header" }) {
  const isHome = item.path === "/";
  const isActive = Boolean(useMatch(isHome ? "/" : `${item.path}/*`));
  const uiVariant = variant === "footer" ? "footer" : "menu";

  return (
    <UiLink
      isCurrent={isActive}
      to={item.path}
      variant={uiVariant}
      onClick={onSelect}
    >
      {item.label}
    </UiLink>
  );
}
