import { useEffect, useRef, useState } from "react";
import {
  clamp,
  getBoundedOffset,
  getContainedImageSize
} from "src/utils/imageGeometry.js";
import { getSwipeDirection } from "src/utils/swipe.js";

const minZoom = 1;
const maxZoom = 3;

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

export function useImageGestures({ src, onSwipe }) {
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

  const imageState =
    zoomState.src === src
      ? zoomState
      : {
          src: src ?? null,
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
  }, [src]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
      src: src ?? null,
      ...liveTransform.current
    });
  }

  function getStageImageMetrics() {
    const stageRect = stageRef.current?.getBoundingClientRect();
    const renderedImage = stageRef.current?.querySelector(
      'img:not([aria-hidden="true"])'
    );

    if (!stageRect || !renderedImage?.naturalWidth || !renderedImage?.naturalHeight) {
      return null;
    }

    return {
      stageRect,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height,
      ...getContainedImageSize(stageRect, renderedImage)
    };
  }

  function createGestureStart(touch, metrics) {
    return {
      x: touch.clientX,
      y: touch.clientY,
      offsetX: liveTransform.current.offsetX,
      offsetY: liveTransform.current.offsetY,
      zoom: liveTransform.current.zoom,
      isZoomed: liveTransform.current.zoom > minZoom,
      stageWidth: metrics.stageWidth,
      stageHeight: metrics.stageHeight,
      containedWidth: metrics.containedWidth,
      containedHeight: metrics.containedHeight
    };
  }

  function createPinchStart(touches, metrics) {
    return {
      distance: getTouchDistance(touches),
      zoom: liveTransform.current.zoom,
      offsetX: liveTransform.current.offsetX,
      offsetY: liveTransform.current.offsetY,
      stageWidth: metrics.stageWidth,
      stageHeight: metrics.stageHeight,
      containedWidth: metrics.containedWidth,
      containedHeight: metrics.containedHeight
    };
  }

  function getRenderedImageRect() {
    const metrics = getStageImageMetrics();

    if (!metrics) {
      return null;
    }

    const { zoom, offsetX, offsetY } = liveTransform.current;

    const width = metrics.containedWidth * zoom;
    const height = metrics.containedHeight * zoom;

    const centerX = metrics.stageRect.left + metrics.stageWidth / 2 + offsetX;

    const centerY = metrics.stageRect.top + metrics.stageHeight / 2 + offsetY;

    return {
      bottom: centerY + height / 2,
      left: centerX - width / 2,
      right: centerX + width / 2,
      top: centerY - height / 2
    };
  }

  function handleTouchStart(event) {
    const metrics = getStageImageMetrics();

    if (!metrics) {
      return;
    }

    if (event.touches.length >= 2) {
      pinchStart.current = createPinchStart(event.touches, metrics);
      gestureStart.current = null;

      return;
    }

    if (event.touches.length !== 1) {
      gestureStart.current = null;
      return;
    }

    const touch = event.touches[0];

    gestureStart.current = createGestureStart(touch, metrics);
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
        start.stageHeight,
        start.containedWidth,
        start.containedHeight
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
      gesture.stageHeight,
      gesture.containedWidth,
      gesture.containedHeight
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

        const metrics = getStageImageMetrics();

        if (metrics) {
          gestureStart.current = createGestureStart(touch, metrics);
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

    const direction = getSwipeDirection(gesture, touch);
    gestureStart.current = null;

    if (direction) {
      onSwipe(direction);
    }
  }

  function handleTouchCancel() {
    gestureStart.current = null;
    pinchStart.current = null;
    commitTransform();
  }

  return {
    stageRef,
    transformRef,
    isZoomed,
    transform: getTransformStyle(imageState),
    getRenderedImageRect,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  };
}
