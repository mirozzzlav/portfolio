import { BlurLoadedImage } from "./BlurLoadedImage.jsx";
import { mergeClassNames } from "../styles/classNames.js";

const styles = {
  surface: {
    position: "relative",
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
  className,
  image,
  imageLoading,
  radius = "var(--radius-sm)",
  ...props
}) {
  return (
    <Component
      className={mergeClassNames(
        styles.surface,
        { aspectRatio, borderRadius: radius },
        className
      )}
      {...props}
    >
      <BlurLoadedImage
        src={image.src}
        placeholderSrc={image.placeholderSrc}
        alt={props.role === "img" ? "" : image.alt}
        loading={imageLoading}
      />
    </Component>
  );
}
