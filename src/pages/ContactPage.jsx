import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { Field } from "../components/Field.jsx";
import { FormStatus } from "../components/FormStatus.jsx";
import { HoneypotField } from "../components/HoneypotField.jsx";
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
  },

  actions: {
    display: "grid",
    justifyItems: "start",
    gap: "var(--space-2)"
  }
};

function getPayload(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    message: String(formData.get("message") || ""),
    company: String(formData.get("company") || "")
  };
}

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function ContactPage() {
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitState, setSubmitState] = useState({
    message: "",
    type: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(fieldName) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];

      return nextErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setSubmitState({ message: "", type: "idle" });

    const form = event.currentTarget;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(getPayload(form))
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        setFieldErrors(data?.errors || {});
        setSubmitState({
          message:
            data?.message ||
            "Nepodarilo sa odoslať správu. Skontrolujte vyplnené polia.",
          type: "error"
        });
        return;
      }

      form.reset();
      setSubmitState({
        message: "Správa bola odoslaná. Ozvem sa vám čo najskôr.",
        type: "success"
      });
    } catch {
      setSubmitState({
        message: "Správu sa nepodarilo odoslať. Skúste to, prosím, neskôr.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={className(styles.form)}
      action="/api/contact"
      method="post"
      noValidate
      onSubmit={handleSubmit}
    >
      <p className={className(styles.intro)}>
        Budem rád, keď sa mi ozvete s otázkou, nápadom alebo konkrétnym dopytom. Ak
        hľadáte niekoho na web, aplikáciu alebo úpravu existujúceho riešenia, pokojne mi
        napíšte. Spoločne môžeme prejsť, čo potrebujete a aký ďalší krok dáva zmysel.
      </p>
      <Field
        error={fieldErrors.name}
        id="contact-name"
        label="Meno"
        type="text"
        name="name"
        autoComplete="name"
        onChange={() => clearFieldError("name")}
      />
      <Field
        error={fieldErrors.email}
        id="contact-email"
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        onChange={() => clearFieldError("email")}
      />
      <Field
        as="textarea"
        error={fieldErrors.message}
        id="contact-message"
        label="Správa"
        name="message"
        rows="5"
        onChange={() => clearFieldError("message")}
      />
      <HoneypotField />
      <div className={className(styles.actions)}>
        <FormStatus type={submitState.type}>{submitState.message}</FormStatus>
        <Button compact disabled={isSubmitting} variant="primary" type="submit">
          {isSubmitting ? "Odosielam" : "Odoslať"}
          <span className={className(styles.buttonArrow)} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
