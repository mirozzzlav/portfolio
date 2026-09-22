const sectionExitDurationMs = 240;
const sectionHideTimers = new WeakMap();

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
      navigateToSection(targetId);
    });
  });

  window.addEventListener("popstate", () => {
    setActiveSection(getSectionIdFromHash());
  });
}

function setupSectionScrollNavigation() {
  let accumulatedDelta = 0;
  let lastNavigationTime = 0;
  const cooldownMs = 620;
  const deltaThreshold = 70;

  window.addEventListener(
    "wheel",
    (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        shouldLetScrollableContentHandleWheel(event)
      ) {
        return;
      }

      accumulatedDelta += event.deltaY;

      if (Math.abs(accumulatedDelta) < deltaThreshold) {
        return;
      }

      const now = Date.now();

      if (now - lastNavigationTime < cooldownMs) {
        return;
      }

      const direction = accumulatedDelta > 0 ? 1 : -1;
      const changedSection = navigateToAdjacentSection(direction);

      if (changedSection) {
        event.preventDefault();
        lastNavigationTime = now;
      }

      accumulatedDelta = 0;
    },
    { passive: false }
  );
}

function shouldLetScrollableContentHandleWheel(event) {
  if (!(event.target instanceof Element)) {
    return false;
  }

  const activeSection = document.querySelector("main .section.is-active");
  const scrollableContent = event.target.closest(".section-content");

  return (
    activeSection?.contains(scrollableContent) &&
    scrollableContent.scrollHeight > scrollableContent.clientHeight
  );
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

function getMenuSectionIds() {
  return Array.from(document.querySelectorAll(".site-nav a[href^='#']"))
    .map((link) => {
      const href = link.getAttribute("href");
      return href === "#top" ? "about" : href.slice(1);
    })
    .filter((sectionId) => document.querySelector(`main .section#${sectionId}`));
}

function getActiveSectionId() {
  return (
    document.querySelector("main .section.is-active")?.id || getSectionIdFromHash()
  );
}

function navigateToAdjacentSection(direction) {
  const sectionIds = getMenuSectionIds();
  const activeIndex = sectionIds.indexOf(getActiveSectionId());
  const nextIndex = activeIndex + direction;
  const nextSectionId = sectionIds[nextIndex];

  if (!nextSectionId) {
    return false;
  }

  navigateToSection(nextSectionId);
  return true;
}

function navigateToSection(sectionId) {
  if (getActiveSectionId() === sectionId) {
    return;
  }

  setActiveSection(sectionId);
  history.pushState(null, "", `#${sectionId}`);
}

function setActiveSection(sectionId) {
  const previousSection = document.querySelector("main .section.is-active");

  document.querySelectorAll("main .section").forEach((section) => {
    const isActive = section.id === sectionId;
    const hideTimer = sectionHideTimers.get(section);

    if (hideTimer) {
      window.clearTimeout(hideTimer);
      sectionHideTimers.delete(section);
    }

    if (isActive) {
      section.hidden = false;
      section.classList.remove("is-leaving");
      section.classList.add("is-active");
      return;
    }

    section.classList.remove("is-active");

    if (section === previousSection) {
      section.hidden = false;
      section.classList.add("is-leaving");

      const nextHideTimer = window.setTimeout(() => {
        if (section.classList.contains("is-leaving")) {
          section.classList.remove("is-leaving");
          section.hidden = true;
        }

        sectionHideTimers.delete(section);
      }, sectionExitDurationMs);

      sectionHideTimers.set(section, nextHideTimer);
      return;
    }

    section.classList.remove("is-leaving");
    section.hidden = true;
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute("href");
    const linkSectionId = href === "#top" ? "about" : href.slice(1);
    const isCurrentSection = linkSectionId === sectionId;

    link.toggleAttribute("aria-current", isCurrentSection);
    link.classList.toggle("is-current", isCurrentSection);
  });
}

setupMenu();
setupSectionScrollNavigation();
loadPortfolioData().catch((error) => {
  console.error(error);
});
