export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getContainedImageSize(stageRect, imageElement) {
  const stageAspectRatio = stageRect.width / stageRect.height;
  const imageAspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;

  return {
    containedWidth:
      imageAspectRatio > stageAspectRatio
        ? stageRect.width
        : stageRect.height * imageAspectRatio,
    containedHeight:
      imageAspectRatio > stageAspectRatio
        ? stageRect.width / imageAspectRatio
        : stageRect.height
  };
}

export function getBoundedOffset(
  offsetX,
  offsetY,
  zoom,
  stageWidth,
  stageHeight,
  containedWidth,
  containedHeight
) {
  if (zoom <= 1) {
    return {
      offsetX: 0,
      offsetY: 0
    };
  }

  const maxOffsetX = Math.max(0, (containedWidth * zoom - stageWidth) / 2);

  const maxOffsetY = Math.max(0, (containedHeight * zoom - stageHeight) / 2);

  return {
    offsetX: clamp(offsetX, -maxOffsetX, maxOffsetX),
    offsetY: clamp(offsetY, -maxOffsetY, maxOffsetY)
  };
}
