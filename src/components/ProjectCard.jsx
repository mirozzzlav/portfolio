import { mediaQueries } from "src/styles/mediaQueries.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { TagList } from "src/components/TagList.jsx";
import { InlineLinks } from "src/components/InlineLinks.jsx";
import { IconLink } from "src/components/IconLink.jsx";
import { SelectionIndicator } from "src/components/SelectionIndicator.jsx";

const styles = {
  card: {
    flex: "0 0 calc(100% - var(--space-0))",
    display: "grid",
    alignContent: "start",
    width: "calc(100% - var(--space-0))",
    minHeight: 0,
    overflow: "visible",
    background: "var(--color-transparent)",
    paddingInline: "var(--space-0)",

    "&[aria-hidden='true']": {
      clipPath: "inset(0)"
    },

    "> *": {
      width: "100%",
      minWidth: 0
    },

    [`@media ${mediaQueries.mobile}`]: {
      minHeight: "auto"
    }
  },

  descriptionViewport: {
    display: "grid",
    gap: "var(--space-3)",
    paddingTop: "var(--space-1)",

    "> section": {
      position: "relative",
      isolation: "isolate",
      padding: "var(--space-3) 0",

      "&::before": {
        "--project-corner-direction": "to right",
        "--project-vertical-direction": "to bottom",
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,
        border: "var(--border-width-thin) solid var(--color-border)",
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        pointerEvents: "none",
        maskImage:
          "linear-gradient(var(--project-corner-direction), var(--color-ink), var(--color-transparent) 85%), linear-gradient(var(--project-vertical-direction), var(--color-ink), var(--color-transparent) 85%)",
        maskComposite: "intersect"
      }
    },

    "> section:first-child::before": {
      display: "none"
    }
  },

  description: {
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    lineHeight: "var(--line-height-body)",
    textWrap: "pretty"
  },

  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "var(--space-3)",
    minWidth: "min(100%, var(--project-actions-min-width))",

    [`@media ${mediaQueries.mobile}`]: {
      minWidth: 0
    }
  },

  blockHeading: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    margin: "0 0 var(--space-2)",
    fontSize: "var(--font-size-md)",
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
        content: '"–"',
        fontWeight: "var(--font-weight-bold)",
        position: "absolute",
        left: 0,
        top: 0,
        color: "var(--color-ink)"
      }
    }
  }
};

function PreviewButton({ images, onClick, title }) {
  const { content } = useI18n();
  return (
    <IconLink
      size="sm"
      underline={false}
      aria-label={`${content.ui.viewPreviews}: ${title}`}
      title={content.ui.viewPreviews}
      aria-haspopup="dialog"
      onClick={() => onClick(images, 0)}
      icon={
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      }
    >
      {content.ui.viewPreviews}
    </IconLink>
  );
}

export function ProjectActions({ project, onPreviewOpen }) {
  const { content } = useI18n();
  return (
    <div className={className(styles.actions)}>
      {project.images.length > 0 ? (
        <PreviewButton
          images={project.images}
          onClick={onPreviewOpen}
          title={project.title}
        />
      ) : null}
      <IconLink
        size="sm"
        underline={false}
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${content.ui.openProject} ${project.title}`}
        title={`${content.ui.openProject} ${project.title}`}
      >
        {content.ui.openProject}
      </IconLink>
    </div>
  );
}

export function ProjectCard({ isActive, project }) {
  const { content } = useI18n();
  const { description, featuresTitle, features, technologies } = project;

  return (
    <article className={className(styles.card)} aria-hidden={!isActive}>
      <div>
        <div className={className(styles.descriptionViewport)}>
          <section className={className(styles.description)}>
            <h3 className={className(styles.blockHeading)}>
              <SelectionIndicator isActive />
              {content.ui.projectDescription}
            </h3>
            <p className={className(styles.description)}>
              <InlineLinks text={description} tabIndex={isActive ? 0 : -1} />
            </p>
          </section>
          {features?.length > 0 ? (
            <section className={className(styles.description)}>
              <h3 className={className(styles.blockHeading)}>
                <SelectionIndicator isActive />
                {featuresTitle}
              </h3>
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
              <h3 className={className(styles.blockHeading)}>
                <SelectionIndicator isActive />
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
