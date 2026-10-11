import { mediaQueries } from "src/styles/mediaQueries.js";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "src/hooks/useFocusTrap.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { IconButton } from "src/components/IconButton.jsx";

const styles = {
  root: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: "var(--layer-modal)",
    display: "block",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",

    "@supports (height: 100dvh)": {
      height: "100dvh",
      minHeight: "100dvh"
    }
  },

  backdrop: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: "var(--surface-overlay-strong)",
    backdropFilter: "blur(var(--blur-md))"
  },

  panel: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden"
  },

  content: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0
  },

  close: {
    position: "fixed",
    top: "var(--space-4)",
    right: "var(--space-4)",
    zIndex: "var(--layer-modal-control)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "var(--icon-button-size-xl)",
    height: "var(--icon-button-size-xl)",
    borderRadius: "var(--radius-pill)",
    background: "var(--surface-solid)",
    color: "var(--palette-accent-fine)",
    boxShadow: "var(--shadow-menu)",
    fontSize: "var(--font-size-lg)",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: "var(--line-height-solid)",

    svg: {
      display: "block",
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)",

      path: {
        stroke: "var(--palette-accent-fine)"
      }
    },

    "&:hover svg path, &:active svg path": {
      stroke: "var(--color-on-accent)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      top: "var(--space-3)",
      right: "var(--space-3)",
      width: "var(--control-height-lg)",
      height: "var(--control-height-lg)"
    }
  }
};

export function Lightbox({
  children,
  className,
  closeLabel = "Close",
  contentClassName,
  isOpen,
  labelledBy,
  onClose,
  onKeyDown
}) {
  const panelRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      onKeyDown?.(event);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, onKeyDown]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={mergeClassNames(styles.root, className)}>
      <div
        className={mergeClassNames(styles.backdrop)}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={mergeClassNames(styles.panel)}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className={mergeClassNames(contentClassName, styles.content)}>
          {children}
        </div>
        <IconButton
          className={mergeClassNames(styles.close)}
          aria-label={closeLabel}
          onClick={onClose}
          size="lg"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 6l12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </IconButton>
      </div>
    </div>,
    document.body
  );
}
