export const pageRouteDefinitions = [
  { label: "O mne", path: "/", sectionId: "about", title: "O mne" },
  {
    label: "Projekty",
    path: "/projects",
    sectionId: "projects",
    title: "Projekty"
  },
  {
    label: "Kontakt",
    path: "/contact",
    sectionId: "contact",
    title: "Kontakt"
  }
];

export const redirectRoutes = [{ from: "/about", to: "/" }];
