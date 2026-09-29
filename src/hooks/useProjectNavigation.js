import { useCallback, useEffect, useRef, useState } from "react";
import { getSwipeDirection } from "src/utils/swipe.js";

function isKeyboardNavigationTarget(target) {
  return Boolean(
    target?.closest?.(
      'input, textarea, select, button, a, [role="button"], [role="dialog"]'
    )
  );
}

export function useProjectNavigation({ projectCount, disabled = false }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const touchStart = useRef(null);
  const canNavigate = projectCount > 1 && !disabled;

  const navigateProject = useCallback(
    (direction) => {
      if (!canNavigate) {
        return;
      }

      setActiveProjectIndex((currentIndex) =>
        Math.min(Math.max(currentIndex + direction, 0), projectCount - 1)
      );
    },
    [canNavigate, projectCount]
  );

  function handleTouchStart(event) {
    if (!canNavigate || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function handleTouchEnd(event) {
    const start = touchStart.current;
    touchStart.current = null;

    if (!start || !canNavigate) {
      return;
    }

    const direction = getSwipeDirection(start, event.changedTouches[0]);

    if (!direction) {
      return;
    }

    event.preventDefault();
    navigateProject(direction);
  }

  useEffect(() => {
    touchStart.current = null;

    if (!canNavigate) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isKeyboardNavigationTarget(event.target)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateProject(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateProject(1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canNavigate, navigateProject]);

  return {
    activeProjectIndex,
    navigateProject,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    }
  };
}
