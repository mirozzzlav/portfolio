import { mergeClassNames } from "../styles/classNames.js";

const styles = {
  icon: {
    display: "block",
    flex: "none",
    width: "1rem",
    height: "1rem"
  }
};

export default function Arrow({ className, direction = "right", ...rest }) {
  const path = direction === "left" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5";

  return (
    <svg
      className={mergeClassNames(styles.icon, className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
      {...rest}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
