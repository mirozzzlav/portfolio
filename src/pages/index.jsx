import { AboutPage } from "./AboutPage.jsx";
import { ContactPage } from "./ContactPage.jsx";
import { ProjectsPage } from "./ProjectsPage.jsx";
import { pageRouteDefinitions, redirectRoutes } from "../routes.js";

const pageComponentsBySection = {
  about: AboutPage,
  contact: ContactPage,
  projects: ProjectsPage
};

export const pageRoutes = pageRouteDefinitions.map((route) => ({
  ...route,
  Component: pageComponentsBySection[route.sectionId]
}));

export { redirectRoutes };
