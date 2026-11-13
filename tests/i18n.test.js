import assert from "node:assert/strict";
import test from "node:test";
import { getTranslation, languageContent } from "../src/content/index.js";

test("translation keys resolve in the selected language", () => {
  assert.equal(getTranslation("sk", "yoybox.close"), "Zatvoriť");
  assert.equal(getTranslation("en", "yoybox.close"), "Close");
  assert.equal(
    getTranslation("sk", "projects.0.title"),
    languageContent.sk.projects[0].title
  );
});

test("both languages provide all translation keys required by react-yoybox", () => {
  const keys = [
    "close",
    "screenshotPreview",
    "previousImage",
    "nextImage",
    "imageDescriptionNotFound"
  ];

  for (const [language, content] of Object.entries(languageContent)) {
    for (const key of keys) {
      assert.equal(typeof content.yoybox[key], "string");
      assert.ok(content.yoybox[key].trim());
      assert.equal(getTranslation(language, `yoybox.${key}`), content.yoybox[key]);
    }
  }
});

test("missing localized text falls back to English", () => {
  const original = languageContent.sk.yoybox.close;
  delete languageContent.sk.yoybox.close;

  try {
    assert.equal(getTranslation("sk", "yoybox.close"), "Close");
  } finally {
    languageContent.sk.yoybox.close = original;
  }
});

test("missing keys and non-text values return the key", () => {
  for (const key of [
    "ui.missing",
    "ui",
    "projects",
    "yoybox.close.length",
    "toString"
  ]) {
    assert.equal(getTranslation("sk", key), key);
  }
});
