import { mediaQueries } from "src/styles/mediaQueries.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { UiLink } from "src/components/UiLink.jsx";

const pillBase = {
  border: "var(--border-width-thin) solid var(--color-border)",
  background: "var(--surface-project)"
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "var(--space-2)",
    marginBottom: "var(--space-2xs)",
    justifyContent: "space-between",
    width: "min(100%, var(--project-content-width))",

    [`@media ${mediaQueries.narrow}`]: {
      gap: "var(--space-1)"
    }
  },

  titlePill: {
    ...pillBase,
    display: "flex",
    flex: "0 1 auto",
    alignItems: "center",
    minWidth: 0,
    minHeight: "var(--control-height-lg)",
    width: "fit-content",
    maxWidth: "100%",
    borderLeft: "var(--space-0) solid var(--palette-accent-fine)",
    borderRadius:
      "var(--radius-sm) var(--radius-pill) var(--radius-pill) var(--radius-sm)"
  },

  title: {
    minWidth: 0,
    margin: 0,
    padding: "0 var(--space-4) 0 var(--space-2)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-project-title)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-heading)",
    overflow: "hidden",
    textAlign: "left",
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    whiteSpace: "nowrap"
  },

  navigationPill: {
    display: "inline-flex",
    flex: "none",
    gap: "var(--space-1)",
    marginRight: "var(--space-2xs)"
  },

  navigationSeparator: {
    flex: "none",
    alignSelf: "stretch",
    width: "var(--border-width-thin)",
    background: "var(--color-border)"
  },

  navigationButton: {
    justifyContent: "center",
    paddingInline: 0,
    color: "var(--color-accent)",
    lineHeight: "var(--line-height-solid)",
    whiteSpace: "nowrap",

    "&:not(:disabled):hover": {
      color: "var(--palette-accent-fine)"
    }
  }
};

function ProjectTitlePill({ title }) {
  return (
    <div className={className(styles.titlePill)}>
      <h2 className={className(styles.title)}>{title}</h2>
    </div>
  );
}

function ProjectNavigationControls({
  hasNext,
  hasPrevious,
  isInteractive = true,
  onNext,
  onPrevious
}) {
  const { content } = useI18n();

  return (
    <div
      className={className(styles.navigationPill)}
      aria-label={content.ui.projectNavigation}
    >
      <UiLink
        arrow="left"
        className={className(styles.navigationButton)}
        disabled={!isInteractive || !hasPrevious}
        hasSquare={false}
        onClick={(event) => {
          event.currentTarget.blur();
          onPrevious();
        }}
      >
        {content.ui.previousProject}
      </UiLink>
      <span className={className(styles.navigationSeparator)} aria-hidden="true" />
      <UiLink
        arrow="right"
        className={className(styles.navigationButton)}
        disabled={!isInteractive || !hasNext}
        hasSquare={false}
        onClick={(event) => {
          event.currentTarget.blur();
          onNext();
        }}
      >
        {content.ui.nextProject}
      </UiLink>
    </div>
  );
}

export function ProjectTitleNavigation({
  hasNext,
  hasPrevious,
  isInteractive,
  onNext,
  onPrevious,
  title
}) {
  return (
    <div className={className(styles.wrapper)}>
      <ProjectTitlePill title={title} />
      <ProjectNavigationControls
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        isInteractive={isInteractive}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </div>
  );
}
