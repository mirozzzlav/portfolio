import { localizePath, removeLanguagePrefix } from "./index.js";

function resolveLink(href, language) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    const suffixIndex = href.search(/[?#]/);
    const pathname = suffixIndex < 0 ? href : href.slice(0, suffixIndex);
    const suffix = suffixIndex < 0 ? "" : href.slice(suffixIndex);

    return {
      type: "internal",
      href: `${localizePath(removeLanguagePrefix(pathname), language)}${suffix}`
    };
  }

  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) {
    return { type: "external", href };
  }

  return null;
}

export function parseInlineLinks(text, language) {
  const parts = [];
  let cursor = 0;

  for (const match of text.matchAll(/\[([^\]\n]+)\]\(([^()\s]+)\)/g)) {
    const link = resolveLink(match[2], language);

    if (!link) {
      continue;
    }

    if (match.index > cursor) {
      parts.push({ type: "text", text: text.slice(cursor, match.index) });
    }

    parts.push({ ...link, text: match[1] });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push({ type: "text", text: text.slice(cursor) });
  }

  return parts;
}
