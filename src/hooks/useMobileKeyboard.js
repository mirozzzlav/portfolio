import { useEffect, useState } from "react";
import { useIsMobileOrTablet } from "./useIsMobileOrTablet.js";

export function useMobileKeyboard() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!isMobileOrTablet || !viewport) {
      return;
    }

    // Scale compensation distinguishes keyboard resizing from page zoom.
    const visibleHeight = () => viewport.height * viewport.scale;
    let fullHeight = Math.max(window.innerHeight, visibleHeight());
    let keyboardOpen = false;
    let frame;

    function update() {
      const height = visibleHeight();
      const fieldFocused = document.activeElement?.matches(
        "[data-section='contact'] input, [data-section='contact'] textarea"
      );
      const reduced = fullHeight - height > Math.max(120, fullHeight * 0.2);

      keyboardOpen = reduced && (fieldFocused || keyboardOpen);
      if (!fieldFocused && !keyboardOpen) {
        fullHeight = Math.max(window.innerHeight, height);
      }
      setIsKeyboardOpen(keyboardOpen);
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    function resetOrientation() {
      fullHeight = Math.max(window.innerHeight, visibleHeight());
      keyboardOpen = false;
      scheduleUpdate();
    }

    viewport.addEventListener("resize", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", resetOrientation);
    document.addEventListener("focusin", scheduleUpdate);
    document.addEventListener("focusout", scheduleUpdate);
    scheduleUpdate();

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", resetOrientation);
      document.removeEventListener("focusin", scheduleUpdate);
      document.removeEventListener("focusout", scheduleUpdate);
    };
  }, [isMobileOrTablet]);

  return isMobileOrTablet && isKeyboardOpen;
}
