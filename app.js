function setupMenu() {
  const menu = document.querySelector(".menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const sectionLinks = document.querySelectorAll('a[href^="#"]');

  function closeMenu() {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otvorit menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Zatvorit menu" : "Otvorit menu");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const targetId = href === "#top" ? "about" : href.slice(1);

      if (!document.querySelector(`main .section#${targetId}`)) {
        return;
      }

      event.preventDefault();
      closeMenu();
      setActiveSection(targetId);
      history.pushState(null, "", `#${targetId}`);
    });
  });

  window.addEventListener("popstate", () => {
    setActiveSection(getSectionIdFromHash());
  });
}

function renderAbout(about) {
  const aboutContainer = document.querySelector("[data-about]");
  aboutContainer.replaceChildren();

  const [intro, ...details] = about.paragraphs;
  const introElement = document.createElement("p");
  introElement.className = "about-intro";
  introElement.textContent = intro;
  aboutContainer.append(introElement);

  if (details.length === 0) {
    return;
  }

  const detailsContainer = document.createElement("div");
  const toggle = document.createElement("button");

  detailsContainer.className = "about-more";
  detailsContainer.hidden = true;

  details.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    detailsContainer.append(element);
  });

  toggle.className = "button button-outline show-more";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "Show more";

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    introElement.classList.toggle("is-expanded", !isExpanded);
    detailsContainer.hidden = isExpanded;
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    toggle.textContent = isExpanded ? "Show more" : "Show less";
  });

  aboutContainer.append(detailsContainer, toggle);
}

function renderProjects(projects) {
  const projectGrid = document.querySelector("[data-projects]");
  projectGrid.replaceChildren();

  projects.forEach((project) => {
    const article = document.createElement("article");
    const gallery = document.createElement("div");
    const type = document.createElement("p");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const technologies = document.createElement("ul");
    const link = document.createElement("a");

    article.className = "project-card";
    gallery.className = "project-gallery";
    gallery.setAttribute("aria-label", project.galleryLabel);

    project.images.forEach((projectImage) => {
      const photo = document.createElement("span");
      photo.classList.add("project-photo");
      photo.setAttribute("role", "img");
      photo.setAttribute("aria-label", projectImage.alt);

      if (projectImage.className) {
        photo.classList.add(projectImage.className);
      }

      if (projectImage.src) {
        const image = document.createElement("img");
        image.src = projectImage.src;
        image.alt = projectImage.alt;
        image.loading = "lazy";
        photo.removeAttribute("role");
        photo.removeAttribute("aria-label");
        photo.append(image);
      }

      gallery.append(photo);
    });

    type.className = "project-type";
    type.textContent = project.type;
    title.textContent = project.title;
    description.textContent = project.description;

    technologies.className = "project-meta";
    technologies.setAttribute("aria-label", "Pouzite technologie");

    project.technologies.forEach((technology) => {
      const item = document.createElement("li");
      item.textContent = technology;
      technologies.append(item);
    });

    link.className = "project-link";
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `Otvorit projekt ${project.title}`);
    link.textContent = "Otvorit projekt";

    article.append(gallery, type, title, description, technologies, link);
    projectGrid.append(article);
  });
}

async function loadPortfolioData() {
  const response = await fetch("data.json");

  if (!response.ok) {
    throw new Error(`Nepodarilo sa nacitat data.json: ${response.status}`);
  }

  const data = await response.json();
  renderAbout(data.about);
  renderProjects(data.projects);
  setActiveSection(getSectionIdFromHash());
}

function getSectionIdFromHash() {
  const hashId = window.location.hash.slice(1);
  const sectionId = hashId === "top" ? "about" : hashId;

  if (document.querySelector(`main .section#${sectionId}`)) {
    return sectionId;
  }

  return "about";
}

function setActiveSection(sectionId) {
  document.querySelectorAll("main .section").forEach((section) => {
    const isActive = section.id === sectionId;
    section.classList.toggle("is-active", isActive);
    section.toggleAttribute("hidden", !isActive);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    const linkSectionId = href === "#top" ? "about" : href.slice(1);
    link.toggleAttribute("aria-current", linkSectionId === sectionId);
  });
}

setupMenu();
loadPortfolioData().catch((error) => {
  console.error(error);
});
