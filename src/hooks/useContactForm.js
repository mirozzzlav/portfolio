import { useRef, useState } from "react";
import {
  getContactPayload,
  validateContactPayload,
  getContactErrorState
} from "../utils/contactForm.js";

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
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
