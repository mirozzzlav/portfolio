import { AboutPage } from "./AboutPage.jsx";
import { ContactPage } from "./ContactPage.jsx";
import { ProjectsPage } from "./ProjectsPage.jsx";

export const pageRoutes = [
  { Component: AboutPage, label: "O mne", path: "/", sectionId: "about", title: "O mne" },
  {
    Component: ProjectsPage,
    label: "Projekty",
    path: "/projects",
    sectionId: "projects",
    title: "Projekty"
  },
  {
    Component: ContactPage,
    label: "Kontakt",
    path: "/contact",
    sectionId: "contact",
    title: "Kontakt"
  }
];

export const redirectRoutes = [{ from: "/about", to: "/" }];
