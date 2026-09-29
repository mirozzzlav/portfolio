import { BlurLoadedImage } from "src/components/BlurLoadedImage.jsx";
import { Footer } from "src/components/Footer.jsx";
import { Header } from "src/components/Header.jsx";
import { className } from "src/styles/classNames.js";

const styles = {
  appBody: {
    display: "grid",
    gridTemplateColumns: "55fr 45fr",
    gap: "var(--space-6)",
    paddingTop: "var(--header-height)",

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
    padding:
      "var(--space-3) var(--main-inline-pad) var(--space-7) var(--main-inline-pad)"
  },

  visualPanel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
    padding:
      "var(--space-6) var(--main-inline-pad) var(--space-7) var(--main-inline-pad)",
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

export function AppLayout({ children, sectionId }) {
  return (
    <>
      <Header />
      <div className={className(styles.appBody)}>
        <main id="top" className={className(styles.main)} data-section={sectionId}>
          {children}
        </main>
        <aside className={className(styles.visualPanel)} aria-hidden="true">
          <BlurLoadedImage
            className={className(styles.visualImage)}
            imageClassName={className(styles.visualImageMedia)}
            src="/assets/bg.webp"
            placeholderSrc="/assets/bg-placeholder.webp"
            alt=""
          />
        </aside>
      </div>
      <Footer />
    </>
  );
}
