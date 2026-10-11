import { Link } from "react-router-dom";
import { parseInlineLinks } from "src/content/inlineLinks.js";
import { className } from "src/styles/classNames.js";
import { textLink } from "src/styles/linkStyles.js";
import { useI18n } from "src/useI18n.js";

const styles = {
  link: textLink
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

    const linkProps = { className: className(styles.link), tabIndex };

    return part.type === "internal" ? (
      <Link key={index} to={part.href} {...linkProps}>
        {part.text}
      </Link>
    ) : (
      <a key={index} href={part.href} {...linkProps}>
        {part.text}
      </a>
    );
  });
}
