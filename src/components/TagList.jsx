import { className } from "src/styles/classNames.js";
import { Pill } from "src/components/Pill.jsx";
import { TechnologyIcon } from "src/components/TechnologyIcon.jsx";

const styles = {
  list: {
    display: "flex",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    columnGap: "var(--space-1)",
    rowGap: "var(--space-0)",
    margin: 0,
    padding: 0,
    listStyle: "none",

    li: {
      flex: "none"
    }
  }
};

export function TagList({ ariaLabel, items }) {
  return (
    <ul className={className(styles.list)} aria-label={ariaLabel}>
      {items.map((item) => {
        const { label, icon } =
          typeof item === "string" ? { label: item, icon: "tag" } : item;

        return (
          <li key={label}>
            <Pill size="compact">
              {icon ? <TechnologyIcon name={icon} /> : null}
              {label}
            </Pill>
          </li>
        );
      })}
    </ul>
  );
}
