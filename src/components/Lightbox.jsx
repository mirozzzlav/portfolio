import { useEffect } from "react";
import { createPortal } from "react-dom";
import { mergeClassNames } from "../styles/classNames.js";
import { IconButton } from "./IconButton.jsx";

const styles = {
  root: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 50,
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
    backdropFilter: "blur(14px)"
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
    top: "24px",
    right: "24px",
    zIndex: 60,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "var(--surface-solid)",
    color: "var(--palette-accent-fine)",
    boxShadow:
      "0 10px 30px color-mix(in srgb, var(--palette-ink) 12%, var(--color-transparent))",
    fontSize: "1.25rem",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: 1,

    svg: {
      display: "block",
      width: "22px",
      height: "22px",

      path: {
        stroke: "var(--palette-accent-fine)"
      }
    },

    "&:hover svg path, &:active svg path": {
      stroke: "var(--color-on-accent)"
    },

    "@media (max-width: 780px)": {
      top: "16px",
      right: "16px",
      width: "44px",
      height: "44px"
    }
  }
};

export function Lightbox({
  children,
  className,
  closeLabel = "Zatvoriť",
  contentClassName,
  isOpen,
  labelledBy,
  onClose,
  onKeyDown
}) {
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
    <div
      className={mergeClassNames(styles.root, className)}
      data-disable-page-wheel-navigation
    >
      <div className={mergeClassNames(styles.backdrop)} onClick={onClose} aria-hidden="true" />
      <div
        className={mergeClassNames(styles.panel)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
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
        <div className={mergeClassNames(contentClassName, styles.content)}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
