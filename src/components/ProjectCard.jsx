/** @jsxImportSource @emotion/react */
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
      minHeight: "calc(1.45rem * 1.18)",
      color: "var(--color-text)",
      fontSize: "clamp(1.15rem, 1.55vw, 1.45rem)",
      fontWeight: "var(--font-weight-medium)",
      lineHeight: 1.18,
      textWrap: "balance"
    },

    "p:not([data-project-category])": {
      marginBottom: 0,
      minHeight: "calc(1.58em * 3)",
      color: "var(--color-text)",
      fontSize: "1rem",
      lineHeight: 1.58,
      textWrap: "pretty"
    },

    "@media (max-width: 780px)": {
      minHeight: "auto",

      "p:not([data-project-category])": {
        minHeight: "calc(0.92rem * 2 * 5)",
        fontSize: "0.92rem",
        lineHeight: 1.48
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
    lineHeight: 1.1,

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
    lineHeight: 1.1,
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
    lineHeight: 1.1,
    textDecoration: "none",

    "&::before": {
      marginRight: "var(--space-2)",
      color: "var(--color-border)",
      content: '"|"',
      fontWeight: "var(--font-weight-regular)",
      textDecoration: "none"
    },

    "&::after": {
      marginLeft: "var(--space-1)",
      content: '"->"',
      transition: "transform 160ms ease"
    },

    "&:hover::after": {
      transform: "translateX(var(--space-0))"
    },

    "@media (max-width: 780px)": {
      fontSize: "0.92rem"
    }
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
    <article css={styles.card} aria-hidden={!isActive}>
      <h3>{project.title}</h3>
      <div css={styles.header}>
        <p css={styles.category} data-project-category>
          {project.type}
        </p>
        <a
          css={styles.link}
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Otvoriť projekt ${project.title}`}
          tabIndex={isActive ? 0 : -1}
        >
          Otvoriť projekt
        </a>
      </div>
      <p>{project.description}</p>
      <div css={styles.gallery} aria-label={project.galleryLabel}>
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
