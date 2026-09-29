import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { TagList } from "src/components/TagList.jsx";
import { UiLink } from "src/components/UiLink.jsx";
import { PreviewSurface } from "src/components/PreviewSurface.jsx";

const styles = {
  card: {
    flex: "0 0 100%",
    display: "grid",
    alignContent: "start",
    gap: 0,
    width: "100%",
    minHeight: 0,
    overflow: "visible",
    background: "var(--color-transparent)",
    padding: "var(--space-0)",

    "@media (max-width: 780px)": {
      minHeight: "auto"
    }
  },

  descriptionFrame: {
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
    width: "fit-content",
    marginTop: "var(--space-1)",
    alignSelf: "center",
    color: "var(--color-accent)",
    paddingBlock: 0
  },

  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridTemplateRows: "repeat(2, minmax(0, 1fr))",
    alignItems: "center",
    gap: "var(--space-0)",
    width: "100%",
    height: "100%",
    margin: 0
  },

  previewsGroup: {
    position: "relative",
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

export function PreviewsGroup({ previewImages, images, onClick, title, isActive }) {
  const { content } = useI18n();
  return (
    <div className={className(styles.previewsGroup)}>
      <div className={className(styles.gallery)}>
        {previewImages.map((image) => (
          <PreviewSurface key={`${title}-${image.alt}`} image={image} tabIndex={-1} />
        ))}
      </div>
      <button
        className={className(styles.previewButton)}
        type="button"
        disabled={!isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={() => onClick(images, 0)}
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
        <span className={className(styles.previewButtonText)}>
          {content.ui.viewPreviews}
        </span>
      </button>
    </div>
  );
}

export function ProjectCard({ isActive, onPreviewOpen, project }) {
  const { content } = useI18n();
  const { description, images, technologies, title, type, url } = project;
  const previewImages = images.slice(0, 4);

  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
      <div className={className(styles.header)}>
        <p className={className(styles.category)} data-project-category>
          {type}
        </p>
      </div>
      <div className={className(styles.descriptionFrame)}>
        <div className={className(styles.descriptionViewport)}>
          <p className={className(styles.description)}>{description}</p>
        </div>
      </div>
      <div className={className(styles.tags)}>
        <TagList items={technologies} ariaLabel={content.ui.technologies} />
      </div>
      {previewImages.length > 0 ? (
        <PreviewsGroup
          previewImages={previewImages}
          images={images}
          isActive={isActive}
          onClick={onPreviewOpen}
          title={title}
        />
      ) : null}
      <UiLink
        className={className(styles.link)}
        href={url}
        hasSquare={false}
        target="_blank"
        rel="noreferrer"
        aria-label={`${content.ui.openProject} ${title}`}
        tabIndex={isActive ? 0 : -1}
      >
        {content.ui.openProject}
      </UiLink>
    </article>
  );
}
