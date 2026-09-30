import { useImageGestures } from "src/hooks/useImageGestures.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { IconButton } from "src/components/IconButton.jsx";
import { Lightbox } from "src/components/Lightbox.jsx";
import { PreviewSurface } from "src/components/PreviewSurface.jsx";

const styles = {
  content: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    width: "100%",
    height: "100%",
    minHeight: 0,
    padding: 0,

    "@media (max-width: 780px)": {
      alignItems: "stretch"
    }
  },

  nav: {
    position: "absolute",
    top: "50%",
    zIndex: 2,
    width: "48px",
    height: "48px",
    borderRadius: "50%",
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
    },
    "&:disabled, &:disabled:hover, &:disabled:active": {
      borderColor: "var(--color-border)",
      background: "var(--surface-solid)",
      boxShadow: "none",
      color: "var(--color-text)",
      cursor: "default",
      opacity: 0.36
    },

    "@media (max-width: 780px)": {
      width: "44px",
      height: "44px",
      boxShadow:
        "0 8px 24px color-mix(in srgb, var(--palette-ink) 10%, var(--color-transparent))"
    }
  },

  navPrev: {
    left: "var(--space-3)",
    transform: "translateY(-50%)",

    "&::before": {
      transform: "translate(-35%, -50%) rotate(225deg)"
    },

    "@media (max-width: 780px)": {
      left: "var(--space-2)"
    }
  },

  navNext: {
    right: "24px",
    transform: "translateY(-50%)",

    "&::before": {
      transform: "translate(-65%, -50%) rotate(45deg)"
    },

    "@media (max-width: 780px)": {
      right: "16px"
    }
  },

  viewer: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    alignItems: "center",
    justifyItems: "center",
    width: "100%",
    height: "100%",
    minHeight: 0,

    "@media (max-width: 780px)": {
      alignContent: "stretch"
    }
  },

  stageGroup: {
    gridColumn: "1",
    gridRow: "1",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    justifyItems: "center",
    width: "100%",
    minWidth: 0,
    height: "100%",
    minHeight: 0,

    "@media (max-width: 780px)": {
      alignContent: "stretch"
    }
  },

  stage: {
    display: "grid",
    minWidth: 0,
    minHeight: 0,
    width: "100%",
    height: "100%",
    justifySelf: "center",
    alignSelf: "center",
    overflow: "visible",
    touchAction: "none",
    overscrollBehavior: "none",
    userSelect: "none",
    WebkitUserSelect: "none",

    "@media (max-width: 780px)": {
      gridColumn: "1",
      gridRow: "1"
    }
  },

  previewSurface: {
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
    border: 0,
    backgroundColor: "var(--color-transparent)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    boxShadow:
      "0 20px 60px color-mix(in srgb, var(--palette-ink) 18%, var(--color-transparent))",

    img: {
      pointerEvents: "none",
      userSelect: "none",
      objectFit: "contain"
    }
  },

  transformLayer: {
    display: "grid",
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    transformOrigin: "center center",
    willChange: "transform",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden"
  },

  title: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-1)",
    minHeight: "4rem",
    padding: "var(--space-2) var(--space-6)",
    background:
      "color-mix(in srgb, var(--surface-solid) 78%, var(--color-transparent))",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 -10px 30px color-mix(in srgb, var(--palette-ink) 10%, var(--color-transparent))",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "1rem",
    fontWeight: "var(--font-weight-semibold)",

    "@media (max-width: 780px)": {
      minHeight: "3.5rem",
      padding: "var(--space-2) var(--space-5)",
      lineHeight: "var(--line-height-compact)"
    }
  },

  titleIcon: {
    display: "block",
    flex: "none",
    width: "2rem",
    height: "2rem",
    color: "var(--palette-accent-fine)"
  }
};

export function PreviewDialog({ preview, onClose, onNavigate }) {
  const { content } = useI18n();
  const image = preview?.images[preview.imageIndex];
  const canNavigatePrevious = preview?.imageIndex > 0;
  const canNavigateNext = preview?.imageIndex < preview?.images.length - 1;

  function navigate(direction) {
    if (
      (direction < 0 && !canNavigatePrevious) ||
      (direction > 0 && !canNavigateNext)
    ) {
      return;
    }

    onNavigate(direction);
  }

  const { stageRef, transformRef, transform, getRenderedImageRect, touchHandlers } =
    useImageGestures({ src: image?.src, onSwipe: navigate });

  if (!preview) {
    return null;
  }

  function handleLightboxKeyDown(event) {
    if (event.key === "ArrowLeft") {
      navigate(-1);
    }

    if (event.key === "ArrowRight") {
      navigate(1);
    }
  }

  function handleViewerClick(event) {
    if (event.target.closest?.("button")) {
      return;
    }

    const imageRect = getRenderedImageRect();

    if (
      imageRect &&
      event.clientX >= imageRect.left &&
      event.clientX <= imageRect.right &&
      event.clientY >= imageRect.top &&
      event.clientY <= imageRect.bottom
    ) {
      return;
    }

    onClose();
  }

  return (
    <Lightbox
      closeLabel={content.ui.closePreview}
      contentClassName={className(styles.content)}
      isOpen={Boolean(preview)}
      labelledBy="preview-dialog-title"
      onClose={onClose}
      onKeyDown={handleLightboxKeyDown}
    >
      <div className={className(styles.viewer)} onClick={handleViewerClick}>
        <IconButton
          className={className([styles.nav, styles.navNext])}
          aria-label={content.ui.nextImage}
          disabled={!canNavigateNext}
          onClick={() => navigate(1)}
          size="lg"
        />
        <div className={className(styles.stageGroup)}>
          <div ref={stageRef} className={className(styles.stage)} {...touchHandlers}>
            <div
              ref={transformRef}
              className={className(styles.transformLayer)}
              style={{ transform }}
            >
              <PreviewSurface
                aspectRatio="auto"
                className={className(styles.previewSurface)}
                image={image}
                radius="var(--radius-md)"
                role="img"
                aria-label={image.alt}
              />
            </div>
          </div>

          <div id="preview-dialog-title" className={className(styles.title)}>
            <svg
              className={className(styles.titleIcon)}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx="12"
                cy="12"
                r="8.25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M12 10.75v5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />

              <path
                d="M12 7.85h.01"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>

            {image.alt}
          </div>
        </div>

        <IconButton
          className={className([styles.nav, styles.navPrev])}
          aria-label={content.ui.previousImage}
          disabled={!canNavigatePrevious}
          onClick={() => navigate(-1)}
          size="lg"
        />
      </div>
    </Lightbox>
  );
}
