import assert from "node:assert/strict";
import test from "node:test";
import {
  clamp,
  getBoundedOffset,
  getContainedImageSize
} from "../src/utils/imageGeometry.js";
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

test("zoom is limited to the existing 1x–3x range", () => {
  assert.equal(clamp(0.5, 1, 3), 1);
  assert.equal(clamp(2, 1, 3), 2);
  assert.equal(clamp(5, 1, 3), 3);
});

test("images fit the stage while preserving landscape and portrait proportions", () => {
  const stage = { width: 400, height: 300 };

  assert.deepEqual(
    getContainedImageSize(stage, { naturalWidth: 1600, naturalHeight: 800 }),
    { containedWidth: 400, containedHeight: 200 }
  );
  assert.deepEqual(
    getContainedImageSize(stage, { naturalWidth: 600, naturalHeight: 1200 }),
    { containedWidth: 150, containedHeight: 300 }
  );
  assert.deepEqual(
    getContainedImageSize(stage, { naturalWidth: 800, naturalHeight: 600 }),
    { containedWidth: 400, containedHeight: 300 }
  );
});

test("an image at its initial zoom remains centered", () => {
  assert.deepEqual(getBoundedOffset(100, -80, 1, 400, 300, 400, 200), {
    offsetX: 0,
    offsetY: 0
  });
});

test("panning stops at each edge of the zoomed image", () => {
  assert.deepEqual(getBoundedOffset(500, -500, 2, 400, 300, 400, 200), {
    offsetX: 200,
    offsetY: -50
  });
  assert.deepEqual(getBoundedOffset(-500, 500, 2, 400, 300, 400, 200), {
    offsetX: -200,
    offsetY: 50
  });
  assert.deepEqual(getBoundedOffset(80, -25, 2, 400, 300, 400, 200), {
    offsetX: 80,
    offsetY: -25
  });
});

test("a zoomed portrait stays horizontally centered while it fits the stage", () => {
  assert.deepEqual(getBoundedOffset(100, 200, 2, 400, 300, 150, 300), {
    offsetX: 0,
    offsetY: 150
  });
});
