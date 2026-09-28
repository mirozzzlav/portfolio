import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "../components/Button.jsx";
import { Field } from "../components/Field.jsx";
import { FormStatus } from "../components/FormStatus.jsx";
import { HoneypotField } from "../components/HoneypotField.jsx";
import { className } from "../styles/classNames.js";
import { useI18n } from "../useI18n.js";

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
  },

  turnstile: {
    minHeight: 0
  }
};

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const turnstileScriptId = "cloudflare-turnstile-script";

function getPayload(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    message: String(formData.get("message") || ""),
    company: String(formData.get("company") || "")
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validatePayload(payload) {
  const errors = {};

  if (!payload.name.trim()) {
    errors.name = true;
  }

  if (!isValidEmail(payload.email)) {
    errors.email = true;
  }

  if (
    ![...payload.message.trim()].some((character) => /[\p{L}\p{N}]/u.test(character))
  ) {
    errors.message = true;
  }

  return errors;
}

function normalizeFieldErrors(data) {
  if (data?.errors && !Array.isArray(data.errors)) {
    return Object.keys(data.errors).reduce(
      (errors, field) => ({
        ...errors,
        [field]: true
      }),
      {}
    );
  }

  if (!Array.isArray(data?.detail)) {
    return {};
  }

  return data.detail.reduce((errors, error) => {
    const field = [...(error.loc || [])]
      .reverse()
      .find((part) => ["name", "email", "message"].includes(part));

    if (field && !errors[field]) {
      errors[field] = true;
    }

    return errors;
  }, {});
}

function hasFieldErrors(errors) {
  return Object.keys(errors).length > 0;
}

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resetTurnstile(widgetId) {
  if (typeof window !== "undefined" && window.turnstile && widgetId !== null) {
    window.turnstile.reset(widgetId);
  }
}

const TurnstileWidget = forwardRef(function TurnstileWidget(_props, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const pendingVerificationRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute() {
      if (!turnstileSiteKey) {
        return Promise.resolve("");
      }

      if (!window.turnstile || widgetIdRef.current === null) {
        return Promise.reject(new Error("Turnstile is not ready."));
      }

      return new Promise((resolve, reject) => {
        pendingVerificationRef.current = { resolve, reject };
        window.turnstile.execute(widgetIdRef.current);
      });
    },
    reset() {
      resetTurnstile(widgetIdRef.current);
    }
  }));

  useEffect(() => {
    if (!turnstileSiteKey) {
      return undefined;
    }

    let isMounted = true;

    function renderWidget() {
      if (
        !isMounted ||
        !containerRef.current ||
        !window.turnstile ||
        containerRef.current.dataset.turnstileRendered === "true"
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        "error-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification failed.")
          );
          pendingVerificationRef.current = null;
        },
        "expired-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification expired.")
          );
          pendingVerificationRef.current = null;
        },
        "timeout-callback": () => {
          pendingVerificationRef.current?.reject(
            new Error("Turnstile verification timed out.")
          );
          pendingVerificationRef.current = null;
        },
        appearance: "interaction-only",
        callback: (token) => {
          pendingVerificationRef.current?.resolve(token);
          pendingVerificationRef.current = null;
        },
        execution: "execute",
        sitekey: turnstileSiteKey,
        theme: "auto"
      });
      containerRef.current.dataset.turnstileRendered = "true";
    }

    const existingScript = document.getElementById(turnstileScriptId);
    if (existingScript) {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener("load", renderWidget, { once: true });
      }

      return () => {
        isMounted = false;
        existingScript.removeEventListener("load", renderWidget);

        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }

    const script = document.createElement("script");
    script.id = turnstileScriptId;
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget, { once: true });
    document.head.append(script);

    return () => {
      isMounted = false;
      script.removeEventListener("load", renderWidget);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!turnstileSiteKey) {
    return null;
  }

  return <div ref={containerRef} className={className(styles.turnstile)} />;
});

export function ContactPage() {
  const { content } = useI18n();
  const contact = content.contact;
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitState, setSubmitState] = useState({
    messageKey: null,
    type: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef(null);

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
    setSubmitState({ messageKey: null, type: "idle" });

    const form = event.currentTarget;
    const payload = getPayload(form);
    const clientErrors = validatePayload(payload);

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setSubmitState({
        messageKey: "validationError",
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    if (turnstileSiteKey) {
      try {
        const turnstileToken = await turnstileRef.current?.execute();

        if (!turnstileToken) {
          throw new Error("Turnstile token is missing.");
        }

        payload.turnstileToken = turnstileToken;
      } catch {
        setSubmitState({
          messageKey: "turnstileError",
          type: "error"
        });
        turnstileRef.current?.reset();
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        const responseFieldErrors = normalizeFieldErrors(data);

        setFieldErrors(responseFieldErrors);
        setSubmitState({
          messageKey:
            data?.code === "turnstile_failed"
              ? "turnstileError"
              : hasFieldErrors(responseFieldErrors)
                ? "validationError"
                : "networkError",
          type: "error"
        });
        return;
      }

      form.reset();
      setSubmitState({
        messageKey: "success",
        type: "success"
      });
    } catch {
      setSubmitState({
        messageKey: "networkError",
        type: "error"
      });
    } finally {
      turnstileRef.current?.reset();
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
      <TurnstileWidget ref={turnstileRef} />
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
