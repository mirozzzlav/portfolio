import { useEffect, useMemo, useRef, useState } from "react";
import { className } from "../styles/classNames.js";
import { IconButton } from "./IconButton.jsx";
import { Lightbox } from "./Lightbox.jsx";
import { PreviewSurface } from "./PreviewSurface.jsx";

const swipeThreshold = 48;
const swipeDirectionRatio = 1.25;
const minZoom = 1;
const maxZoom = 3;

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
      height: "100%",
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "minmax(0, 1fr)",
      alignItems: "center",
      alignContent: "stretch",
      justifyItems: "center",
      width: "100%"
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
      gridColumn: "1",
      gridRow: "1",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "minmax(0, 1fr)",
      alignContent: "stretch",
      justifyItems: "center",
      width: "100%",
      minHeight: 0
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

    "@media (max-width: 780px)": {
      gridColumn: "1",
      gridRow: "1",
      alignSelf: "center",
      width: "100%",
      height: "100%"
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
    },

    "@media (prefers-reduced-motion: no-preference)": {
      transition: "transform 120ms ease"
    }
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
    textAlign: "center",

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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touches) {
  const firstTouch = touches[0];
  const secondTouch = touches[1];
  const deltaX = secondTouch.clientX - firstTouch.clientX;
  const deltaY = secondTouch.clientY - firstTouch.clientY;

  return Math.hypot(deltaX, deltaY);
}

