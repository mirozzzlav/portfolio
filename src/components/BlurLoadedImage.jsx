import { useEffect, useRef, useState } from "react";
import { mergeClassNames } from "../styles/classNames.js";

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
    zIndex: 0,
    transform: "scale(1.08)",
    filter: "blur(14px)",
    opacity: 1,
    transition: "opacity 180ms ease",

    "[data-loaded='true'] &": {
      opacity: 0
    },

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none"
    }
  },

  fullImage: {
    zIndex: 1,
    opacity: 0,
    transition: "opacity 220ms ease",

    "[data-loaded='true'] &": {
      opacity: 1
    },

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none"
    }
  }
};

export function BlurLoadedImage({
  alt,
  className,
  imageClassName,
  loading,
  placeholderSrc,
  src,
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

  return (
    <div
      className={mergeClassNames(styles.frame, className)}
      data-loaded={isLoaded ? "true" : "false"}
      {...props}
    >
      {placeholderSrc ? (
        <img
          className={mergeClassNames(styles.image, styles.placeholder)}
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding="async"
        />
      ) : null}
      {src ? (
        <img
          ref={imageRef}
          className={mergeClassNames(styles.image, styles.fullImage, imageClassName)}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
        />
      ) : null}
    </div>
  );
}
