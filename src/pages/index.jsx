import { AboutPage } from "./AboutPage.jsx";
import { ContactPage } from "./ContactPage.jsx";
import { ProjectsPage } from "./ProjectsPage.jsx";

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