export function PreviewDialog({ preview, onClose, onNavigate }) {
  const stageRef = useRef(null);
  const gestureStart = useRef(null);
  const pinchStart = useRef(null);
  const [zoomState, setZoomState] = useState({
    src: null,
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  });

  const image = preview?.images[preview.imageIndex];
  const imageState =
    zoomState.src === image?.src
      ? zoomState
      : { src: image?.src ?? null, zoom: 1, offsetX: 0, offsetY: 0 };
  const isZoomed = imageState.zoom > minZoom;

  useEffect(() => {
    gestureStart.current = null;
    pinchStart.current = null;
  }, [image?.src]);

  const previewSurfaceStyle = useMemo(
    () => ({
      cursor: isZoomed ? "grab" : "zoom-in",
      transform: `translate(${imageState.offsetX}px, ${imageState.offsetY}px) scale(${imageState.zoom})`,
      transformOrigin: "center center"
    }),
    [imageState.offsetX, imageState.offsetY, imageState.zoom, isZoomed]
  );

  if (!preview) {
    return null;
  }

  function handleLightboxKeyDown(event) {
    if (event.key === "ArrowLeft") {
      onNavigate(-1);
    }

    if (event.key === "ArrowRight") {
      onNavigate(1);
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

  function getRenderedImageRect() {
    const stageRect = stageRef.current?.getBoundingClientRect();
    const renderedImage = stageRef.current?.querySelector(
      'img:not([aria-hidden="true"])'
    );

    if (
      !stageRect ||
      !renderedImage?.naturalWidth ||
      !renderedImage?.naturalHeight
    ) {
      return null;
    }

    const stageAspectRatio = stageRect.width / stageRect.height;
    const imageAspectRatio = renderedImage.naturalWidth / renderedImage.naturalHeight;
    const containedWidth =
      imageAspectRatio > stageAspectRatio
        ? stageRect.width
        : stageRect.height * imageAspectRatio;
    const containedHeight =
      imageAspectRatio > stageAspectRatio
        ? stageRect.width / imageAspectRatio
        : stageRect.height;
    const width = containedWidth * imageState.zoom;
    const height = containedHeight * imageState.zoom;
    const centerX = stageRect.left + stageRect.width / 2 + imageState.offsetX;
    const centerY = stageRect.top + stageRect.height / 2 + imageState.offsetY;

    return {
      bottom: centerY + height / 2,
      left: centerX - width / 2,
      right: centerX + width / 2,
      top: centerY - height / 2
    };
  }

  function getBoundedOffset(offsetX, offsetY, zoom = imageState.zoom) {
    const stageRect = stageRef.current?.getBoundingClientRect();

    if (!stageRect || zoom <= minZoom) {
      return { offsetX: 0, offsetY: 0 };
    }

    const maxOffsetX = (stageRect.width * (zoom - 1)) / 2;
    const maxOffsetY = (stageRect.height * (zoom - 1)) / 2;

    return {
      offsetX: clamp(offsetX, -maxOffsetX, maxOffsetX),
      offsetY: clamp(offsetY, -maxOffsetY, maxOffsetY)
    };
  }

  function setImageTransform(nextState) {
    const zoom = nextState.zoom ?? imageState.zoom;
    const offset = getBoundedOffset(
      nextState.offsetX ?? imageState.offsetX,
      nextState.offsetY ?? imageState.offsetY,
      zoom
    );

    setZoomState({
      src: image?.src ?? null,
      zoom,
      ...offset
    });
  }

  function handleTouchStart(event) {
    if (event.touches.length >= 2) {
      pinchStart.current = {
        distance: getTouchDistance(event.touches),
        zoom: imageState.zoom,
        offsetX: imageState.offsetX,
        offsetY: imageState.offsetY
      };
      gestureStart.current = null;
      return;
    }

    if (event.touches.length !== 1) {
      gestureStart.current = null;
      return;
    }

    const touch = event.touches[0];

    gestureStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      offsetX: imageState.offsetX,
      offsetY: imageState.offsetY,
      isZoomed
    };
  }

  function handleTouchMove(event) {
    if (pinchStart.current && event.touches.length >= 2) {
      event.preventDefault();

      const nextZoom = clamp(
        pinchStart.current.zoom *
          (getTouchDistance(event.touches) / pinchStart.current.distance),
        minZoom,
        maxZoom
      );

      setImageTransform({
        zoom: nextZoom,
        offsetX: pinchStart.current.offsetX,
        offsetY: pinchStart.current.offsetY
      });
      return;
    }

    const gesture = gestureStart.current;
    const touch = event.touches[0];

    if (!gesture || !gesture.isZoomed || !touch) {
      return;
    }

    event.preventDefault();

    setImageTransform({
      offsetX: gesture.offsetX + touch.clientX - gesture.x,
      offsetY: gesture.offsetY + touch.clientY - gesture.y
    });
  }

  function handleTouchEnd(event) {
    if (event.touches.length < 2) {
      pinchStart.current = null;
    }

    if (event.changedTouches.length > 1 || event.touches.length > 0) {
      gestureStart.current = null;
      return;
    }

    const gesture = gestureStart.current;
    const touch = event.changedTouches[0];

    if (!gesture || !touch) {
      return;
    }

    const deltaX = touch.clientX - gesture.x;
    const deltaY = touch.clientY - gesture.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    gestureStart.current = null;

    if (gesture.isZoomed) {
      return;
    }

    if (absX < swipeThreshold || absX < absY * swipeDirectionRatio) {
      return;
    }

    onNavigate(deltaX < 0 ? 1 : -1);
  }

  function handleTouchCancel() {
    gestureStart.current = null;
    pinchStart.current = null;
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
      <div className={className(styles.viewer)} onClick={handleViewerClick}>
        <IconButton
          className={className([styles.nav, styles.navPrev])}
          aria-label="Predchádzajúci obrázok"
          onClick={() => onNavigate(-1)}
          size="lg"
        />
        <div className={className(styles.stageGroup)}>
          <div
            ref={stageRef}
            className={className(styles.stage)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <PreviewSurface
              aspectRatio="auto"
              className={className(styles.previewSurface)}
              image={image}
              radius="var(--radius-md)"
              role="img"
              aria-label={image.alt}
              style={previewSurfaceStyle}
            />
          </div>
          <p id="preview-dialog-title" className={className(styles.title)}>
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
          </p>
        </div>
        <IconButton
          className={className([styles.nav, styles.navNext])}
          aria-label="Ďalší obrázok"
          onClick={() => onNavigate(1)}
          size="lg"
        />
      </div>
    </Lightbox>
  );
}
