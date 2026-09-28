import { AboutPage } from "src/pages/AboutPage.jsx";
import { ContactPage } from "src/pages/ContactPage.jsx";
import { ProjectsPage } from "src/pages/ProjectsPage.jsx";

const pageComponentsBySection = {
  about: AboutPage,
  contact: ContactPage,
  projects: ProjectsPage
};

export function attachPageComponents(routes) {
  return routes.map((route) => ({
    ...route,
    Component: pageComponentsBySection[route.sectionId]
  }));
}
