export function getContactPayload(formData) {
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

export function validateContactPayload(payload) {
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

export function normalizeFieldErrors(data) {
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

export function getContactErrorState(data) {
  const fieldErrors = normalizeFieldErrors(data);

  return {
    fieldErrors,
    submitState: {
      messageKey:
        data?.code === "turnstile_failed"
          ? "turnstileError"
          : Object.keys(fieldErrors).length > 0
            ? "validationError"
            : "networkError",
      type: "error"
    }
  };
}
