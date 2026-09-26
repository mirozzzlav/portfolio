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
    padding: "var(--space-6)",

    "@media (max-width: 780px)": {
      alignItems: "stretch",
      padding: "4.75rem var(--space-2) var(--space-3)"
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
    },

    "@media (max-width: 780px)": {
      width: "44px",
      height: "44px",
      boxShadow:
        "0 8px 24px color-mix(in srgb, var(--palette-ink) 10%, var(--color-transparent))"
    }
  },

  navPrev: {
    "&::before": {
      transform: "translate(-35%, -50%) rotate(225deg)"
    },

    "@media (max-width: 780px)": {
      gridColumn: "2",
      gridRow: "2"
    }
  },

  navNext: {
    "&::before": {
      transform: "translate(-65%, -50%) rotate(45deg)"
    },

    "@media (max-width: 780px)": {
      gridColumn: "3",
      gridRow: "2"
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
      height: "100%",
      gridTemplateColumns: "1fr auto auto 1fr",
      gridTemplateRows: "minmax(0, 1fr) auto",
      alignItems: "center",
      alignContent: "stretch",
      justifyItems: "center",
      columnGap: "var(--space-2)",
      rowGap: "var(--space-3)"
    }
  },

  stageGroup: {
    display: "contents",

    "@media (max-width: 780px)": {
      gridColumn: "1 / -1",
      gridRow: "1",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows: "auto auto",
      alignContent: "center",
      justifyItems: "center",
      width: "100%",
      minHeight: 0
    }
  },

  stage: {
    display: "grid",
    minWidth: 0,
    width: "min(100%, 1000px, calc((100dvh - 10rem) * 1.6))",
    justifySelf: "center",
    overflow: "visible",
    touchAction: "none",

    "@media (max-width: 780px)": {
      gridColumn: "1",
      gridRow: "1",
      alignSelf: "center",
      width: "min(100%, calc((100dvh - 8.75rem) * 1.6))"
    },

    "@supports not (height: 100dvh)": {
      width: "min(100%, 1000px, calc((100vh - 10rem) * 1.6))",

      "@media (max-width: 780px)": {
        width: "min(100%, calc((100vh - 8.75rem) * 1.6))"
      }
    }
  },

  previewSurface: {
    width: "100%",
    border: 0,
    backgroundColor: "var(--palette-accent-soft)",
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
    gridColumn: "2",
    marginBottom: 0,
    color: "var(--color-text)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    textAlign: "center",

    "@media (max-width: 780px)": {
      gridColumn: "1",
      gridRow: "2",
      maxWidth: "min(100%, 46ch)",
      marginTop: "var(--space-1)",
      lineHeight: "var(--line-height-compact)"
    }
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
      <div className={className(styles.viewer)}>
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
              aspectRatio="16 / 10"
              className={className(styles.previewSurface)}
              image={image}
              radius="var(--radius-md)"
              role="img"
              aria-label={image.alt}
              style={previewSurfaceStyle}
            />
          </div>
          <p id="preview-dialog-title" className={className(styles.title)}>
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
