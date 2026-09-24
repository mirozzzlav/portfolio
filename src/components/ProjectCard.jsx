import { className } from "../styles/classNames.js";
import { ProjectPreview } from "./ProjectPreview.jsx";
import { TagList } from "./TagList.jsx";

const styles = {
  card: {
    flex: "0 0 100%",
    display: "grid",
    alignContent: "start",
    gap: 0,
    width: "100%",
    minHeight: 0,
    overflow: "visible",
    padding: 0,
    background: "var(--color-transparent)",

    h3: {
      marginBottom: "var(--space-2)",
      maxWidth: "24ch",
      minHeight: "calc(1.45rem * var(--line-height-heading))",
      color: "var(--color-text)",
      fontSize: "clamp(1.15rem, 1.55vw, 1.45rem)",
      fontWeight: "var(--font-weight-medium)",
      lineHeight: "var(--line-height-heading)",
      textWrap: "balance"
    },

    "p:not([data-project-category])": {
      marginBottom: 0,
      minHeight: "calc(var(--line-height-body) * 1em * 3)",
      color: "var(--color-text)",
      fontSize: "1rem",
      lineHeight: "var(--line-height-body)",
      textWrap: "pretty"
    },

    "@media (max-width: 780px)": {
      minHeight: "auto",

      "p:not([data-project-category])": {
        minHeight: "calc(0.92rem * var(--line-height-body) * 5)",
        fontSize: "0.92rem",
        lineHeight: "var(--line-height-body)"
      }
    }
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "var(--space-2)",
    width: "100%",
    minHeight: "1.2rem",
    marginBottom: "var(--space-2)",
    lineHeight: "var(--line-height-compact)",

    "@media (max-width: 780px)": {
      gap: "var(--space-1)",
      flexWrap: "nowrap"
    }
  },

  category: {
    flex: "none",
    width: "fit-content",
    marginBottom: 0,
    color: "var(--palette-accent-fine)",
    fontSize: "1rem",
    fontWeight: "var(--font-weight-medium)",
    lineHeight: "var(--line-height-compact)",
    letterSpacing: 0,
    opacity: 1,

    "@media (max-width: 780px)": {
      fontSize: "0.92rem"
    }
  },

  link: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    marginTop: 0,
    alignSelf: "center",
    color: "var(--color-accent)",
    fontSize: "1rem",
    fontWeight: "var(--font-weight-medium)",
    lineHeight: "var(--line-height-compact)",
    textDecoration: "none",

    "&::before": {
      marginRight: "var(--space-2)",
      color: "var(--color-border)",
      content: '"|"',
      fontWeight: "var(--font-weight-regular)",
      textDecoration: "none"
    },

    "&:hover svg": {
      transform: "translateX(var(--space-0))"
    },

    "@media (max-width: 780px)": {
      fontSize: "0.92rem"
    }
  },

  linkIcon: {
    display: "block",
    flex: "none",
    width: "1rem",
    height: "1rem",
    marginLeft: "var(--space-1)",
    transition: "transform 160ms ease"
  },

  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    alignItems: "center",
    gap: "var(--space-2)",
    width: "80%",
    margin: "var(--space-2) 0 var(--space-1)",

    "@media (max-width: 780px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      width: "min(100%, 260px)"
    }
  }
};

export function ProjectCard({ isActive, onPreviewOpen, project }) {
  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
      <h3>{project.title}</h3>
      <div className={className(styles.header)}>
        <p className={className(styles.category)} data-project-category>
          {project.type}
        </p>
        <a
          className={className(styles.link)}
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Otvoriť projekt ${project.title}`}
          tabIndex={isActive ? 0 : -1}
        >
          Otvoriť projekt
          <svg
            className={className(styles.linkIcon)}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M4 8h8m-3-3 3 3-3 3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
            />
          </svg>
        </a>
      </div>
      <p>{project.description}</p>
      <div className={className(styles.gallery)} aria-label={project.galleryLabel}>
        {project.images.map((image, imageIndex) => (
          <ProjectPreview
            image={image}
            isInteractive={isActive}
            key={`${project.title}-${image.alt}`}
            onOpen={() => onPreviewOpen(project.images, imageIndex)}
          />
        ))}
      </div>
      <TagList items={project.technologies} ariaLabel="Použité technológie" />
    </article>
  );
}
