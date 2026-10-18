import { mediaQueries } from "src/styles/mediaQueries.js";
import { mergeClassNames } from "src/styles/classNames.js";
import { useImageGestures } from "src/hooks/useImageGestures.js";
import { PreviewSurface } from "src/components/PreviewSurface.jsx";

const styles = {
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
  }
};

export function ImageViewer({
  image,
  imageDescription,
  onSwipe,
  onOutsideClick,
  description
}) {
  const { stageRef, transformRef, transform, getRenderedImageRect, touchHandlers } =
    useImageGestures({ src: image.src, onSwipe });

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

    onOutsideClick?.();
  }

  return (
    <>
      <div className={mergeClassNames(styles.viewer)} onClick={handleViewerClick}>
        <div className={mergeClassNames(styles.stageGroup)}>
          <div
            ref={stageRef}
            className={mergeClassNames(styles.stage)}
            {...touchHandlers}
          >
            <div
              ref={transformRef}
              className={mergeClassNames(styles.transformLayer)}
              style={{ transform }}
            >
              <PreviewSurface
                aspectRatio="auto"
                className={mergeClassNames(styles.previewSurface)}
                image={image}
                radius="var(--radius-sm)"
                role="img"
                aria-label={imageDescription}
              />
            </div>
          </div>
        </div>
      </div>
      {description?.({ onClick: handleViewerClick })}
    </>
  );
}
