import { className } from "../styles/classNames.js";
import { IconButton } from "./IconButton.jsx";
import { Lightbox } from "./Lightbox.jsx";
import { PreviewSurface } from "./PreviewSurface.jsx";

const styles = {
  content: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    width: "100%",
    height: "100%",
    minHeight: 0,
    padding: "var(--space-6)",

    "@media (max-width: 780px)": {
      padding: "var(--space-5) var(--space-3)"
    }
  },

  nav: {
    position: "relative",
    zIndex: 2,
    width: "48px",
    height: "48px",
    background: "var(--surface-solid)",
    boxShadow:
      "0 10px 30px color-mix(in srgb, var(--palette-ink) 12%, var(--color-transparent))",

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
    "&::before": {
      transform: "translate(-35%, -50%) rotate(225deg)"
    }
  },

  navNext: {
    "&::before": {
      transform: "translate(-65%, -50%) rotate(45deg)"
    }
  },

  viewer: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gridTemplateRows: "minmax(0, auto) auto",
    alignItems: "center",
    gap: "var(--space-3)",
    width: "min(100%, calc(1000px + 112px))",

    "@media (max-width: 780px)": {
      gap: "var(--space-2)"
    }
  },

  stage: {
    display: "grid",
    minWidth: 0,
    width: "min(100%, 1000px, calc((100dvh - 10rem) * 1.6))",
    justifySelf: "center",

    "@supports not (height: 100dvh)": {
      width: "min(100%, 1000px, calc((100vh - 10rem) * 1.6))"
    }
  },

  previewSurface: {
    width: "100%",
    border: 0,
    backgroundColor: "var(--palette-accent-soft)",
    backgroundSize: "cover",
    boxShadow:
      "0 20px 60px color-mix(in srgb, var(--palette-ink) 18%, var(--color-transparent))"
  },

  title: {
    gridColumn: "2",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    textAlign: "center"
  }
};

export function PreviewDialog({ preview, onClose, onNavigate }) {
  if (!preview) {
    return null;
  }

  const image = preview.images[preview.imageIndex];

  function handleLightboxKeyDown(event) {
    if (event.key === "ArrowLeft") {
      onNavigate(-1);
    }

    if (event.key === "ArrowRight") {
      onNavigate(1);
    }
  }

  return (
    <Lightbox
      closeLabel="Zatvoriť náhľad"
      contentClassName={className(styles.content)}
      isOpen={Boolean(preview)}
      labelledBy="preview-dialog-title"
      onClose={onClose}
      onKeyDown={handleLightboxKeyDown}
    >
      <div className={className(styles.viewer)}>
        <IconButton
          className={className([styles.nav, styles.navPrev])}
          aria-label="Predchádzajúci obrázok"
          onClick={() => onNavigate(-1)}
          size="lg"
        />
        <div className={className(styles.stage)}>
          <PreviewSurface
            aspectRatio="16 / 10"
            className={className(styles.previewSurface)}
            image={image}
            radius="var(--radius-md)"
            role="img"
            aria-label={image.alt}
          />
        </div>
        <IconButton
          className={className([styles.nav, styles.navNext])}
          aria-label="Ďalší obrázok"
          onClick={() => onNavigate(1)}
          size="lg"
        />
        <p id="preview-dialog-title" className={className(styles.title)}>
          {image.alt}
        </p>
      </div>
    </Lightbox>
  );
}
