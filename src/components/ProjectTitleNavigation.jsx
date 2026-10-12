import { mediaQueries } from "src/styles/mediaQueries.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { IconLink } from "src/components/IconLink.jsx";

const styles = {
  wrapper: {
    display: "grid",
    gap: "var(--space-4)",
    marginBottom: "var(--space-2xs)",
    width: "min(100%, var(--project-content-width))"
  },

  actionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "var(--space-2) var(--space-3)"
  },

  titlePill: {
    border: "var(--border-width-thin) solid var(--color-border)",
    background: "var(--surface-project)",
    display: "flex",
    flex: "0 1 auto",
    flexDirection: "column",
    justifyContent: "center",
    padding: "var(--space-1) var(--space-4) var(--space-1) var(--space-2)",
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
    color: "var(--color-text)",
    fontSize: "var(--font-size-project-title)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-heading)",
    overflow: "hidden",
    textAlign: "left",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  subtitle: {
    minWidth: 0,
    margin: 0,
    paddingTop: "var(--space-2xs)",
    color: "var(--palette-accent-fine)",
    fontFamily: "var(--font-family-condensed)",
    fontStretch: "semi-condensed",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    letterSpacing: "var(--letter-spacing-condensed)",
    textTransform: "uppercase"
  },

  navigationPill: {
    display: "inline-flex",
    flex: "none",
    gap: "var(--space-1)",
    marginRight: "var(--space-0)",

    [`@media ${mediaQueries.mobile}`]: {
      marginTop: "var(--space-1)"
    }
  },

  navigationSeparator: {
    flex: "none",
    alignSelf: "stretch",
    width: "var(--border-width-thin)",
    background: "var(--color-border)"
  },

  navigationButton: {
    justifyContent: "center",
    lineHeight: "var(--line-height-solid)"
  }
};

export function ProjectTitleNavigation({
  actions,
  hasNext,
  hasPrevious,
  isInteractive = true,
  onNext,
  onPrevious,
  subtitle,
  title
}) {
  const { content } = useI18n();

  return (
    <div className={className(styles.wrapper)}>
      <div className={className(styles.titlePill)}>
        <h2 className={className(styles.title)}>{title}</h2>
        <p className={className(styles.subtitle)} data-project-category>
          {subtitle}
        </p>
      </div>
      <div className={className(styles.actionsRow)}>
        {actions}
        <div
          className={className(styles.navigationPill)}
          aria-label={content.ui.projectNavigation}
        >
          <IconLink
            size="sm"
            underline={false}
            animation="slide"
            arrow="left"
            className={className(styles.navigationButton)}
            disabled={!isInteractive || !hasPrevious}
            onClick={(event) => {
              event.currentTarget.blur();
              onPrevious();
            }}
          >
            {content.ui.previousProject}
          </IconLink>
          <span className={className(styles.navigationSeparator)} aria-hidden="true" />
          <IconLink
            size="sm"
            underline={false}
            animation="slide"
            arrow="right"
            className={className(styles.navigationButton)}
            disabled={!isInteractive || !hasNext}
            onClick={(event) => {
              event.currentTarget.blur();
              onNext();
            }}
          >
            {content.ui.nextProject}
          </IconLink>
        </div>
      </div>
    </div>
  );
}
