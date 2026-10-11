import { Link } from "react-router-dom";
import { Button } from "src/components/Button.jsx";
import EyeLogo from "src/components/EyeLogo.jsx";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";

const styles = {
  notFound: {
    display: "grid",
    alignContent: "center",
    justifyItems: "center",
    minHeight: "100vh",
    gap: "var(--space-2)",
    padding: "var(--space-4) var(--main-inline-pad)",
    textAlign: "center"
  },
  logo: {
    width: "var(--not-found-logo-width)",
    height: "auto",
    marginBottom: "var(--space-5)"
  },
  code: {
    margin: 0,
    color: "var(--palette-accent-fine)",
    fontFamily: "var(--font-family-digital-numeric)",
    fontSize: "var(--font-size-not-found-code)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-solid)",
    letterSpacing: 0
  },
  title: {
    margin: 0,
    color: "var(--palette-ink)",
    fontSize: "var(--font-size-not-found-title)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-heading)",
    letterSpacing: 0
  },
  action: {
    justifySelf: "center",
    marginTop: "var(--space-5)"
  }
};

export function NotFoundPage() {
  const { content, routes } = useI18n();

  return (
    <section className={className(styles.notFound)} aria-labelledby="not-found-title">
      <div className={className(styles.logo)} aria-hidden="true">
        <EyeLogo motion="auto" />
      </div>
      <p className={className(styles.code)}>404</p>
      <h1 id="not-found-title" className={className(styles.title)}>
        {content.notFound.title}
      </h1>
      <Button as={Link} className={className(styles.action)} to={routes[0].path}>
        {content.notFound.action}
      </Button>
    </section>
  );
}
