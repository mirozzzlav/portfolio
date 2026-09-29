const focusableSelector =
  'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

function getTabStops(container) {
  const view = container.ownerDocument.defaultView;

  return [...container.querySelectorAll(focusableSelector)]
    .filter((element) => {
      const visibility = view.getComputedStyle(element).visibility;

      return (
        element.tabIndex >= 0 &&
        !element.matches(":disabled") &&
        !element.closest("[hidden], [inert]") &&
        element.getClientRects().length > 0 &&
        visibility !== "hidden" &&
        visibility !== "collapse"
      );
    })
    .sort((first, second) => {
      const firstOrder = first.tabIndex || Infinity;
      const secondOrder = second.tabIndex || Infinity;
      return firstOrder - secondOrder;
    });
}

export function activateFocusTrap(container) {
  const document = container.ownerDocument;
  const previousFocus = document.activeElement;

  function focusFirst() {
    (getTabStops(container)[0] || container).focus({ preventScroll: true });
  }

  function handleKeyDown(event) {
    if (event.key !== "Tab" || event.defaultPrevented) {
      return;
    }

    const tabStops = getTabStops(container);
    event.preventDefault();

    if (tabStops.length === 0) {
      container.focus({ preventScroll: true });
      return;
    }

    const currentIndex = tabStops.indexOf(document.activeElement);
    const direction = event.shiftKey ? -1 : 1;
    const nextIndex =
      currentIndex === -1
        ? event.shiftKey
          ? tabStops.length - 1
          : 0
        : (currentIndex + direction + tabStops.length) % tabStops.length;

    tabStops[nextIndex].focus({ preventScroll: true });
  }

  function handleFocusIn(event) {
    if (!container.contains(event.target)) {
      focusFirst();
    }
  }

  document.addEventListener("keydown", handleKeyDown, { capture: true });
  document.addEventListener("focusin", handleFocusIn);
  focusFirst();

  return () => {
    document.removeEventListener("keydown", handleKeyDown, { capture: true });
    document.removeEventListener("focusin", handleFocusIn);

    if (previousFocus?.isConnected) {
      previousFocus.focus?.({ preventScroll: true });
    }
  };
}
