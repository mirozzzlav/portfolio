import { mediaQueries } from "src/styles/mediaQueries.js";
import { useImageGestures } from "src/hooks/useImageGestures.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { Button } from "src/components/Button.jsx";
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

    [`@media ${mediaQueries.mobile}`]: {
      alignItems: "stretch"
    }
  },

  nav: {
    position: "absolute",
    top: "50%",
    zIndex: 2,
    width: "var(--icon-button-size-xl)",
    height: "var(--icon-button-size-xl)",
    borderRadius: "var(--radius-pill)",
    background: "var(--surface-solid)",
    boxShadow: "var(--shadow-menu)",

    "&::before": {
      position: "absolute",
      top: "50%",
      left: "50%",
      // Chevron geometry stays in pixels, independently of the UI size scale.
      width: "11px",
      height: "11px",
      borderTop: "var(--border-width-medium) solid currentColor",
      borderRight: "var(--border-width-medium) solid currentColor",
      content: '""'
    },
    "&:disabled, &:disabled:hover, &:disabled:active": {
      borderColor: "var(--color-border)",
      background: "var(--surface-solid)",
      boxShadow: "none",
      color: "var(--color-text)",
      cursor: "default",
      opacity: "var(--opacity-disabled)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      width: "var(--control-height-lg)",
      height: "var(--control-height-lg)",
      boxShadow: "var(--shadow-menu)"
    }
  },

  navPrev: {
    left: "var(--space-3)",
    transform: "translateY(-50%)",

    "&::before": {
      transform: "translate(-35%, -50%) rotate(225deg)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      left: "var(--space-2)"
    }
  },

  navNext: {
    right: "var(--space-4)",
    transform: "translateY(-50%)",

    "&::before": {
      transform: "translate(-65%, -50%) rotate(45deg)"
    },

    [`@media ${mediaQueries.mobile}`]: {
      right: "var(--space-3)"
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

    [`@media ${mediaQueries.mobile}`]: {
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

    [`@media ${mediaQueries.mobile}`]: {
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

    [`@media ${mediaQueries.mobile}`]: {
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
    boxShadow: "var(--shadow-preview)",

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
    minHeight: "var(--space-7)",
    padding: "var(--space-2) var(--space-6)",
    background: "var(--surface-preview-title)",
    backdropFilter: "blur(var(--blur-md))",
    boxShadow: "var(--shadow-preview-title)",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-base)",
    fontWeight: "var(--font-weight-semibold)",

    [`@media ${mediaQueries.mobile}`]: {
      minHeight: "var(--preview-title-min-height-mobile)",
      padding: "var(--space-2) var(--space-5)",
      lineHeight: "var(--line-height-compact)"
    }
  },

  titleIcon: {
    display: "block",
    flex: "none",
    width: "var(--space-5)",
    height: "var(--space-5)",
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
        <Button
          className={className([styles.nav, styles.navNext])}
          aria-label={content.ui.nextImage}
          disabled={!canNavigateNext}
          onClick={() => navigate(1)}
          iconOnly
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
                radius="var(--radius-sm)"
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

        <Button
          className={className([styles.nav, styles.navPrev])}
          aria-label={content.ui.previousImage}
          disabled={!canNavigatePrevious}
          onClick={() => navigate(-1)}
          iconOnly
        />
      </div>
    </Lightbox>
  );
}
