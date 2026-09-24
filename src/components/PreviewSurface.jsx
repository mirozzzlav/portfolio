/** @jsxImportSource @emotion/react */
import { projectPreviewVariants } from "./projectPreviewVariants.js";

const styles = {
  surface: {
    display: "block",
    width: "100%",
    minWidth: 0,
    padding: 0,
    overflow: "hidden",
    border: "1px solid var(--line-muted)",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--palette-accent-soft)",
    backgroundPosition: "center",
    backgroundSize: "cover",

    img: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }
};

export function PreviewSurface({
  as: Component = "span",
  aspectRatio = "1",
  image,
  imageLoading,
  radius = "var(--radius-sm)",
  ...props
}) {
  return (
    <Component
      css={[
        styles.surface,
        { aspectRatio, borderRadius: radius },
        projectPreviewVariants[image.className]
      ]}
      {...props}
    >
      {image.src ? (
        <img
          src={image.src}
          alt={props.role === "img" ? "" : image.alt}
          loading={imageLoading}
        />
      ) : null}
    </Component>
  );
}
