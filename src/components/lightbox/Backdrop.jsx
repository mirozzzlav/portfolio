import { mergeClassNames } from "src/styles/classNames.js";

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: "var(--lightbox-overlay)",
    backdropFilter: "blur(var(--lightbox-backdrop-blur))"
  }
};

export function Backdrop({ className, onClick }) {
  return (
    <div
      className={mergeClassNames(styles.backdrop, className)}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
