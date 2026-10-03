import { useSyncExternalStore } from "react";

export const MOBILE_OR_TABLET_QUERY =
  "(max-width: 1000px), (hover: none), (pointer: coarse)";

function subscribe(onChange) {
  const media = window.matchMedia(MOBILE_OR_TABLET_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_OR_TABLET_QUERY).matches;
}

function getServerSnapshot() {
  // Keep desktop-only components unmounted until browser capabilities are known.
  return true;
}

// Detects a compact or touch-first viewport, not the physical device type.
export function useIsMobileOrTablet() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
