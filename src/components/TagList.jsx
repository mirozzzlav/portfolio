import { className } from "../styles/classNames.js";
import { Pill } from "./Pill.jsx";

const styles = {
  list: {
    display: "flex",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    columnGap: "var(--space-1)",
    rowGap: "0.3rem",
    height: "4.05rem",
    margin: 0,
    minHeight: "4.05rem",
    overflowX: "hidden",
    overflowY: "hidden",
    padding: 0,
    listStyle: "none",

    li: {
      flex: "none"
    }
  }
};

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.75 5.75v5.9c0 .46.18.9.5 1.22l6.86 6.86a1.75 1.75 0 0 0 2.48 0l5.14-5.14a1.75 1.75 0 0 0 0-2.48L12.87 5.25a1.72 1.72 0 0 0-1.22-.5h-5.9a1 1 0 0 0-1 1Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8.75 8.75h.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

export function TagList({ ariaLabel, items }) {
  return (
    <ul className={className(styles.list)} aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item}>
          <Pill size="compact">
            <TagIcon />
            {item}
          </Pill>
        </li>
      ))}
    </ul>
  );
}
