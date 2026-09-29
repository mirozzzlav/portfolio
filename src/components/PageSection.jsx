import { className } from "src/styles/classNames.js";

const pageContentVariants = {
  projects: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "var(--space-1)",
    maxWidth: "none"
  }
};

const styles = {
  pageSection: {
    "--section-space": "var(--section-inline-gap)",

    gridArea: "1 / 1",
    width: "100%",
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "var(--section-space)",
    minHeight: 0,
    padding: 0,
    animation: "section-enter 280ms ease-out both",

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 1,
      transform: "none"
    }
  },

  pageHeading: {
    display: "grid",
    gap: "var(--space-1)"
  },

  pageTitle: {
    position: "relative",
    display: "inline-block",
    width: "fit-content",
    margin: 0,
    padding: "0 var(--space-1) var(--space-0) 0",
    color: "var(--palette-ink)",
    fontSize: "clamp(1.2rem, 3vw, 2.55rem)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-display)",
    letterSpacing: 0,

    "&::before": {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: "14%",
      zIndex: -1,
      height: "38%",
      borderRadius: "var(--radius-sm)",
      background: "var(--palette-accent-soft)",
      content: '""'
    },

    "@media (max-width: 780px)": {
      fontSize: "clamp(1.8rem, 8vw, 2.2rem)"
    }
  },

  pageContent: {
    maxWidth: "75ch",
    overflow: "visible",
    padding: 0
  }
};

export function PageSection({ children, sectionId, title }) {
  return (
    <section
      id={sectionId}
      className={className(styles.pageSection)}
      aria-label={title}
    >
      <div className={className(styles.pageHeading)}>
        <h2 className={className(styles.pageTitle)}>{title}</h2>
      </div>
      <div className={className([styles.pageContent, pageContentVariants[sectionId]])}>
        {children}
      </div>
    </section>
  );
}
