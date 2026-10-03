import { Footer } from "src/components/Footer.jsx";
import { Header } from "src/components/Header.jsx";
import { PageHeading } from "src/components/PageHeading.jsx";
import { PageSection } from "src/components/PageSection.jsx";
import { SnakeGame } from "src/components/SnakeGame.jsx";
import {
  MOBILE_OR_TABLET_QUERY,
  useIsMobileOrTablet
} from "src/hooks/useIsMobileOrTablet.js";
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

    [`@media ${MOBILE_OR_TABLET_QUERY}`]: {
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

    [`@media ${MOBILE_OR_TABLET_QUERY}`]: {
      display: "none"
    }
  },
  game: {
    width: "min(100%, 520px)",
    minWidth: 0
  }
};

export function AppLayout({
  children,
  sectionId,
  title,
  aside = (
    <div className={className(styles.game)}>
      <SnakeGame />
    </div>
  )
}) {
  const isMobileOrTablet = useIsMobileOrTablet();

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
        {!isMobileOrTablet && (
          <aside className={className(styles.visualPanel)}>{aside}</aside>
        )}
      </div>
      <Footer />
    </>
  );
}
