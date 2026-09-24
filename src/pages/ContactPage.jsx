import { Button } from "../components/Button.jsx";
import { Field } from "../components/Field.jsx";
import { className } from "../styles/classNames.js";

const styles = {
  form: {
    display: "grid",
    gap: "var(--space-3)",
    width: "100%",
    padding: 0
  },

  intro: {
    marginBottom: "var(--space-1)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-md)",
    lineHeight: "var(--line-height-prose)",
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
    <form
      className={className(styles.form)}
      action="#"
      method="post"
      onSubmit={handleSubmit}
    >
      <p className={className(styles.intro)}>
        Budem rád, keď sa mi ozvete s otázkou, nápadom alebo konkrétnym dopytom. Ak
        hľadáte niekoho na web, aplikáciu alebo úpravu existujúceho riešenia, pokojne mi
        napíšte. Spoločne môžeme prejsť, čo potrebujete a aký ďalší krok dáva zmysel.
      </p>
      <Field label="Meno" type="text" name="name" autoComplete="name" required />
      <Field label="E-mail" type="email" name="email" autoComplete="email" required />
      <Field as="textarea" label="Správa" name="message" rows="5" required />
      <Button compact variant="primary" type="submit">
        Odoslať
        <span className={className(styles.buttonArrow)} aria-hidden="true" />
      </Button>
    </form>
  );
}
