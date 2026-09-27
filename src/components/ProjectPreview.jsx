import { className } from "../styles/classNames.js";
import { PreviewSurface } from "./PreviewSurface.jsx";

const styles = {
  preview: {
    position: "relative",
    appearance: "none",
    cursor: "zoom-in",
    color: "var(--color-text)",
    font: "inherit",
    textAlign: "left",

    "&:focus-visible": {
      outline: "2px solid var(--color-accent)",
      outlineOffset: "3px"
    }
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
      as="button"
      className={className(styles.preview)}
      image={image}
      imageLoading="lazy"
      type="button"
      aria-label={image.alt}
      tabIndex={isInteractive ? 0 : -1}
      onClick={isInteractive ? onOpen : undefined}
      onKeyDown={handleKeyDown}
    />
  );
}
