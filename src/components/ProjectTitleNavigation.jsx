import { useEffect, useRef, useState } from "react";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { IconLink } from "src/components/IconLink.jsx";

const styles = {
  wrapper: {
    display: "grid",
    gap: "var(--space-2xs)",
    paddingBottom: "var(--space-2)",
    borderBottom: "var(--border-width-thin) solid var(--color-border)",
    width: "100%",

    "&[data-title-wrapped='true']": {
      gap: "var(--space-2)"
    }
  },

  actionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "var(--space-2) var(--space-3)"
  },

  titleBlock: {
    display: "flex",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: "0 var(--space-2)",
    minWidth: 0
  },

  title: {
    minWidth: 0,
    margin: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-project-title)",
    fontWeight: "var(--font-weight-extrabold)",
    letterSpacing: "var(--letter-spacing-project-title)",
    textTransform: "uppercase",
    lineHeight: "var(--line-height-heading)",
    textAlign: "left",
    overflowWrap: "anywhere"
  },

  subtitle: {
    minWidth: 0,
    margin: 0,
    color: "var(--palette-accent-brown)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    lineHeight: "var(--line-height-compact)"
  },

  navigation: {
    display: "inline-flex",
    alignItems: "center",
    flex: "none",
    gap: "var(--space-1)",
    marginRight: "var(--space-0)",
    padding: "var(--space-1) var(--space-2)",
    border: "var(--border-width-thin) solid var(--color-transparent)",
    borderRadius: "var(--radius-pill)",

    "&[data-wrapped='true']": {
      marginTop: "var(--space-2)",
      marginBottom: "var(--space-0)",
      borderColor: "var(--color-border)",
      background: "var(--surface-project)"
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
    lineHeight: "var(--line-height-solid)",

    "> svg": {
      color: "var(--color-ink)"
    }
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
  const titleBlockRef = useRef(null);
  const [isSubtitleWrapped, setIsSubtitleWrapped] = useState(false);
  const actionsRowRef = useRef(null);
  const navigationRef = useRef(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const row = actionsRowRef.current;
    const navigation = navigationRef.current;
    const actionLinks = row.firstElementChild;
    const titleBlock = titleBlockRef.current;
    const heading = titleBlock.firstElementChild;
    const subtitleText = titleBlock.lastElementChild;

    const observer = new ResizeObserver(() => {
      setIsSubtitleWrapped(
        subtitleText.getBoundingClientRect().top >=
          heading.getBoundingClientRect().bottom
      );
      setIsWrapped(
        navigation.getBoundingClientRect().top >=
          actionLinks.getBoundingClientRect().bottom
      );
    });

    observer.observe(row);
    observer.observe(actionLinks);
    observer.observe(navigation);
    observer.observe(titleBlock);
    observer.observe(heading);
    observer.observe(subtitleText);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className(styles.wrapper)} data-title-wrapped={isSubtitleWrapped}>
      <div ref={titleBlockRef} className={className(styles.titleBlock)}>
        <h2 className={className(styles.title)}>{title}</h2>
        <p className={className(styles.subtitle)} data-project-category>
          # {subtitle}
        </p>
      </div>
      <div ref={actionsRowRef} className={className(styles.actionsRow)}>
        {actions}
        <div
          ref={navigationRef}
          className={className(styles.navigation)}
          data-wrapped={isWrapped}
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
