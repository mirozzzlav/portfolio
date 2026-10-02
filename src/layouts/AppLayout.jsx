import { BlurLoadedImage } from "src/components/BlurLoadedImage.jsx";
import { Footer } from "src/components/Footer.jsx";
import { Header } from "src/components/Header.jsx";
import { PageHeading } from "src/components/PageHeading.jsx";
import { PageSection } from "src/components/PageSection.jsx";
import { className } from "src/styles/classNames.js";

const styles = {
  appBody: {
    position: "relative",
    zIndex: 10,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    alignContent: "start",
    alignItems: "start",
    gap: "var(--section-inline-gap) var(--space-6)",
    padding:
      "calc(var(--header-height) + var(--space-3)) var(--main-inline-pad) var(--space-7)",

    "@media (max-width: 1000px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  },

  main: {
    position: "relative",
    zIndex: 10,
    display: "grid",
    alignItems: "start",
    width: "100%",
    minWidth: 0
  },

  visualPanel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: 0,
    overflow: "hidden",
    background: "var(--color-background)",

    "@media (max-width: 1000px)": {
      display: "none"
    }
  },
  visualImage: {
    display: "block",
    width: "min(100%, 520px)",
    height: "auto",
    aspectRatio: "1",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "var(--radius-sm)"
  },
  visualImageMedia: {
    display: "block",
    objectFit: "contain"
  }
};

export function AppLayout({
  children,
  sectionId,
  title,
  aside = (
    <BlurLoadedImage
      className={className(styles.visualImage)}
      imageClassName={className(styles.visualImageMedia)}
      src="/assets/bg.webp"
      placeholderSrc="/assets/bg-placeholder.webp"
      alt=""
    />
  )
}) {
  return (
    <>
      <Header />
      <div className={className(styles.appBody)}>
        <PageHeading title={title} />
        <main id="top" className={className(styles.main)} data-section={sectionId}>
          <PageSection sectionId={sectionId} title={title}>
            {children}
          </PageSection>
        </main>
        <aside className={className(styles.visualPanel)}>{aside}</aside>
      </div>
      <Footer />
    </>
  );
}
