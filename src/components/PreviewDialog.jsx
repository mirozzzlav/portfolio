/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { IconButton } from "./IconButton.jsx";
import { PreviewSurface } from "./PreviewSurface.jsx";

const styles = {
  dialog: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "grid",
    placeItems: "center",
    padding: "var(--space-5)",

    "@media (max-width: 780px)": {
      padding: "var(--space-3)"
    }
  },

  backdrop: {
    position: "absolute",
    inset: 0,
    background: "var(--surface-overlay-soft)",
    backdropFilter: "blur(14px)"
  },

  panel: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gap: "var(--space-3)",
    width: "min(860px, 100%)"
  },

  close: {
    position: "fixed",
    top: "var(--space-4)",
    right: "var(--space-4)",
    zIndex: 3,
    fontSize: "1.4rem",
    lineHeight: 1
  },

  nav: {
    position: "absolute",
    top: "50%",
    zIndex: 2,
    transform: "translateY(-50%)",

    "&::before": {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "11px",
      height: "11px",
      borderTop: "2px solid currentColor",
      borderRight: "2px solid currentColor",
      content: '""'
    }
  },

  navPrev: {
    left: "calc(-1 * var(--space-7))",

    "&::before": {
      transform: "translate(-35%, -50%) rotate(225deg)"
    },

    "@media (max-width: 780px)": {
      left: "var(--space-1)"
    }
  },

  navNext: {
    right: "calc(-1 * var(--space-7))",

    "&::before": {
      transform: "translate(-65%, -50%) rotate(45deg)"
    },

    "@media (max-width: 780px)": {
      right: "var(--space-1)"
    }
  },

  title: {
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)"
  }
};

export function PreviewDialog({ preview, onClose, onNavigate }) {
  useEffect(() => {
    if (!preview) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onNavigate(-1);
      }

      if (event.key === "ArrowRight") {
        onNavigate(1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNavigate, preview]);

  if (!preview) {
    return null;
  }

  const image = preview.images[preview.imageIndex];

  return (
    <div css={styles.dialog}>
      <div
        css={styles.backdrop}
        data-preview-close
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        css={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-dialog-title"
      >
        <IconButton
          css={styles.close}
          aria-label="Zatvoriť náhľad"
          onClick={onClose}
          size="md"
        >
          ×
        </IconButton>
        <IconButton
          css={[styles.nav, styles.navPrev]}
          aria-label="Predchádzajúci obrázok"
          onClick={() => onNavigate(-1)}
          size="lg"
        />
        <PreviewSurface
          aspectRatio="16 / 10"
          image={image}
          radius="var(--radius-md)"
          role="img"
          aria-label={image.alt}
        />
        <IconButton
          css={[styles.nav, styles.navNext]}
          aria-label="Ďalší obrázok"
          onClick={() => onNavigate(1)}
          size="lg"
        />
        <p id="preview-dialog-title" css={styles.title}>
          {image.alt}
        </p>
      </div>
    </div>
  );
}
