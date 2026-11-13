import assert from "node:assert/strict";
import test from "node:test";
import { getSwipeDirection } from "../src/utils/swipe.js";

test("horizontal swipes navigate only after reaching the distance threshold", () => {
  const start = { x: 100, y: 100 };

  assert.equal(getSwipeDirection(start, { clientX: 53, clientY: 100 }), 0);
  assert.equal(getSwipeDirection(start, { clientX: 147, clientY: 100 }), 0);
  assert.equal(getSwipeDirection(start, { clientX: 52, clientY: 100 }), 1);
  assert.equal(getSwipeDirection(start, { clientX: 148, clientY: 100 }), -1);
});

test("vertical and diagonal scrolling does not navigate", () => {
  const start = { x: 100, y: 100 };

  assert.equal(getSwipeDirection(start, { clientX: 100, clientY: 200 }), 0);
  assert.equal(getSwipeDirection(start, { clientX: 160, clientY: 149 }), 0);
  assert.equal(getSwipeDirection(start, { clientX: 160, clientY: 148 }), -1);
  assert.equal(getSwipeDirection(start, { clientX: 40, clientY: 52 }), 1);
});

test("missing touch coordinates do not trigger navigation", () => {
  assert.equal(getSwipeDirection(null, { clientX: 100, clientY: 100 }), 0);
  assert.equal(getSwipeDirection({ x: 100, y: 100 }, undefined), 0);
});
