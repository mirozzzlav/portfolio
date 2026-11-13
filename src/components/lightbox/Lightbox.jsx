import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "src/useI18n.js";
import { useFocusTrap } from "src/hooks/useFocusTrap.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";
import { Backdrop } from "src/components/lightbox/Backdrop.jsx";
import { ImageViewer } from "src/components/lightbox/ImageViewer.jsx";
import { ArrowButton } from "src/components/lightbox/ArrowButton.jsx";
import { CloseButton } from "src/components/lightbox/CloseButton.jsx";
import { Description } from "src/components/lightbox/Description.jsx";

const styles = {
  root: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: "var(--layer-modal)",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    placeItems: "center",
    padding: "var(--space-5)",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",

    [`@media ${mediaQueries.mobile}`]: {
      padding:
        "max(var(--space-2), env(safe-area-inset-top)) max(var(--space-2), env(safe-area-inset-right)) max(var(--space-2), env(safe-area-inset-bottom)) max(var(--space-2), env(safe-area-inset-left))"
    },

    "@supports (height: 100dvh)": {
      height: "100dvh",
      minHeight: "100dvh"
    }
  },

  panel: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto",
    width: "100%",
    height: "100%",
    maxWidth: "90rem",
    maxHeight: "60rem",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    border: "var(--border-width-medium) solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface-solid)",
    boxShadow: "var(--shadow-preview)",

    [`@media ${mediaQueries.mobile}`]: {
      height: "auto",
      maxHeight: "100%"
    }
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-3)",
    padding: "var(--space-3) var(--space-4)",
    borderBottom: "var(--border-width-thin) solid var(--color-border)",

    [`@media ${mediaQueries.mobile}`]: {
      gap: "var(--space-1)",
      padding: "var(--space-2)"
    }
  },

  heading: {
    minWidth: 0
  },

  label: {
    display: "block",
    fontSize: "var(--font-size-xs)",
    lineHeight: "var(--line-height-tight)"
  },

  title: {
    display: "block",
    marginTop: "var(--space-0)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "var(--font-size-md)",
    lineHeight: "var(--line-height-tight)"
  },

  content: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    padding: "var(--space-4)",
    background: "var(--palette-surface-muted)",

    [`@media ${mediaQueries.mobile}`]: {
      padding: "var(--space-1)",
      width: "100%",
      maxHeight: "100%",
      aspectRatio: "var(--preview-aspect-ratio, 3 / 2)"
    }
  },

  footer: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-2)",
    borderTop: "var(--border-width-thin) solid var(--color-border)",

    [`@media ${mediaQueries.mobile}`]: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)"
    }
  },

  caption: {
    gridColumn: 2,
    gridRow: 1,
    minWidth: 0,
    maxHeight: "20dvh",
    overflowY: "auto"
  },

  navigation: {
    display: "contents",

    [`@media ${mediaQueries.mobile}`]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-4)"
    }
  },

  headerCounter: {
    [`@media ${mediaQueries.mobile}`]: {
      display: "none"
    }
  },

  mobileCounter: {
    display: "none",

    [`@media ${mediaQueries.mobile}`]: {
      display: "block",
      minWidth: "var(--space-6)",
      textAlign: "center",
      fontSize: "var(--font-size-xs)",
      fontVariantNumeric: "tabular-nums"
    }
  }
};

export function Lightbox({
  className,
  images = [],
  initialImageIndex = 0,
  isOpen,
  onClose,
  title
}) {
  const { content } = useI18n();
  const [imageIndex, setImageIndex] = useState(initialImageIndex);
  const [imageDimensions, setImageDimensions] = useState(null);
  const activeIndex = Math.min(Math.max(imageIndex, 0), Math.max(images.length - 1, 0));
  const image = images[activeIndex];
  const isActive = isOpen && Boolean(image);
  const imageDescription = image?.alt?.trim() || content.ui.imageDescriptionNotFound;
  const canNavigatePrevious = activeIndex > 0;
  const canNavigateNext = activeIndex < images.length - 1;
  const panelRef = useFocusTrap(isActive);

  const navigate = useCallback(
    (direction) => {
      setImageIndex((currentIndex) => {
        const lastIndex = Math.max(images.length - 1, 0);
        const boundedIndex = Math.min(Math.max(currentIndex, 0), lastIndex);
        return Math.min(Math.max(boundedIndex + direction, 0), lastIndex);
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        navigate(event.key === "ArrowLeft" ? -1 : 1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive, onClose, navigate]);

  if (!isActive) {
    return null;
  }

  return createPortal(
    <div className={mergeClassNames(styles.root, className)}>
      <Backdrop onClick={onClose} />
      <div
        ref={panelRef}
        className={mergeClassNames(styles.panel)}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-label={`${content.ui.screenshotPreview}: ${title || imageDescription}`}
      >
        <div className={mergeClassNames(styles.header)}>
          <div className={mergeClassNames(styles.heading)}>
            <span className={mergeClassNames(styles.label)}>
              {content.ui.screenshotPreview}
              <span className={mergeClassNames(styles.headerCounter)}>
                {" "}
                · {activeIndex + 1} / {images.length}
              </span>
            </span>
            <strong className={mergeClassNames(styles.title)}>{title}</strong>
          </div>
          <CloseButton
            label={content.ui.closePreview}
            shortLabel={content.ui.close}
            onClick={onClose}
          />
        </div>
        <div
          className={mergeClassNames(styles.content)}
          style={{
            "--preview-aspect-ratio":
              imageDimensions?.src === image.src ? imageDimensions.ratio : undefined
          }}
          onLoadCapture={(event) => {
            const loadedImage = event.target;
            if (
              loadedImage.matches('img:not([aria-hidden="true"])') &&
              loadedImage.naturalWidth > 0 &&
              loadedImage.naturalHeight > 0
            ) {
              setImageDimensions({
                src: image.src,
                ratio: loadedImage.naturalWidth / loadedImage.naturalHeight
              });
            }
          }}
        >
          <ImageViewer
            image={image}
            imageDescription={imageDescription}
            onSwipe={navigate}
          />
        </div>
        <div className={mergeClassNames(styles.footer)}>
          <div className={mergeClassNames(styles.caption)} aria-live="polite">
            <Description>{imageDescription}</Description>
          </div>
          <div className={mergeClassNames(styles.navigation)}>
            <ArrowButton
              direction="previous"
              aria-label={content.ui.previousImage}
              disabled={!canNavigatePrevious}
              onClick={() => navigate(-1)}
            />
            <span className={mergeClassNames(styles.mobileCounter)} aria-live="polite">
              {activeIndex + 1} / {images.length}
            </span>
            <ArrowButton
              direction="next"
              aria-label={content.ui.nextImage}
              disabled={!canNavigateNext}
              onClick={() => navigate(1)}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
