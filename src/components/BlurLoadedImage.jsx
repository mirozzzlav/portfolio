import { useEffect, useRef, useState } from "react";
import { mergeClassNames } from "src/styles/classNames.js";

const fadeTransition = {
  transition:
    "opacity var(--blur-loaded-image-transition, var(--transition-duration-normal, 200ms)) ease",

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none"
  }
};

const blurredImage = {
  transform: "scale(1.08)",
  filter: "blur(var(--blur-loaded-image-blur, var(--blur-md, 12px)))"
};

const placeholderFade = {
  ...fadeTransition,
  zIndex: 0,
  opacity: 1,

  "[data-loaded='true'] &": {
    opacity: 0
  }
};

const styles = {
  frame: {
    position: "relative",
    display: "block",
    width: "100%",
    height: "100%",
    minWidth: 0,
    overflow: "hidden"
  },

  image: {
    position: "absolute",
    inset: 0,
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  placeholder: {
    ...placeholderFade,
    ...blurredImage
  },

  fullImage: {
    ...fadeTransition,
    zIndex: 1,
    opacity: 0,

    "[data-loaded='true'] &": {
      opacity: 1
    }
  },

  wrappedFrame: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    minHeight: 0,

    "> :last-child": {
      ...fadeTransition,
      position: "relative",
      zIndex: 1,
      opacity: 0
    },

    "&[data-loaded='true'] > :last-child": {
      opacity: 1
    }
  },

  wrappedImage: {
    position: "relative",
    inset: "auto",
    minWidth: 0,
    minHeight: 0
  },

  wrappedPlaceholder: {
    ...placeholderFade,
    position: "absolute",
    inset: 0
  },

  blurredImage
};

export function BlurLoadedImage({
  alt,
  className,
  imageClassName,
  loading,
  placeholderSrc,
  src,
  ImageWrapper,
  ...props
}) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const imageRef = useRef(null);
  const isLoaded = loadedSrc === src;

  useEffect(() => {
    const image = imageRef.current;

    if (!src || !image) {
      setLoadedSrc(null);
      return undefined;
    }

    let isCurrent = true;

    function markLoaded() {
      if (isCurrent) {
        setLoadedSrc(src);
      }
    }

    if (image.complete && image.naturalWidth > 0) {
      markLoaded();
      return undefined;
    }

    image
      .decode?.()
      .then(markLoaded)
      .catch(() => {
        if (image.complete && image.naturalWidth > 0) {
          markLoaded();
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [src]);

  const fullImage = src ? (
    <img
      ref={imageRef}
      className={mergeClassNames(
        styles.image,
        ImageWrapper ? styles.wrappedImage : styles.fullImage,
        imageClassName
      )}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={() => setLoadedSrc(src)}
    />
  ) : null;

  return (
    <div
      className={mergeClassNames(
        styles.frame,
        ImageWrapper && styles.wrappedFrame,
        className
      )}
      data-loaded={isLoaded ? "true" : "false"}
      {...props}
    >
      {placeholderSrc && ImageWrapper ? (
        <div className={mergeClassNames(styles.wrappedPlaceholder)} aria-hidden="true">
          <ImageWrapper>
            <img
              className={mergeClassNames(
                styles.image,
                styles.wrappedImage,
                styles.blurredImage
              )}
              src={placeholderSrc}
              alt=""
              aria-hidden="true"
              loading={loading}
              decoding="async"
            />
          </ImageWrapper>
        </div>
      ) : placeholderSrc ? (
        <img
          className={mergeClassNames(styles.image, styles.placeholder)}
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding="async"
        />
      ) : null}
      {fullImage && ImageWrapper ? <ImageWrapper>{fullImage}</ImageWrapper> : fullImage}
    </div>
  );
}
