import { useEffect, useRef, useState } from "react";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { IconLink } from "src/components/IconLink.jsx";
import { IconLabel } from "src/components/IconLabel.jsx";
import { TechnologyIcon } from "src/components/TechnologyIcon.jsx";
import { Separator } from "src/components/Separator.jsx";

const styles = {
  wrapper: {
    position: "sticky",
    top: "var(--header-height)",
    zIndex: "var(--layer-content)",
    display: "grid",
    gap: "var(--space-2xs)",
    paddingTop: "var(--space-2)",
    paddingBottom: "var(--space-2)",
    background: "var(--surface-solid)",
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
    margin: 0
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
        <IconLabel
          as="p"
          className={className(styles.subtitle)}
          fontWeight="var(--font-weight-semibold)"
          icon={<TechnologyIcon name="hash" />}
          data-project-category
        >
          {subtitle}
        </IconLabel>
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
          <Separator />
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
