import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "src/hooks/useFocusTrap.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { mediaQueries } from "src/styles/mediaQueries.js";
import { Backdrop } from "src/components/lightbox/Backdrop.jsx";
import { ImageViewer } from "src/components/lightbox/ImageViewer.jsx";
import { ArrowButton } from "src/components/lightbox/ArrowButton.jsx";
import { CloseButton } from "src/components/lightbox/CloseButton.jsx";
import { Description } from "src/components/lightbox/Description.jsx";
import { defaultLightboxTheme } from "src/components/lightbox/theme.js";

const styles = {
  root: {
    ...defaultLightboxTheme,
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "var(--lightbox-font-size)",
    fontWeight: 400,
    fontStyle: "normal",
    lineHeight: 1.5,
    color: "var(--lightbox-text-color)",

    "& *, & *::before, & *::after": {
      boxSizing: "border-box"
    },

    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: "var(--lightbox-z-index)",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    placeItems: "center",
    padding:
      "max(var(--lightbox-spacing), env(safe-area-inset-top)) max(calc(var(--lightbox-spacing) * 2), env(safe-area-inset-right)) max(var(--lightbox-spacing), env(safe-area-inset-bottom)) max(calc(var(--lightbox-spacing) * 2), env(safe-area-inset-left))",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",

    [`@media ${mediaQueries.mobile}`]: {
      paddingInline:
        "max(calc(var(--lightbox-spacing) * 4 / 3), env(safe-area-inset-left)) max(calc(var(--lightbox-spacing) * 4 / 3), env(safe-area-inset-right))"
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
    gap: "var(--lightbox-spacing)",
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0
  },

  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "var(--lightbox-spacing)"
  },

  image: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden"
  },

  footer: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "var(--lightbox-spacing)"
  },

  caption: {
    minWidth: 0,
    maxHeight: "20dvh",
    overflowY: "auto"
  }
};

const identity = (text) => text;

// ImageWrapper receives only an <img> as children. The lightbox owns the
// viewer, gestures, controls, and gallery metadata.
// translate receives readable English text; by default it returns it unchanged.
export function Lightbox({
  className,
  images = [],
  initialImageIndex = 0,
  isOpen,
  onClose,
  title,
  ImageWrapper,
  translate = identity,
  theme
}) {
  const [imageIndex, setImageIndex] = useState(initialImageIndex);
  const activeIndex = Math.min(Math.max(imageIndex, 0), Math.max(images.length - 1, 0));
  const image = images[activeIndex];
  const isActive = isOpen && Boolean(image);
  const imageDescription =
    image?.alt?.trim() || translate("Image description not found");
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
    <div
      ref={panelRef}
      className={mergeClassNames(styles.root, className)}
      style={theme}
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
      aria-label={`${translate("Image preview")}: ${title || imageDescription}`}
    >
      <Backdrop onClick={onClose} />
      <div className={mergeClassNames(styles.panel)}>
        <div className={mergeClassNames(styles.header)}>
          <CloseButton label={translate("Close")} onClick={onClose} />
        </div>
        <div className={mergeClassNames(styles.image)}>
          <ImageViewer
            image={image}
            imageDescription={imageDescription}
            onSwipe={navigate}
            ImageWrapper={ImageWrapper}
          />
        </div>
        <div className={mergeClassNames(styles.footer)}>
          <ArrowButton
            direction="previous"
            aria-label={translate("Previous image")}
            disabled={!canNavigatePrevious}
            onClick={() => navigate(-1)}
          />
          <div className={mergeClassNames(styles.caption)} aria-live="polite">
            <Description>{imageDescription}</Description>
          </div>
          <ArrowButton
            direction="next"
            aria-label={translate("Next image")}
            disabled={!canNavigateNext}
            onClick={() => navigate(1)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
