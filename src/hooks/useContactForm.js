import { useRef, useState } from "react";
import { contactApiUrl } from "src/contactConfig.js";
import {
  getContactPayload,
  validateContactPayload,
  getContactErrorState,
  sendContactPayload
} from "src/utils/contactForm.js";

export function useContactForm({ turnstileEnabled = false } = {}) {
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
    const payload = getContactPayload(new FormData(form));
    const clientErrors = validateContactPayload(payload);

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setSubmitState({
        messageKey: "validationError",
        type: "error"
      });
      turnstileRef.current?.reset();
      setIsSubmitting(false);
      return;
    }

    if (turnstileEnabled) {
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
      const { ok, data } = await sendContactPayload(contactApiUrl, payload);

      if (!ok) {
        const errorState = getContactErrorState(data);
        setFieldErrors(errorState.fieldErrors);
        setSubmitState(errorState.submitState);
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

  return {
    fieldErrors,
    submitState,
    isSubmitting,
    turnstileRef,
    clearFieldError,
    handleSubmit
  };
}
