const fireflyLayer = document.querySelector(".firefly-layer");
const fireflyContext = fireflyLayer.getContext("2d");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const fireflyState = {
  animationFrame: null,
  dots: [],
  height: 0,
  width: 0
};

function createFirefly(width, height) {
  const size = Math.floor(Math.random() * 5 + 3);

  return {
    alpha: Math.random() * 0.26 + 0.36,
    drift: Math.random() * 0.006 + 0.002,
    phase: Math.random() * Math.PI * 2,
    size,
    speedX: (Math.random() - 0.5) * 0.28,
    speedY: (Math.random() - 0.5) * 0.22,
    x: Math.random() * width,
    y: Math.random() * height
  };
}

function resizeFireflies() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  fireflyState.width = width;
  fireflyState.height = height;
  fireflyLayer.width = Math.floor(width * pixelRatio);
  fireflyLayer.height = Math.floor(height * pixelRatio);
  fireflyLayer.style.width = `${width}px`;
  fireflyLayer.style.height = `${height}px`;
  fireflyContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.max(18, Math.min(42, Math.floor((width * height) / 26000)));
  fireflyState.dots = Array.from({ length: count }, () => createFirefly(width, height));
}

function drawFireflies(time = 0) {
  fireflyContext.clearRect(0, 0, fireflyState.width, fireflyState.height);

  fireflyState.dots.forEach((dot) => {
    const twinkle = (Math.sin(time * dot.drift + dot.phase) + 1) / 2;
    const opacity = dot.alpha * (0.86 + twinkle * 0.14);
    const x = Math.round(dot.x);
    const y = Math.round(dot.y);
    const glowSize = dot.size * 5.5;
    const midGlowSize = dot.size * 3.2;

    dot.x += dot.speedX + Math.sin(time * 0.0008 + dot.phase) * 0.07;
    dot.y += dot.speedY + Math.cos(time * 0.0007 + dot.phase) * 0.05;

    if (dot.x < -20) dot.x = fireflyState.width + 20;
    if (dot.x > fireflyState.width + 20) dot.x = -20;
    if (dot.y < -20) dot.y = fireflyState.height + 20;
    if (dot.y > fireflyState.height + 20) dot.y = -20;

    fireflyContext.fillStyle = `rgb(255 198 54 / ${opacity * 0.16})`;
    fireflyContext.fillRect(x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);

    fireflyContext.fillStyle = `rgb(255 210 79 / ${opacity * 0.38})`;
    fireflyContext.fillRect(
      x - midGlowSize / 2,
      y - midGlowSize / 2,
      midGlowSize,
      midGlowSize
    );

    fireflyContext.fillStyle = `rgb(255 249 203 / ${Math.min(opacity + 0.18, 1)})`;
    fireflyContext.fillRect(x - dot.size / 2, y - dot.size / 2, dot.size, dot.size);
  });

  if (!reducedMotionQuery.matches) {
    fireflyState.animationFrame = window.requestAnimationFrame(drawFireflies);
  }
}

function startFireflies() {
  if (fireflyState.animationFrame) {
    window.cancelAnimationFrame(fireflyState.animationFrame);
  }

  resizeFireflies();
  drawFireflies();
}

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

window.addEventListener("resize", resizeFireflies);
reducedMotionQuery.addEventListener("change", startFireflies);
startFireflies();
setupMenu();
loadPortfolioData().catch((error) => {
  console.error(error);
});
