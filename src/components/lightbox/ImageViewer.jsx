import { mergeClassNames } from "src/styles/classNames.js";
import { useImageGestures } from "src/components/lightbox/useImageGestures.js";
import { PreviewSurface } from "src/components/lightbox/PreviewSurface.jsx";

const styles = {
  stage: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    minWidth: 0,
    minHeight: 0,
    width: "100%",
    height: "100%",
    touchAction: "none",
    overscrollBehavior: "none",
    userSelect: "none",
    WebkitUserSelect: "none"
  },

  previewSurface: {
    height: "100%",
    border: 0,
    backgroundColor: "var(--color-transparent)",

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

export function ImageViewer({ image, imageDescription, onSwipe }) {
  const { stageRef, transformRef, transform, touchHandlers } = useImageGestures({
    src: image.src,
    onSwipe
  });

  return (
    <div ref={stageRef} className={mergeClassNames(styles.stage)} {...touchHandlers}>
      <div
        ref={transformRef}
        className={mergeClassNames(styles.transformLayer)}
        style={{ transform }}
      >
        <PreviewSurface
          aspectRatio="auto"
          className={mergeClassNames(styles.previewSurface)}
          image={image}
          role="img"
          aria-label={imageDescription}
        />
      </div>
    </div>
  );
}
