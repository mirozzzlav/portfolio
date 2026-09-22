function setupMenu() {
  const menu = document.querySelector(".menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

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
}

function renderAbout(about) {
  const aboutContainer = document.querySelector("[data-about]");
  aboutContainer.replaceChildren();

  if (about.portrait) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    figure.className = "about-portrait";
    image.src = about.portrait.src;
    image.alt = about.portrait.alt;
    image.width = about.portrait.width;
    image.height = about.portrait.height;

    figure.append(image);
    aboutContainer.append(figure);
  }

  about.paragraphs.forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    aboutContainer.append(element);
  });
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
}

setupMenu();
loadPortfolioData().catch((error) => {
  console.error(error);
});
