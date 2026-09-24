import { css, cx } from "@emotion/css";

export function className(value) {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return cx(...value.map(className).filter(Boolean));
  }

  if (typeof value === "string") {
    return value;
  }

  return css(value);
}

export function mergeClassNames(...values) {
  return cx(...values.map(className).filter(Boolean));
}
