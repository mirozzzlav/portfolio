import { getContent, localizePath } from "./content/index.js";

export const basePageRouteDefinitions = [
  { path: "/", sectionId: "about" },
  { path: "/projects", sectionId: "projects" },
  { path: "/contact", sectionId: "contact" }
];

export function getPageRouteDefinitions(language) {
  const content = getContent(language);

  return basePageRouteDefinitions.map((route) => ({
    ...route,
    label: content.routes[route.sectionId].label,
    path: localizePath(route.path, language),
    title: content.routes[route.sectionId].title,
    unlocalizedPath: route.path
  }));
}

export function getRedirectRoutes(language) {
  return [
    {
      from: localizePath("/about", language),
      to: localizePath("/", language)
    }
  ];
}
