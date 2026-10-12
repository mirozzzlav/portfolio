import { IconLink } from "src/components/IconLink.jsx";
import { parseInlineLinks } from "src/content/inlineLinks.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";

const styles = {
  link: {
    fontSize: "inherit",
    lineHeight: "inherit",
    maxWidth: "100%",
    whiteSpace: "normal",

    "> [data-link-text]": {
      lineHeight: "inherit"
    }
  }
};

export function InlineLinks({ text, tabIndex }) {
  const { language } = useI18n();

  return parseInlineLinks(text, language).map((part, index) => {
    if (part.type === "text") {
      return part.text;
    }

    if (part.type === "strong") {
      return <strong key={index}>{part.text}</strong>;
    }

    return (
      <IconLink
        key={index}
        className={className(styles.link)}
        tabIndex={tabIndex}
        to={part.type === "internal" ? part.href : undefined}
        href={part.type === "external" ? part.href : undefined}
      >
        {part.text}
      </IconLink>
    );
  });
}
