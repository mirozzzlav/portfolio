import { className } from "src/styles/classNames.js";
import { PreviewSurface } from "src/components/PreviewSurface.jsx";

const styles = {
  preview: {
    position: "relative",
    appearance: "none",
    cursor: "zoom-in",
    color: "var(--color-text)",
    font: "inherit",
    textAlign: "left"
  }
};

export function ProjectPreview({ image, isInteractive, onOpen }) {
  function handleKeyDown(event) {
    if (!isInteractive) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  }

  return (
    <PreviewSurface
      className={className(styles.preview)}
      image={image}
      imageLoading="lazy"
      aria-label={image.alt}
      tabIndex={-1}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    />
  );
}
