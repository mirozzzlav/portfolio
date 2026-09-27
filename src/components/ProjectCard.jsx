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

    "@media (max-width: 780px)": {
      minHeight: "auto"
    }
  },

  titleAndNavWrapper: {
    display: "flex",
    gap: "var(--space-2)",
    marginBottom: "var(--space-2)",
    justifyContent: "space-between"
  },

  titlePill: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    border: "1px solid var(--color-border)",
    borderLeft: "var(--space-0) solid var(--palette-accent-fine)",
    borderRadius:
      "var(--radius-lg) var(--radius-pill) var(--radius-pill) var(--radius-lg)",
    background:
      "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) 34%)",
    alignItems: "center"
  },
  title: {
    minWidth: 0,
    margin: 0,
    padding: "0 var(--space-4) 0 var(--space-2)",
    color: "var(--color-text)",
    fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-heading)",
    textAlign: "left"
  },

  titleNav: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-0)",
    minHeight: "44px",
    overflow: "hidden",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    background:
      "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) 34%)"
  },

  titleNavButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    minHeight: "100%",
    border: 0,
    borderRadius: 0,
    padding: "0 var(--space-2)",
    background: "var(--color-transparent)",
    color: "var(--color-accent)",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.88rem",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    whiteSpace: "nowrap",

    "&:hover:not(:disabled)": {
      background: "var(--palette-accent-soft)"
    },

    "& + &": {
      borderLeft: "1px solid var(--color-border)"
    },

    "&:focus-visible": {
      outline: "2px solid var(--color-accent)",
      outlineOffset: "-2px"
    },

    "&:disabled": {
      cursor: "default",
      opacity: 0.36
    },

    "@media (max-width: 520px)": {
      padding: "0 var(--space-1)"
    }
  },

  titleNavLabel: {
    "@media (max-width: 520px)": {
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap"
    }
  },

  titleNavIcon: {
    display: "block",
    flex: "none",
    width: "1rem",
    height: "1rem"
  },

  descriptionFrame: {
    position: "relative",
    width: "min(100%, 68ch)",
    marginBottom: "var(--space-2)"
  },

  descriptionViewport: {
    paddingRight: "var(--space-2)",

    "@media (max-width: 780px)": {
      paddingRight: "var(--space-1)"
    }
  },

  description: {
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "1rem",
    lineHeight: "var(--line-height-body)",
    textWrap: "pretty",

    "@media (max-width: 780px)": {
      fontSize: "0.92rem"
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
    fontWeight: "var(--font-weight-semibold)",
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
    marginTop: "var(--space-1)",
    alignSelf: "center",
    color: "var(--color-accent)",
    fontSize: "1rem",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    textDecoration: "none",

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
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridTemplateRows: "repeat(2, minmax(0, 1fr))",
    alignItems: "center",
    gap: "var(--space-0)",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    margin: 0,

    "@media (max-width: 780px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
    }
  },

  previewWrapper: {
    position: "relative",
    display: "grid",
    gap: "var(--space-0)",
    width: "160px",
    aspectRatio: "1",
    maxWidth: "100%",
    margin: "0 0 var(--space-1)",

    "@media (max-width: 780px)": {
      width: "128px"
    }
  },

  previewButton: {
    appearance: "none",
    position: "absolute",
    inset: 0,
    zIndex: 2,
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "var(--space-0)",
    width: "100%",
    height: "100%",
    border:
      "1px solid color-mix(in srgb, var(--color-surface) 42%, var(--color-transparent))",
    borderRadius: "var(--radius-sm)",
    padding: "var(--space-1)",
    background:
      "color-mix(in srgb, var(--color-surface) 52%, var(--color-transparent))",
    backdropFilter: "blur(4px)",
    color: "var(--color-text)",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.84rem",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    textAlign: "center",

    "&:focus-visible": {
      outline: "2px solid var(--color-accent)",
      outlineOffset: "3px"
    },

    "&:disabled": {
      cursor: "default",
      opacity: 0.45
    }
  },

  previewButtonIcon: {
    display: "block",
    flex: "none",
    width: "2.5rem",
    height: "2.5rem",
    color: "var(--palette-accent-fine)"
  },

  previewButtonText: {
    minWidth: 0,
    maxWidth: "100%",
    marginTop: "-0.18rem",
    color: "var(--color-text)"
  },

  tags: {
    boxSizing: "border-box",
    marginBottom: "var(--space-3)"
  }
};

export function ProjectCard({
  hasNextProject,
  hasPreviousProject,
  isActive,
  onNextProject,
  onPreviewOpen,
  onPreviousProject,
  project
}) {
  const previewImages = project.images.slice(0, 4);

  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
      <div className={className(styles.titleAndNavWrapper)}>
        <div className={className(styles.titlePill)}>
          <h3 className={className(styles.title)}>{project.title}</h3>
        </div>
        <div className={className(styles.titleNav)} aria-label="Prepínanie projektov">
          <button
            className={className(styles.titleNavButton)}
            type="button"
            disabled={!isActive || !hasPreviousProject}
            tabIndex={isActive ? 0 : -1}
            onClick={(event) => {
              event.currentTarget.blur();
              onPreviousProject();
            }}
          >
            <svg
              className={className(styles.titleNavIcon)}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M10 3.5 5.5 8l4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <span className={className(styles.titleNavLabel)}>Predošlý</span>
          </button>
          <button
            className={className(styles.titleNavButton)}
            type="button"
            disabled={!isActive || !hasNextProject}
            tabIndex={isActive ? 0 : -1}
            onClick={(event) => {
              event.currentTarget.blur();
              onNextProject();
            }}
          >
            <span className={className(styles.titleNavLabel)}>Ďalší</span>
            <svg
              className={className(styles.titleNavIcon)}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M6 3.5 10.5 8 6 12.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={className(styles.header)}>
        <p className={className(styles.category)} data-project-category>
          {project.type}
        </p>
      </div>
      <div className={className(styles.descriptionFrame)}>
        <div className={className(styles.descriptionViewport)}>
          <p className={className(styles.description)}>{project.description}</p>
        </div>
      </div>
      <div className={className(styles.tags)}>
        <TagList items={project.technologies} ariaLabel="Použité technológie" />
      </div>
      {previewImages.length > 0 ? (
        <div className={className(styles.previewWrapper)}>
          <div className={className(styles.gallery)} aria-label={project.galleryLabel}>
            {previewImages.map((image, imageIndex) => (
              <ProjectPreview
                image={image}
                isInteractive={isActive}
                key={`${project.title}-${image.alt}`}
                onOpen={() => onPreviewOpen(project.images, imageIndex)}
              />
            ))}
          </div>
          <button
            className={className(styles.previewButton)}
            type="button"
            disabled={!isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onPreviewOpen(project.images, 0)}
          >
            <svg
              className={className(styles.previewButtonIcon)}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M2 8s2.1-3.5 6-3.5S14 8 14 8s-2.1 3.5-6 3.5S2 8 2 8Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.45"
              />
              <path
                d="M8 6.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.45"
              />
            </svg>
            <span className={className(styles.previewButtonText)}>Pozrieť náhľady</span>
          </button>
        </div>
      ) : null}
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
    </article>
  );
}
