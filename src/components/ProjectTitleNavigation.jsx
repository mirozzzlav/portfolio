import { className } from "../styles/classNames.js";

const pillBase = {
  border: "1px solid var(--color-border)",
  background:
    "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) 34%)"
};

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap"
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
      alignItems: "stretch",
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
    ...pillBase,
    display: "inline-flex",
    alignItems: "stretch",
    flex: "none",
    minHeight: "44px",
    overflow: "hidden",
    borderRadius: "var(--radius-pill)"
  },

  navigationButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    minHeight: "44px",
    border: 0,
    borderRadius: 0,
    padding: "0 var(--space-2)",
    background: "var(--color-transparent)",
    color: "var(--color-accent)",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.88rem",
    fontWeight: "var(--font-weight-semibold)",
    lineHeight: "var(--line-height-compact)",
    whiteSpace: "nowrap",

    "&:hover:not(:disabled)": {
      background: "var(--palette-accent-soft)"
    },

    "& + &": {
      borderLeft: "1px solid var(--color-border)"
    },

    "&:focus-visible": {
      outline: "2px solid var(--color-accent)",
      outlineOffset: "-2px"
    },

    "&:disabled": {
      cursor: "default",
      opacity: 0.36
    },

    "@media (max-width: 520px)": {
      padding: "0 var(--space-1)"
    }
  },

  navigationLabel: {
    "@media (max-width: 520px)": {
      ...visuallyHidden
    }
  },

  navigationIcon: {
    display: "block",
    flex: "none",
    width: "1rem",
    height: "1rem"
  }
};

export function ProjectNavigationArrow({ direction }) {
  const path =
    direction === "previous" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5";

  return (
    <svg
      className={className(styles.navigationIcon)}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ProjectTitlePill({ title }) {
  return (
    <div className={className(styles.titlePill)}>
      <h3 className={className(styles.title)}>{title}</h3>
    </div>
  );
}

export function ProjectNavigationControls({
  hasNext,
  hasPrevious,
  isInteractive = true,
  onNext,
  onPrevious
}) {
  return (
    <div className={className(styles.navigationPill)} aria-label="Prepínanie projektov">
      <button
        className={className(styles.navigationButton)}
        type="button"
        disabled={!isInteractive || !hasPrevious}
        tabIndex={isInteractive ? 0 : -1}
        onClick={(event) => {
          event.currentTarget.blur();
          onPrevious();
        }}
      >
        <ProjectNavigationArrow direction="previous" />
        <span className={className(styles.navigationLabel)}>Predošlý</span>
      </button>
      <button
        className={className(styles.navigationButton)}
        type="button"
        disabled={!isInteractive || !hasNext}
        tabIndex={isInteractive ? 0 : -1}
        onClick={(event) => {
          event.currentTarget.blur();
          onNext();
        }}
      >
        <span className={className(styles.navigationLabel)}>Ďalší</span>
        <ProjectNavigationArrow direction="next" />
      </button>
    </div>
  );
}

export function ProjectTitleNavigation(props) {
  return (
    <div className={className(styles.wrapper)}>
      <ProjectTitlePill title={props.title} />
      <ProjectNavigationControls
        hasNext={props.hasNext}
        hasPrevious={props.hasPrevious}
        isInteractive={props.isInteractive}
        onNext={props.onNext}
        onPrevious={props.onPrevious}
      />
    </div>
  );
}
