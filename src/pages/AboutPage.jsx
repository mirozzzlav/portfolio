import portfolioData from "../../data.json";
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
  }
};

export function AboutPage() {
  return (
    <div className={className(styles.copy)}>
      {portfolioData.about.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
