/** @jsxImportSource @emotion/react */
import { PreviewSurface } from "./PreviewSurface.jsx";

const styles = {
  preview: {
    cursor: "zoom-in"
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
      css={styles.preview}
      image={image}
      imageLoading="lazy"
      role={image.src ? undefined : "button"}
      aria-label={image.src ? undefined : image.alt}
      tabIndex={isInteractive ? 0 : -1}
      onClick={isInteractive ? onOpen : undefined}
      onKeyDown={handleKeyDown}
    />
  );
}
