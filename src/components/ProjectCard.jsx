import { mediaQueries } from "src/styles/mediaQueries.js";
import { className } from "src/styles/classNames.js";
import { textLink } from "src/styles/linkStyles.js";
import { useI18n } from "src/useI18n.js";
import { TagList } from "src/components/TagList.jsx";
import { InlineLinks } from "src/components/InlineLinks.jsx";
import { IconLabel } from "src/components/IconLabel.jsx";

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
      width: "min(100%, var(--project-content-width))",
      minWidth: 0
    },

    [`@media ${mediaQueries.mobile}`]: {
      minHeight: "auto",
      gap: "var(--space-3)"
    }
  },

  descriptionViewport: {
    display: "grid",
    gap: "var(--space-4)",

    "> section": {
      ...divider,
      paddingTop: "var(--space-4)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-3)",

      "> section": {
        paddingTop: "var(--space-3)"
      }
    }
  },

  description: {
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    lineHeight: "var(--line-height-body)",
    textWrap: "pretty"
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-2)",
    width: "min(100%, var(--project-content-width))",
    marginBottom: "var(--space-4)",
    minHeight: "var(--project-header-min-height)",
    lineHeight: "var(--line-height-compact)",

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-1)",
      marginBottom: "var(--space-3)",
      flexWrap: "nowrap"
    }
  },

  featuresHeading: {
    margin: "0 0 var(--space-2)",
    fontSize: "inherit",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "inherit"
  },

  featuresList: {
    display: "grid",
    gap: "var(--space-1)",
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
    flex: "0 1 auto",
    minWidth: 0,
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

  link: textLink,

  previewButton: {
    appearance: "none",
    justifyContent: "center",
    gap: "var(--space-0)",
    minHeight: "var(--control-height-sm)",
    border: 0,
    borderRadius: "var(--radius-sm)",
    padding: "var(--space-0) var(--space-1)",
    background: "var(--color-transparent)",
    cursor: "pointer",
    lineHeight: "var(--line-height-compact)",
    whiteSpace: "nowrap",

    "> svg": {
      width: "calc(var(--icon-size-lg) + var(--space-0))",
      height: "calc(var(--icon-size-lg) + var(--space-0))"
    },

    "&:hover": {
      background:
        "color-mix(in srgb, var(--palette-accent-soft) 50%, var(--color-surface))"
    },

    [`@media ${mediaQueries.mobile}`]: {
      minWidth: "var(--control-height-md)",
      minHeight: "var(--control-height-md)"
    }
  }
};

function PreviewButton({ images, onClick, title }) {
  const { content } = useI18n();
  return (
    <IconLabel
      as="button"
      className={className(styles.previewButton)}
      type="button"
      aria-label={`${content.ui.viewPreviews}: ${title}`}
      title={content.ui.viewPreviews}
      aria-haspopup="dialog"
      onClick={() => onClick(images, 0)}
      icon={
        <svg viewBox="0 0 16 16" aria-hidden="true">
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
      }
    >
      {content.ui.viewPreviews}
    </IconLabel>
  );
}

export function ProjectSubtitle({ project, onPreviewOpen }) {
  return (
    <div className={className(styles.header)}>
      <p className={className(styles.category)} data-project-category>
        {project.type}
      </p>
      {project.images.length > 0 ? (
        <PreviewButton
          images={project.images}
          onClick={onPreviewOpen}
          title={project.title}
        />
      ) : null}
    </div>
  );
}

export function ProjectCard({ isActive, project }) {
  const { content } = useI18n();
  const { description, featuresTitle, features, technologies, title, url } = project;

  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
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
          {technologies?.length > 0 ? (
            <section className={className(styles.description)}>
              <h3 className={className(styles.featuresHeading)}>
                {content.ui.technologies}
              </h3>
              <TagList items={technologies} ariaLabel={content.ui.technologies} />
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
