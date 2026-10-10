import assert from "node:assert/strict";
import test from "node:test";
import { parseInlineLinks } from "../src/content/inlineLinks.js";

test("parses explicit bold markers alongside localized links", () => {
  assert.deepEqual(
    parseInlineLinks("Hi, I'm **Miro**. See [projects](/projects).", "en"),
    [
      { type: "text", text: "Hi, I'm " },
      { type: "strong", text: "Miro" },
      { type: "text", text: ". See " },
      { type: "internal", text: "projects", href: "/en/projects/" },
      { type: "text", text: "." }
    ]
  );
  assert.deepEqual(parseInlineLinks("Miro **unfinished", "sk"), [
    { type: "text", text: "Miro **unfinished" }
  ]);
});

test("preserves plain text and parses multiple links in a sentence", () => {
  assert.deepEqual(parseInlineLinks("Text bez odkazu.", "sk"), [
    { type: "text", text: "Text bez odkazu." }
  ]);
  assert.deepEqual(
    parseInlineLinks(
      "Pozrite [projekty](/projects) alebo [demo](https://example.com).",
      "sk"
    ),
    [
      { type: "text", text: "Pozrite " },
      { type: "internal", text: "projekty", href: "/projects/" },
      { type: "text", text: " alebo " },
      { type: "external", text: "demo", href: "https://example.com" },
      { type: "text", text: "." }
    ]
  );
});

test("localizes internal links and preserves queries and fragments", () => {
  assert.deepEqual(parseInlineLinks("[Projects](/projects?view=all#gallery)", "en"), [
    { type: "internal", text: "Projects", href: "/en/projects/?view=all#gallery" }
  ]);
  assert.equal(
    parseInlineLinks("[Projekty](/en/projects/)", "sk")[0].href,
    "/projects/"
  );
});

test("supports contact links and anchors without localizing them", () => {
  for (const href of ["mailto:hello@example.com", "tel:+421123456789", "#gallery"]) {
    assert.deepEqual(parseInlineLinks(`[Link](${href})`, "en"), [
      { type: "external", text: "Link", href }
    ]);
  }
});

test("leaves malformed links and unsupported protocols as plain text", () => {
  for (const text of [
    "[Link](javascript:alert)",
    "[Link](data:text/html,test)",
    "[Link](//example.com)",
    "[Link](missing",
    "[Link](relative/path)"
  ]) {
    assert.deepEqual(parseInlineLinks(text, "sk"), [{ type: "text", text }]);
  }
});
