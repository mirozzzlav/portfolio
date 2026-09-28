import { className } from "../styles/classNames.js";
import { useI18n } from "../useI18n.js";
import { UiLink } from "./UiLink.jsx";

const pillBase = {
  border: "1px solid var(--color-border)",
  background:
    "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) 34%)"
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "var(--space-2)",
    marginBottom: "var(--space-2)",
    justifyContent: "space-between",
    width: "min(100%, 680px)",

    "@media (max-width: 620px)": {
      gap: "var(--space-1)"
    }
  },

  titlePill: {
    ...pillBase,
    display: "flex",
    flex: "0 1 auto",
    alignItems: "center",
    minWidth: 0,
    minHeight: "44px",
    width: "fit-content",
    maxWidth: "100%",
    borderLeft: "var(--space-0) solid var(--palette-accent-fine)",
    borderRadius:
      "var(--radius-lg) var(--radius-pill) var(--radius-pill) var(--radius-lg)"
  },

  title: {
    minWidth: 0,
    margin: 0,
    padding: "0 var(--space-4) 0 var(--space-2)",
    color: "var(--color-text)",
    fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
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
    flex: "none"
  },

  navigationButton: {
    justifyContent: "center",
    borderRadius: 0,
    padding: "0 var(--space-2)",
    color: "var(--color-accent)",
    lineHeight: "var(--line-height-compact)",
    whiteSpace: "nowrap",

    "& + &": {
      borderLeft: "1px solid var(--color-border)"
    },

    "&:focus-visible": {
      outline: "2px solid var(--color-accent)",
      outlineOffset: "-2px"
    },

    "&:not(:disabled):hover": {
      color: "var(--palette-accent-fine)"
    },

    "@media (max-width: 520px)": {
      padding: "0 var(--space-1)"
    }
  }
};

function ProjectTitlePill({ title }) {
  return (
    <div className={className(styles.titlePill)}>
      <h3 className={className(styles.title)}>{title}</h3>
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
