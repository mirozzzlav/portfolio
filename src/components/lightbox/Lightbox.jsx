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
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    padding: 0,

    [`@media ${mediaQueries.mobile}`]: {
      alignItems: "stretch"
    }
  }
};

export function Lightbox({
  className,
  description,
  images = [],
  initialImageIndex = 0,
  isOpen,
  missingDescription = "Image description not found",
  onClose,
  showDescriptionFromImageAlt = true
}) {
  const { content } = useI18n();
  const [imageIndex, setImageIndex] = useState(initialImageIndex);
  const activeIndex = Math.min(Math.max(imageIndex, 0), Math.max(images.length - 1, 0));
  const image = images[activeIndex];
  const isActive = isOpen && Boolean(image);
  const imageDescription = image?.alt?.trim() || missingDescription;
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
        aria-label={imageDescription}
      >
        <div className={mergeClassNames(styles.content)}>
          <ArrowButton
            direction="next"
            aria-label={content.ui.nextImage}
            disabled={!canNavigateNext}
            onClick={() => navigate(1)}
          />
          <ImageViewer
            image={image}
            imageDescription={imageDescription}
            onSwipe={navigate}
            onOutsideClick={onClose}
            description={
              showDescriptionFromImageAlt && description
                ? (props) => description(imageDescription, props)
                : undefined
            }
          />
          <ArrowButton
            direction="previous"
            aria-label={content.ui.previousImage}
            disabled={!canNavigatePrevious}
            onClick={() => navigate(-1)}
          />
        </div>
        <CloseButton label={content.ui.closePreview} onClick={onClose} />
      </div>
    </div>,
    document.body
  );
}
