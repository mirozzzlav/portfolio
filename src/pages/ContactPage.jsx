/** @jsxImportSource @emotion/react */
import { Button } from "../components/Button.jsx";
import { Field } from "../components/Field.jsx";
import { SectionPage } from "../components/SectionPage.jsx";

const styles = {
  form: {
    display: "grid",
    gap: "var(--space-3)",
    width: "100%",
    maxWidth: "720px",
    padding: 0,

    "@media (max-width: 1000px)": {
      maxWidth: "none"
    }
  },

  intro: {
    marginBottom: "var(--space-1)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    lineHeight: 1.72,
    textWrap: "pretty"
  },

  buttonArrow: {
    display: "block",
    flex: "none",
    width: 0,
    height: 0,
    borderBlock: "5px solid var(--color-transparent)",
    borderLeft: "8px solid currentColor"
  }
};

export function ContactPage() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <SectionPage sectionId="contact" title="Kontakt">
      <form css={styles.form} action="#" method="post" onSubmit={handleSubmit}>
        <p css={styles.intro}>
          Budem rád, keď sa mi ozvete s otázkou, nápadom alebo konkrétnym dopytom. Ak
          hľadáte niekoho na web, aplikáciu alebo úpravu existujúceho riešenia, pokojne
          mi napíšte. Spoločne môžeme prejsť, čo potrebujete a aký ďalší krok dáva
          zmysel.
        </p>
        <Field label="Meno" type="text" name="name" autoComplete="name" required />
        <Field label="E-mail" type="email" name="email" autoComplete="email" required />
        <Field as="textarea" label="Správa" name="message" rows="5" required />
        <Button variant="primary" type="submit">
          Odoslať
          <span css={styles.buttonArrow} aria-hidden="true" />
        </Button>
      </form>
    </SectionPage>
  );
}
