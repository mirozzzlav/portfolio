import { useEffect, useRef } from "react";
import { activateFocusTrap } from "src/utils/focusTrap.js";

export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return undefined;
    }

    return activateFocusTrap(containerRef.current);
  }, [isActive]);

  return containerRef;
}
