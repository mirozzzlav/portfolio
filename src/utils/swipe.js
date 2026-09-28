const swipeThreshold = 48;
const swipeDirectionRatio = 1.25;

export function getSwipeDirection(start, touch) {
  if (!start || !touch) {
    return 0;
  }

  const deltaX = touch.clientX - start.x;
  const deltaY = touch.clientY - start.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX < swipeThreshold || absX < absY * swipeDirectionRatio) {
    return 0;
  }

  return deltaX < 0 ? 1 : -1;
}
