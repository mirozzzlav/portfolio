import assert from "node:assert/strict";
import test from "node:test";
import { activateFocusTrap } from "../src/utils/focusTrap.js";

// Minimal DOM doubles: browser tab navigation and layout are not simulated.
function createDialog() {
  const document = new EventTarget();
  document.defaultView = {
    getComputedStyle: (element) => ({ visibility: element.visibility })
  };

  function element(options = {}) {
    return {
      ownerDocument: document,
      isConnected: true,
      tabIndex: 0,
      visibility: "visible",
      disabled: false,
      hidden: false,
      inert: false,
      rendered: true,
      matches() {
        return this.disabled;
      },
      closest() {
        return this.hidden || this.inert ? this : null;
      },
      getClientRects() {
        return this.rendered ? [{}] : [];
      },
      focus() {
        document.activeElement = this;
        const event = new Event("focusin");
        Object.defineProperty(event, "target", { value: this });
        document.dispatchEvent(event);
      },
      ...options
    };
  }

  const opener = element();
  const close = element();
  const previous = element();
  const next = element();
  const container = element({
    tabIndex: -1,
    children: [close, previous, next],
    querySelectorAll() {
      return this.children;
    },
    contains(target) {
      return target === this || this.children.includes(target);
    }
  });
  document.activeElement = opener;

  function keyDown(key, shiftKey = false) {
    const event = new Event("keydown", { cancelable: true });
    Object.assign(event, { key, shiftKey });
    document.dispatchEvent(event);
    return event;
  }

  return { document, container, opener, close, previous, next, element, keyDown };
}

test("opening focuses the right arrow and cleanup restores the opener", () => {
  const { container, document, close, previous, next, opener } = createDialog();
  container.children = [next, previous, close];
  const cleanup = activateFocusTrap(container);
  assert.equal(document.activeElement, next);
  cleanup();
  assert.equal(document.activeElement, opener);
});

test("Tab wraps from last to first and Shift+Tab wraps from first to last", () => {
  const { container, document, close, next, keyDown } = createDialog();
  const cleanup = activateFocusTrap(container);
  assert.equal(keyDown("Tab", true).defaultPrevented, true);
  assert.equal(document.activeElement, next);
  assert.equal(keyDown("Tab").defaultPrevented, true);
  assert.equal(document.activeElement, close);
  cleanup();
});

test("Tab cycles right arrow, left arrow, close; Shift+Tab reverses the order", () => {
  const { container, document, close, previous, next, keyDown } = createDialog();
  container.children = [next, previous, close];
  const cleanup = activateFocusTrap(container);
  for (const expected of [previous, close, next, previous, close, next]) {
    assert.equal(keyDown("Tab").defaultPrevented, true);
    assert.equal(document.activeElement, expected);
  }
  for (const expected of [close, previous, next, close, previous, next]) {
    assert.equal(keyDown("Tab", true).defaultPrevented, true);
    assert.equal(document.activeElement, expected);
  }
  cleanup();
});

test("Escape and arrow keys pass through without moving focus", () => {
  const { container, document, previous, keyDown } = createDialog();
  const cleanup = activateFocusTrap(container);
  previous.focus();
  assert.equal(keyDown("Escape").defaultPrevented, false);
  assert.equal(keyDown("ArrowRight").defaultPrevented, false);
  assert.equal(document.activeElement, previous);
  cleanup();
});

test("Tab from the panel enters the control order without an extra stop", () => {
  const { container, document, close, next, keyDown } = createDialog();
  const cleanup = activateFocusTrap(container);
  container.focus();
  keyDown("Tab");
  assert.equal(document.activeElement, close);
  container.focus();
  keyDown("Tab", true);
  assert.equal(document.activeElement, next);
  cleanup();
});

test("hidden, inert, disabled and negative-tabindex controls are skipped", () => {
  const { container, document, close, next, element, keyDown } = createDialog();
  container.children = [
    element({ disabled: true }),
    element({ hidden: true }),
    element({ inert: true }),
    element({ rendered: false }),
    element({ visibility: "hidden" }),
    element({ visibility: "collapse" }),
    element({ tabIndex: -1 }),
    close,
    next,
    element({ disabled: true })
  ];
  const cleanup = activateFocusTrap(container);
  assert.equal(document.activeElement, close);
  keyDown("Tab", true);
  assert.equal(document.activeElement, next);
  cleanup();
});

test("tab stops are recalculated when a control becomes disabled", () => {
  const { container, document, close, previous, next, keyDown } = createDialog();
  const cleanup = activateFocusTrap(container);
  previous.focus();
  next.disabled = true;
  assert.equal(keyDown("Tab").defaultPrevented, true);
  assert.equal(document.activeElement, close);
  cleanup();
});

test("a single control receives focus in both tab directions", () => {
  const { container, document, close, keyDown } = createDialog();
  container.children = [close];
  const cleanup = activateFocusTrap(container);
  for (const shiftKey of [false, true]) {
    assert.equal(keyDown("Tab", shiftKey).defaultPrevented, true);
    assert.equal(document.activeElement, close);
  }
  cleanup();
});

test("an empty dialog keeps focus on its panel", () => {
  const { container, document, keyDown } = createDialog();
  container.children = [];
  const cleanup = activateFocusTrap(container);
  assert.equal(document.activeElement, container);
  for (const shiftKey of [false, true]) {
    assert.equal(keyDown("Tab", shiftKey).defaultPrevented, true);
    assert.equal(document.activeElement, container);
  }
  cleanup();
});

test("programmatic focus outside the dialog is redirected until cleanup", () => {
  const { container, document, close, opener } = createDialog();
  const cleanup = activateFocusTrap(container);
  opener.focus();
  assert.equal(document.activeElement, close);
  cleanup();
  opener.focus();
  assert.equal(document.activeElement, opener);
});

test("positive tabindex values follow browser tab order before zero", () => {
  const { container, document, close, previous, next, keyDown } = createDialog();
  previous.tabIndex = 2;
  next.tabIndex = 1;
  const cleanup = activateFocusTrap(container);
  assert.equal(document.activeElement, next);
  keyDown("Tab", true);
  assert.equal(document.activeElement, close);
  cleanup();
});

test("cleanup skips a disconnected opener and removes keyboard listeners", () => {
  const { container, document, close, opener, keyDown } = createDialog();
  const cleanup = activateFocusTrap(container);
  opener.isConnected = false;
  cleanup();
  assert.equal(document.activeElement, close);
  assert.equal(keyDown("Tab", true).defaultPrevented, false);
});

test("setup and cleanup can repeat as in StrictMode or reopening", () => {
  const { container, document, close, opener } = createDialog();
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const cleanup = activateFocusTrap(container);
    assert.equal(document.activeElement, close);
    cleanup();
    assert.equal(document.activeElement, opener);
  }
});
