const sectionExitDurationMs = 240;
const sectionHideTimers = new WeakMap();
let previewDialog;
let activePreviewProjectImages = [];
let activePreviewImageIndex = 0;

function setupMenu() {
  const menu = document.querySelector(".site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const sectionLinks = document.querySelectorAll('a[href^="#"]');

  function closeMenu() {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otvoriť menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Zatvoriť menu" : "Otvoriť menu");
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

function renderAbout(about) {
  const aboutContainer = document.querySelector("[data-about]");
  aboutContainer.replaceChildren();

  about.paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    aboutContainer.append(element);
  });
}

function createProjectCard(project, projectIndex) {
  const article = document.createElement("article");
  const header = document.createElement("div");
  const gallery = document.createElement("div");
  const type = document.createElement("p");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const technologies = document.createElement("ul");
  const link = document.createElement("a");

  article.className = "project-card";
  article.dataset.projectIndex = String(projectIndex);
  header.className = "project-card-header";
  gallery.className = "project-gallery";
  gallery.setAttribute("aria-label", project.galleryLabel);

  project.images.forEach((projectImage) => {
    const photo = document.createElement("span");
    photo.classList.add("project-preview");
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

    photo.tabIndex = 0;
    photo.addEventListener("click", () => {
      openPreviewDialog(project.images, project.images.indexOf(projectImage));
    });
    photo.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreviewDialog(project.images, project.images.indexOf(projectImage));
      }
    });

    gallery.append(photo);
  });

  type.className = "project-category";
  type.textContent = project.type;
  title.textContent = project.title;
  description.textContent = project.description;

  technologies.className = "project-tech-list";
  technologies.setAttribute("aria-label", "Použité technológie");

  project.technologies.forEach((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    technologies.append(item);
  });

  link.className = "project-link";
  link.href = project.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `Otvoriť projekt ${project.title}`);
  link.textContent = "Otvoriť projekt";

  header.append(type, link);
  article.append(header, description, gallery, technologies);
  article.prepend(title);

  return article;
}

function setupPreviewDialog() {
  previewDialog = document.createElement("div");
  previewDialog.className = "preview-dialog";
  previewDialog.hidden = true;
  previewDialog.innerHTML = `
    <div class="preview-dialog-backdrop" data-preview-close></div>
    <div class="preview-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="preview-dialog-title">
      <button class="preview-dialog-close" type="button" aria-label="Zatvoriť náhľad">×</button>
      <button class="preview-dialog-nav preview-dialog-nav-prev" type="button" aria-label="Predchádzajúci obrázok"></button>
      <div class="preview-dialog-image" role="img"></div>
      <button class="preview-dialog-nav preview-dialog-nav-next" type="button" aria-label="Ďalší obrázok"></button>
      <p id="preview-dialog-title" class="preview-dialog-title"></p>
    </div>
  `;

  previewDialog.addEventListener("click", (event) => {
    if (
      event.target.matches("[data-preview-close]") ||
      event.target.closest(".preview-dialog-close")
    ) {
      closePreviewDialog();
    }
  });

  previewDialog
    .querySelector(".preview-dialog-nav-prev")
    .addEventListener("click", () => showAdjacentPreviewImage(-1));
  previewDialog
    .querySelector(".preview-dialog-nav-next")
    .addEventListener("click", () => showAdjacentPreviewImage(1));

  document.addEventListener("keydown", (event) => {
    if (previewDialog.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closePreviewDialog();
      return;
    }

    if (event.key === "ArrowLeft") {
      showAdjacentPreviewImage(-1);
    }

    if (event.key === "ArrowRight") {
      showAdjacentPreviewImage(1);
    }
  });

  document.body.append(previewDialog);
}

function openPreviewDialog(projectImages, imageIndex) {
  activePreviewProjectImages = projectImages;
  activePreviewImageIndex = imageIndex;
  updatePreviewDialogImage();
  previewDialog.hidden = false;
  previewDialog.querySelector(".preview-dialog-close").focus();
}

function updatePreviewDialogImage() {
  const projectImage = activePreviewProjectImages[activePreviewImageIndex];
  const image = previewDialog.querySelector(".preview-dialog-image");
  const title = previewDialog.querySelector(".preview-dialog-title");

  image.className = "preview-dialog-image";
  image.setAttribute("aria-label", projectImage.alt);

  if (projectImage.className) {
    image.classList.add(projectImage.className);
  }

  title.textContent = projectImage.alt;
}

function showAdjacentPreviewImage(direction) {
  activePreviewImageIndex =
    (activePreviewImageIndex + direction + activePreviewProjectImages.length) %
    activePreviewProjectImages.length;
  updatePreviewDialogImage();
}

function closePreviewDialog() {
  previewDialog.hidden = true;
}

function renderProjects(projects) {
  const projectStage = document.querySelector("[data-projects]");
  const projectsContent = projectStage.parentElement;
  const projectTrack = document.createElement("div");
  let activeProjectIndex = 0;

  function updateProjectView() {
    projectTrack.style.transform = `translateX(-${activeProjectIndex * 100}%)`;

    projectTrack.querySelectorAll(".project-card").forEach((card, index) => {
      card.toggleAttribute("aria-hidden", index !== activeProjectIndex);
    });
  }

  projectTrack.className = "project-track";
  projects.forEach((project, projectIndex) => {
    projectTrack.append(createProjectCard(project, projectIndex));
  });

  projectStage.replaceChildren(projectTrack);
  updateProjectView();

  projectsContent.querySelector(".project-controls")?.remove();

  if (projects.length < 2) {
    return;
  }

  const controls = document.createElement("div");

  function selectProject(nextProjectIndex) {
    if (nextProjectIndex === activeProjectIndex) {
      return;
    }

    activeProjectIndex = nextProjectIndex;
    updateProjectView();
    updateProjectControls();
  }

  function updateProjectControls() {
    controls.querySelectorAll(".project-dot").forEach((control, index) => {
      const isActive = index === activeProjectIndex;
      control.classList.toggle("is-active", isActive);
      control.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  controls.className = "project-controls";
  controls.setAttribute("aria-label", "Výber projektov");

  projects.forEach((project, projectIndex) => {
    const control = document.createElement("button");
    control.className = "project-dot";
    control.type = "button";
    control.setAttribute("aria-label", `Zobraziť projekt ${project.title}`);
    control.addEventListener("pointerdown", (event) => {
      event.preventDefault();
    });
    control.addEventListener("click", () => {
      control.blur();
      selectProject(projectIndex);
    });
    controls.append(control);
  });

  updateProjectControls();
  projectsContent.append(controls);
}

async function loadPortfolioData() {
  const response = await fetch("data.json");

  if (!response.ok) {
    throw new Error(`Nepodarilo sa načítať data.json: ${response.status}`);
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

function getActiveSectionId() {
  return (
    document.querySelector("main .section.is-active")?.id || getSectionIdFromHash()
  );
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
setupPreviewDialog();
loadPortfolioData().catch((error) => {
  console.error(error);
});
