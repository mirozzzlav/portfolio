const hoverUnderline = {
  textDecorationLine: "underline",
  textDecorationColor: "var(--palette-accent-fine)",
  textDecorationThickness: "var(--border-width-medium)",
  textUnderlineOffset: "calc(var(--space-2) / 2)"
};

export const standardLink = {
  color: "var(--color-ink)",
  fontWeight: "var(--font-weight-semibold)",
  textDecoration: "none",
  cursor: "pointer",

  "&:not(:disabled):hover": hoverUnderline,

  "&:not(:disabled):hover > [data-link-text]": hoverUnderline,

  "&:disabled": {
    cursor: "default",
    opacity: "var(--opacity-disabled)"
  }
};
