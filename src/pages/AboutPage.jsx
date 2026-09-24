/** @jsxImportSource @emotion/react */
import portfolioData from "../../data.json";
import { SectionPage } from "../components/SectionPage.jsx";

const styles = {
  copy: {
    display: "grid",
    gap: "var(--space-3)",
    maxWidth: "60ch",

    p: {
      marginBottom: 0,
      color: "var(--color-text)",
      fontSize: "var(--font-size-md)",
      lineHeight: 1.72,
      textWrap: "pretty"
    }
  }
};

export function AboutPage() {
  return (
    <SectionPage sectionId="about" title="O mne">
      <div css={styles.copy}>
        {portfolioData.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </SectionPage>
  );
}
