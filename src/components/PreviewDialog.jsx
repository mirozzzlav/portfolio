import { useEffect, useRef, useState } from "react";
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
    overscrollBehavior: "none",
    userSelect: "none",
    WebkitUserSelect: "none",

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

function getTransformStyle({ zoom, offsetX, offsetY }) {
  return `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoom})`;
}

export function PreviewDialog({ preview, onClose, onNavigate }) {
  const stageRef = useRef(null);
  const transformRef = useRef(null);

  const gestureStart = useRef(null);
  const pinchStart = useRef(null);

  const animationFrameRef = useRef(null);

  const liveTransform = useRef({
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  });

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
      : {
          src: image?.src ?? null,
          zoom: 1,
          offsetX: 0,
          offsetY: 0
        };

  const isZoomed = imageState.zoom > minZoom;

  useEffect(() => {
    gestureStart.current = null;
    pinchStart.current = null;

    liveTransform.current = {
      zoom: 1,
      offsetX: 0,
      offsetY: 0
    };

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const element = transformRef.current;

    if (element) {
      element.style.transform = getTransformStyle(liveTransform.current);
    }
  }, [image?.src]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!preview) {
    return null;
  }

  function applyTransform() {
    const element = transformRef.current;

    if (!element) {
      return;
    }

    const { zoom, offsetX, offsetY } = liveTransform.current;

    element.style.transform = getTransformStyle({
      zoom,
      offsetX,
      offsetY
    });
  }

  /*
   * Maximálne jeden zápis transformácie za animation frame.
   */
  function scheduleTransform() {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      applyTransform();
    });
  }

  /*
   * Po skončení gesta uložíme live hodnoty
   * aj do React state.
   */
  function commitTransform() {
    setZoomState({
      src: image?.src ?? null,
      ...liveTransform.current
    });
  }

  function createGestureStart(touch, stageRect) {
    return {
      x: touch.clientX,
      y: touch.clientY,
      offsetX: liveTransform.current.offsetX,
      offsetY: liveTransform.current.offsetY,
      zoom: liveTransform.current.zoom,
      isZoomed: liveTransform.current.zoom > minZoom,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height
    };
  }

  function createPinchStart(touches, stageRect) {
    return {
      distance: getTouchDistance(touches),
      zoom: liveTransform.current.zoom,
      offsetX: liveTransform.current.offsetX,
      offsetY: liveTransform.current.offsetY,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height
    };
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

    const imageAspectRatio =
      renderedImage.naturalWidth / renderedImage.naturalHeight;

    const containedWidth =
      imageAspectRatio > stageAspectRatio
        ? stageRect.width
        : stageRect.height * imageAspectRatio;

    const containedHeight =
      imageAspectRatio > stageAspectRatio
        ? stageRect.width / imageAspectRatio
        : stageRect.height;

    const { zoom, offsetX, offsetY } = liveTransform.current;

    const width = containedWidth * zoom;
    const height = containedHeight * zoom;

    const centerX = stageRect.left + stageRect.width / 2 + offsetX;

    const centerY = stageRect.top + stageRect.height / 2 + offsetY;

    return {
      bottom: centerY + height / 2,
      left: centerX - width / 2,
      right: centerX + width / 2,
      top: centerY - height / 2
    };
  }

  /*
   * Boundary výpočet bez getBoundingClientRect
   * počas touchmove.
   *
   * Šírku/výšku stage si uložíme na začiatku gesta.
   */
  function getBoundedOffset(
    offsetX,
    offsetY,
    zoom,
    stageWidth,
    stageHeight
  ) {
    if (zoom <= minZoom) {
      return {
        offsetX: 0,
        offsetY: 0
      };
    }

    const maxOffsetX = (stageWidth * (zoom - 1)) / 2;

    const maxOffsetY = (stageHeight * (zoom - 1)) / 2;

    return {
      offsetX: clamp(offsetX, -maxOffsetX, maxOffsetX),
      offsetY: clamp(offsetY, -maxOffsetY, maxOffsetY)
    };
  }

  function handleTouchStart(event) {
    const stageRect = stageRef.current?.getBoundingClientRect();

    if (!stageRect) {
      return;
    }

    if (event.touches.length >= 2) {
      pinchStart.current = createPinchStart(event.touches, stageRect);
      gestureStart.current = null;

      return;
    }

    if (event.touches.length !== 1) {
      gestureStart.current = null;
      return;
    }

    const touch = event.touches[0];

    gestureStart.current = createGestureStart(touch, stageRect);
  }

  function handleTouchMove(event) {
    if (pinchStart.current && event.touches.length >= 2) {
      event.preventDefault();

      const start = pinchStart.current;

      const nextZoom = clamp(
        start.zoom * (getTouchDistance(event.touches) / start.distance),
        minZoom,
        maxZoom
      );

      const bounded = getBoundedOffset(
        start.offsetX,
        start.offsetY,
        nextZoom,
        start.stageWidth,
        start.stageHeight
      );

      liveTransform.current = {
        zoom: nextZoom,
        ...bounded
      };

      scheduleTransform();

      return;
    }

    const gesture = gestureStart.current;
    const touch = event.touches[0];

    if (!gesture || !gesture.isZoomed || !touch) {
      return;
    }

    event.preventDefault();

    const nextOffsetX = gesture.offsetX + touch.clientX - gesture.x;

    const nextOffsetY = gesture.offsetY + touch.clientY - gesture.y;

    const bounded = getBoundedOffset(
      nextOffsetX,
      nextOffsetY,
      liveTransform.current.zoom,
      gesture.stageWidth,
      gesture.stageHeight
    );

    liveTransform.current = {
      ...liveTransform.current,
      ...bounded
    };

    scheduleTransform();
  }

  function handleTouchEnd(event) {
    if (pinchStart.current && event.touches.length < 2) {
      pinchStart.current = null;

      /*
       * React state aktualizujeme až TERAZ.
       */
      commitTransform();

      if (event.touches.length === 1) {
        const touch = event.touches[0];

        const stageRect = stageRef.current?.getBoundingClientRect();

        if (stageRect) {
          gestureStart.current = createGestureStart(touch, stageRect);
        }
      } else {
        gestureStart.current = null;
      }

      return;
    }

    if (event.touches.length > 0) {
      return;
    }

    const gesture = gestureStart.current;
    const touch = event.changedTouches[0];

    if (gesture?.isZoomed) {
      gestureStart.current = null;

      commitTransform();

      return;
    }

    if (!gesture || !touch) {
      gestureStart.current = null;
      return;
    }

    const deltaX = touch.clientX - gesture.x;

    const deltaY = touch.clientY - gesture.y;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    gestureStart.current = null;

    if (
      absX < swipeThreshold ||
      absX < absY * swipeDirectionRatio
    ) {
      return;
    }

    onNavigate(deltaX < 0 ? 1 : -1);
  }

  function handleTouchCancel() {
    gestureStart.current = null;
    pinchStart.current = null;
    commitTransform();
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
      <div
        className={className(styles.viewer)}
        onClick={handleViewerClick}
      >
        <IconButton
          className={className([
            styles.nav,
            styles.navPrev
          ])}
          aria-label="Predchádzajúci obrázok"
          onClick={() => onNavigate(-1)}
          size="lg"
        />

        <div
          className={className(styles.stageGroup)}
        >
          <div
            ref={stageRef}
            className={className(styles.stage)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <div
              ref={transformRef}
              className={className(
                styles.transformLayer
              )}
              style={{
                cursor:
                  isZoomed
                    ? "grab"
                    : "zoom-in",

                transform: getTransformStyle(imageState)
              }}
            >
              <PreviewSurface
                aspectRatio="auto"
                className={className(
                  styles.previewSurface
                )}
                image={image}
                radius="var(--radius-md)"
                role="img"
                aria-label={image.alt}
              />
            </div>
          </div>

          <div
            id="preview-dialog-title"
            className={className(styles.title)}
          >
            <svg
              className={className(
                styles.titleIcon
              )}
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
          className={className([
            styles.nav,
            styles.navNext
          ])}
          aria-label="Ďalší obrázok"
          onClick={() => onNavigate(1)}
          size="lg"
        />
      </div>
    </Lightbox>
  );
}
