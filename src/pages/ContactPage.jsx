import { Button } from "src/components/Button.jsx";
import { Field } from "src/components/Field.jsx";
import { FormStatus } from "src/components/FormStatus.jsx";
import { HoneypotField } from "src/components/HoneypotField.jsx";
import { TurnstileWidget } from "src/components/TurnstileWidget.jsx";
import { useContactForm } from "src/hooks/useContactForm.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";

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

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export function ContactPage() {
  const { content } = useI18n();
  const contact = content.contact;
  const {
    fieldErrors,
    submitState,
    isSubmitting,
    turnstileRef,
    clearFieldError,
    handleSubmit
  } = useContactForm({ turnstileEnabled: Boolean(turnstileSiteKey) });

  return (
    <form
      className={className(styles.form)}
      action="/api/contact"
      method="post"
      noValidate
      onSubmit={handleSubmit}
    >
      <p className={className(styles.intro)}>{contact.intro}</p>
      <Field
        error={fieldErrors.name ? contact.fieldErrors.name : undefined}
        id="contact-name"
        label={contact.fields.name}
        type="text"
        name="name"
        autoComplete="name"
        onChange={() => clearFieldError("name")}
      />
      <Field
        error={fieldErrors.email ? contact.fieldErrors.email : undefined}
        id="contact-email"
        label={contact.fields.email}
        type="email"
        name="email"
        autoComplete="email"
        onChange={() => clearFieldError("email")}
      />
      <Field
        as="textarea"
        error={fieldErrors.message ? contact.fieldErrors.message : undefined}
        id="contact-message"
        label={contact.fields.message}
        name="message"
        rows="5"
        onChange={() => clearFieldError("message")}
      />
      <HoneypotField />
      <TurnstileWidget ref={turnstileRef} siteKey={turnstileSiteKey} />
      <div className={className(styles.actions)}>
        <FormStatus type={submitState.type}>
          {submitState.messageKey ? contact[submitState.messageKey] : ""}
        </FormStatus>
        <Button compact disabled={isSubmitting} variant="primary" type="submit">
          {isSubmitting ? contact.submitting : contact.submit}
          <span className={className(styles.buttonArrow)} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
