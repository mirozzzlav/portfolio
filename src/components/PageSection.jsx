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
    gridArea: "1 / 1",
    width: "100%",
    display: "grid",
    alignItems: "start",
    minHeight: 0,
    padding: 0,
    animation: "section-enter 280ms ease-out both",

    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 1,
      transform: "none"
    }
  },

  pageContent: {
    minWidth: 0,
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
      <div className={className([styles.pageContent, pageContentVariants[sectionId]])}>
        {children}
      </div>
    </section>
  );
}
