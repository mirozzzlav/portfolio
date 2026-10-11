import { mediaQueries } from "src/styles/mediaQueries.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { TagList } from "src/components/TagList.jsx";
import { PreviewSurface } from "src/components/PreviewSurface.jsx";
import { InlineLinks } from "src/components/InlineLinks.jsx";

const divider = {
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "var(--border-width-thin)",
    background: "var(--color-border)",
    boxShadow: "var(--shadow-divider)",
    pointerEvents: "none"
  }
};

const styles = {
  card: {
    flex: "0 0 100%",
    display: "grid",
    alignContent: "start",
    gap: "var(--space-4)",
    width: "100%",
    minHeight: 0,
    overflow: "visible",
    background: "var(--color-transparent)",

    "> *": {
      width: "min(100%, var(--project-description-width))",
      minWidth: 0
    },

    [`@media ${mediaQueries.mobile}`]: {
      minHeight: "auto",
      gap: "var(--space-3)"
    }
  },

  descriptionViewport: {
    display: "grid",
    gap: "var(--space-3)",

    "> section": {
      ...divider,
      paddingTop: "var(--space-3)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-2)",

      "> section": {
        paddingTop: "var(--space-2)"
      }
    }
  },

  description: {
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-base)",
    lineHeight: "var(--line-height-body)",
    textWrap: "pretty",

    [`@media ${mediaQueries.mobile}`]: {
      fontSize: "var(--font-size-sm)"
    }
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "var(--space-2)",
    width: "100%",
    minHeight: "var(--project-header-min-height)",
    lineHeight: "var(--line-height-compact)",

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-1)",
      flexWrap: "nowrap"
    }
  },

  featuresHeading: {
    margin: "0 0 var(--space-1)",
    fontSize: "inherit",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "inherit"
  },

  featuresList: {
    display: "grid",
    gap: "var(--space-0)",
    margin: 0,
    padding: 0,
    listStyle: "none",

    li: {
      position: "relative",
      paddingLeft: "calc(var(--space-1) * 2)",

      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "calc((1em * var(--line-height-body) - var(--space-2) / 2) / 2)",
        width: "calc(var(--space-2) / 2)",
        height: "calc(var(--space-2) / 2)",
        borderRadius: "var(--radius-xs)",
        background: "var(--color-ink)"
      }
    }
  },

  category: {
    flex: "none",
    width: "fit-content",
    marginBottom: 0,
    color: "var(--palette-accent-fine)",
    fontFamily: "var(--font-family-condensed)",
    fontStretch: "semi-condensed",
    fontSize: "var(--font-size-base)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    letterSpacing: "var(--letter-spacing-condensed)",
    textTransform: "uppercase",
    opacity: 1,

    [`@media ${mediaQueries.mobile}`]: {
      fontSize: "var(--font-size-sm)"
    }
  },

  link: {
    color: "var(--color-link)",
    fontWeight: "var(--font-weight-medium)",
    textDecoration: "underline",
    textUnderlineOffset: "var(--space-0)"
  },

  previewsGroupThumbs: {
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
    width: "var(--project-thumbnail-size)",
    aspectRatio: "1",
    maxWidth: "100%",
    margin: 0,

    [`@media ${mediaQueries.mobile}`]: {
      width: "var(--project-thumbnail-size-mobile)"
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
    border: "var(--border-width-thin) solid var(--surface-preview-border)",
    borderRadius: "var(--radius-sm)",
    padding: "var(--space-1)",
    background: "var(--surface-preview-button)",
    backdropFilter: "blur(var(--blur-sm))",
    color: "var(--color-text)",
    cursor: "pointer",
    font: "inherit",
    fontSize: "var(--font-size-xs)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    textAlign: "center",

    "&:disabled": {
      cursor: "default",
      opacity: "var(--opacity-disabled-preview)"
    }
  },

  previewButtonIcon: {
    display: "block",
    flex: "none",
    width: "var(--icon-size-preview)",
    height: "var(--icon-size-preview)",
    color: "var(--palette-accent-fine)"
  },

  previewButtonText: {
    minWidth: 0,
    maxWidth: "100%",
    // Optical alignment of the label with its preview icon.
    marginTop: "-0.18rem",
    color: "var(--color-text)"
  },

  resources: {
    ...divider,
    display: "grid",
    gap: "var(--space-4)",
    paddingTop: "var(--space-4)",

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-3)",
      paddingTop: "var(--space-3)"
    }
  },

  previewActions: {
    display: "grid",
    gap: "var(--space-1)",
    justifyItems: "start"
  }
};

export function PreviewsGroup({ previewImages, images, onClick, title, isActive }) {
  const { content } = useI18n();
  return (
    <div className={className(styles.previewsGroup)}>
      <div className={className(styles.previewsGroupThumbs)}>
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
  const {
    description,
    featuresTitle,
    features,
    images,
    technologies,
    title,
    type,
    url
  } = project;
  const previewImages = images.slice(0, 4);

  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
      <div className={className(styles.header)}>
        <p className={className(styles.category)} data-project-category>
          {type}
        </p>
      </div>
      <div>
        <div className={className(styles.descriptionViewport)}>
          <p className={className(styles.description)}>
            <InlineLinks text={description} tabIndex={isActive ? 0 : -1} />
            <br />
            <a
              className={className(styles.link)}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${content.ui.openProject} ${title}`}
              title={`${content.ui.openProject} ${title}`}
              tabIndex={isActive ? 0 : -1}
            >
              {content.ui.openProject}
            </a>
          </p>
          {features?.length > 0 ? (
            <section className={className(styles.description)}>
              <h3 className={className(styles.featuresHeading)}>{featuresTitle}</h3>
              <ul className={className(styles.featuresList)} role="list">
                {features.map((feature) => (
                  <li key={feature}>
                    <InlineLinks text={feature} tabIndex={isActive ? 0 : -1} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
      <div className={className(styles.resources)}>
        <TagList items={technologies} ariaLabel={content.ui.technologies} />
        <div className={className(styles.previewActions)}>
          {previewImages.length > 0 ? (
            <PreviewsGroup
              previewImages={previewImages}
              images={images}
              isActive={isActive}
              onClick={onPreviewOpen}
              title={title}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
