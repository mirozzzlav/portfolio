/** @jsxImportSource @emotion/react */

const sectionContentVariants = {
  projects: {
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "var(--space-1)"
  },
  contact: {
    marginLeft: "calc(var(--section-space) - var(--space-1))",
    paddingLeft: "var(--space-1)"
  }
};

const styles = {
  section: {
    "--section-space": "var(--section-inline-gap)",

    gridArea: "1 / 1",
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    minHeight: 0,
    padding: 0,
    animation: "section-enter 280ms ease-out both",

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 1,
      transform: "none"
    },

    "@media (max-width: 780px)": {
      "--section-space": "var(--section-inline-gap)"
    }
  },

  heading: {
    display: "grid",
    gap: "var(--space-1)",

    "@media (max-width: 780px)": {
      marginBottom: "var(--space-3)"
    }
  },

  title: {
    position: "relative",
    display: "inline-block",
    width: "fit-content",
    margin: 0,
    padding: "0 var(--space-1) var(--space-0) 0",
    color: "var(--palette-ink)",
    fontSize: "clamp(1.2rem, 3vw, 2.55rem)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: 0.98,
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
    }
  },

  content: {
    minHeight: 0,
    overflowY: "auto",
    padding: "var(--space-5) 0 0 0",
    scrollbarColor: "var(--color-transparent) var(--color-transparent)",
    scrollbarWidth: "none",

    "&::-webkit-scrollbar": {
      width: 0,
      height: 0
    },

    "@media (max-width: 780px)": {
      overflowY: "auto"
    }
  }
};

export function SectionPage({ children, sectionId, title }) {
  return (
    <section id={sectionId} css={styles.section} aria-label={title}>
      <div css={styles.heading}>
        <h2 css={styles.title}>{title}</h2>
      </div>
      <div css={[styles.content, sectionContentVariants[sectionId]]}>{children}</div>
    </section>
  );
}
