import assert from "node:assert/strict";
import test from "node:test";
import {
  getContactErrorState,
  getContactPayload,
  normalizeFieldErrors,
  validateContactPayload
} from "../src/utils/contactForm.js";

const validPayload = {
  name: "Miro",
  email: "miro@example.com",
  message: "Dobrý deň!",
  company: ""
};

test("payload includes only contact fields and preserves the honeypot", () => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(validPayload)) {
    formData.set(key, value);
  }
  formData.set("company", "bot-filled company");
  formData.set("unrelated", "ignored");

  assert.deepEqual(getContactPayload(formData), {
    ...validPayload,
    company: "bot-filled company"
  });
  assert.deepEqual(getContactPayload(new FormData()), {
    name: "",
    email: "",
    message: "",
    company: ""
  });
});

test("valid contact fields accept surrounding whitespace without altering the payload", () => {
  const payload = Object.freeze({
    ...validPayload,
    name: " Miro ",
    email: " miro@example.com ",
    message: " Dobrý deň! "
  });
  assert.deepEqual(validateContactPayload(payload), {});
});

test("validation reports all invalid fields together", () => {
  assert.deepEqual(
    validateContactPayload({ name: " \n ", email: "invalid", message: "...?!" }),
    { name: true, email: true, message: true }
  );
});

test("email validation keeps the existing format requirements", () => {
  for (const email of ["", "miro", "miro@", "@example.com", "a b@example.com"]) {
    assert.deepEqual(validateContactPayload({ ...validPayload, email }), {
      email: true
    });
  }
});

test("messages require a Unicode letter or number", () => {
  for (const message of ["č", "你好", "7", "🙂 ďakujem"]) {
    assert.deepEqual(validateContactPayload({ ...validPayload, message }), {});
  }
  for (const message of ["", " \n ", "!!!", "🙂"]) {
    assert.deepEqual(validateContactPayload({ ...validPayload, message }), {
      message: true
    });
  }
});

test("API field error messages become field flags", () => {
  assert.deepEqual(
    normalizeFieldErrors({ errors: { name: "Required", email: "Invalid" } }),
    { name: true, email: true }
  );
});

test("FastAPI detail errors map known fields and ignore unrelated locations", () => {
  assert.deepEqual(
    normalizeFieldErrors({
      detail: [
        { loc: ["body", "email"], msg: "Invalid" },
        { loc: ["body", "email"], msg: "Duplicate" },
        { loc: ["body", "message"], msg: "Required" },
        { loc: ["body", "turnstileToken"], msg: "Invalid" },
        { msg: "No location" }
      ]
    }),
    { email: true, message: true }
  );
});

test("Turnstile errors take precedence over field validation messages", () => {
  assert.deepEqual(
    getContactErrorState({ code: "turnstile_failed", errors: { email: "Invalid" } }),
    {
      fieldErrors: { email: true },
      submitState: { messageKey: "turnstileError", type: "error" }
    }
  );
});

test("field errors select the localized validation message", () => {
  assert.deepEqual(getContactErrorState({ errors: { message: "Required" } }), {
    fieldErrors: { message: true },
    submitState: { messageKey: "validationError", type: "error" }
  });
});

test("empty or non-JSON API errors select the network message", () => {
  for (const data of [null, undefined, {}, { detail: "Service unavailable" }]) {
    assert.deepEqual(getContactErrorState(data), {
      fieldErrors: {},
      submitState: { messageKey: "networkError", type: "error" }
    });
  }
});
