import { className } from "src/styles/classNames.js";
import { TechnologyIcon } from "src/components/TechnologyIcon.jsx";
import { IconLabel } from "src/components/IconLabel.jsx";

const styles = {
  list: {
    display: "flex",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    columnGap: "var(--space-3)",
    rowGap: "var(--space-1)",
    margin: 0,
    padding: 0,
    listStyle: "none"
  }
};

export function TagList({ ariaLabel, items }) {
  return (
    <ul className={className(styles.list)} aria-label={ariaLabel}>
      {items.map((item) => {
        const { label, icon } =
          typeof item === "string" ? { label: item, icon: "tag" } : item;

        return (
          <IconLabel
            as="li"
            key={label}
            fontWeight="var(--font-weight-medium)"
            icon={icon ? <TechnologyIcon name={icon} /> : null}
          >
            {label}
          </IconLabel>
        );
      })}
    </ul>
  );
}
