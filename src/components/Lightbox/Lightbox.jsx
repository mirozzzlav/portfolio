import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "src/hooks/useFocusTrap.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";
import { Backdrop } from "src/components/Lightbox/Backdrop.jsx";
import { ImageViewer } from "src/components/Lightbox/ImageViewer.jsx";

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
  closeButton,
  description,
  images = [],
  initialImageIndex = 0,
  isOpen,
  missingDescription = "Image description not found",
  nextButton,
  onClose,
  previousButton,
  showDescriptionFromImageAlt = true
}) {
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
          {nextButton?.({ disabled: !canNavigateNext, onClick: () => navigate(1) })}
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
          {previousButton?.({
            disabled: !canNavigatePrevious,
            onClick: () => navigate(-1)
          })}
        </div>
        {closeButton}
      </div>
    </div>,
    document.body
  );
}
