import { useEffect, useRef, useState } from "react";
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
      display: "block",
      overflow: "hidden",
      marginBottom: "var(--space-2)",
      maxWidth: "24ch",
      minHeight: "calc(1em * var(--line-height-heading))",
      width: "fit-content",
      border: "1px solid var(--color-border)",
      borderLeft: 0,
      borderRadius:
        "var(--radius-lg) var(--radius-pill) var(--radius-pill) var(--radius-lg)",
      padding: "var(--space-0) var(--space-5) var(--space-0) var(--space-0)",
      background:
        "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) 34%)",
      color: "var(--color-text)",
      fontSize: "clamp(1.15rem, 1.55vw, 1.45rem)",
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: "var(--line-height-heading)",
      textOverflow: "ellipsis",
      textWrap: "nowrap",
      whiteSpace: "nowrap"
    },

    "@media (max-width: 780px)": {
      minHeight: "auto"
    }
  },

  descriptionFrame: {
    position: "relative",
    width: "min(100%, 68ch)",
    height: "calc(1rem * var(--line-height-body) * 4.5)",
    marginBottom: "var(--space-3)",

    "&::after": {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: 0,
      display: "block",
      height: "2.6rem",
      background:
        "linear-gradient(to bottom, color-mix(in srgb, var(--color-surface), var(--color-transparent) 100%) 0%, color-mix(in srgb, var(--color-surface), var(--color-transparent) 18%) 48%, var(--color-surface) 100%)",
      content: '""',
      opacity: 1,
      pointerEvents: "none"
    },

    '&[data-has-more="false"]::after': {
      opacity: 0
    },

    "@media (max-width: 780px)": {
      height: "calc(0.92rem * var(--line-height-body) * 4.5)"
    }
  },

  descriptionViewport: {
    height: "100%",
    overflowY: "auto",
    overscrollBehavior: "contain",
    paddingRight: "var(--space-2)",
    paddingTop: "var(--space-1)",
    paddingBottom: "var(--space-1)",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--color-ink) var(--color-transparent)",

    "&::-webkit-scrollbar": {
      width: "0.4rem"
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: "var(--radius-pill)",
      background: "var(--color-ink)"
    },

    "&::-webkit-scrollbar-track": {
      background: "var(--color-transparent)"
    },

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
    margin: "0 0 var(--space-1)",

    "@media (max-width: 780px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      width: "min(100%, 238px)"
    }
  }
};

export function ProjectCard({ isActive, onPreviewOpen, project }) {
  const descriptionRef = useRef(null);
  const [hasMoreDescription, setHasMoreDescription] = useState(false);

  useEffect(() => {
    const descriptionElement = descriptionRef.current;

    if (!descriptionElement) {
      return undefined;
    }

    function updateDescriptionFade() {
      const remainingScroll =
        descriptionElement.scrollHeight -
        descriptionElement.scrollTop -
        descriptionElement.clientHeight;

      setHasMoreDescription(remainingScroll > 1);
    }

    updateDescriptionFade();
    descriptionElement.addEventListener("scroll", updateDescriptionFade, {
      passive: true
    });
    window.addEventListener("resize", updateDescriptionFade);

    return () => {
      descriptionElement.removeEventListener("scroll", updateDescriptionFade);
      window.removeEventListener("resize", updateDescriptionFade);
    };
  }, [isActive, project.description]);

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
      <div
        className={className(styles.descriptionFrame)}
        data-has-more={hasMoreDescription ? "true" : "false"}
      >
        <div className={className(styles.descriptionViewport)} ref={descriptionRef}>
          <p className={className(styles.description)}>{project.description}</p>
        </div>
      </div>
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
