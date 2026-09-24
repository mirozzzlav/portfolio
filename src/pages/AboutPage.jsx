import { Link } from "react-router-dom";
import portfolioData from "../../data.json";
import { Button } from "../components/Button.jsx";
import { className } from "../styles/classNames.js";

const styles = {
  copy: {
    display: "grid",
    gap: "var(--space-4)",

    p: {
      marginBottom: 0,
      color: "var(--color-text)",
      fontSize: "var(--font-size-md)",
      lineHeight: "var(--line-height-prose)",
      textWrap: "pretty"
    }
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--space-2)",
  }
};

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 6.75h15a1.75 1.75 0 0 1 1.75 1.75v9a1.75 1.75 0 0 1-1.75 1.75h-15a1.75 1.75 0 0 1-1.75-1.75v-9A1.75 1.75 0 0 1 4.5 6.75Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m3.25 8.25 7.82 5.28a1.65 1.65 0 0 0 1.86 0l7.82-5.28"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.4a9.6 9.6 0 0 0-3 18.7c.48.08.66-.2.66-.46v-1.68c-2.68.58-3.24-1.16-3.24-1.16-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.08-.58.08-.58.98.06 1.5 1 1.5 1 .86 1.48 2.28 1.06 2.82.8.08-.62.34-1.06.62-1.3-2.14-.24-4.4-1.08-4.4-4.76 0-1.06.38-1.92 1-2.6-.1-.24-.44-1.24.1-2.56 0 0 .82-.26 2.64 1a9.08 9.08 0 0 1 4.8 0c1.82-1.26 2.64-1 2.64-1 .54 1.32.2 2.32.1 2.56.62.68 1 1.54 1 2.6 0 3.7-2.26 4.5-4.42 4.74.36.3.68.9.68 1.82v2.54c0 .26.18.54.68.46A9.6 9.6 0 0 0 12 2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AboutPage() {
  return (
    <div className={className(styles.copy)}>
      {portfolioData.about.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <div className={className(styles.actions)} aria-label="Kontaktné odkazy">
        <Button as={Link} compact to="/contact">
          <EnvelopeIcon />
          Kontakt
        </Button>
        <Button
          as="a"
          compact
          href={portfolioData.social.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon />
          GitHub
        </Button>
      </div>
    </div>
  );
}
