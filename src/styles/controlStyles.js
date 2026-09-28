export const controlFrame = {
  border: "var(--border-width-thin) solid var(--color-border)",
  borderRadius: "var(--radius-pill)"
};

export const pillContent = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "var(--font-weight-semibold)",
  lineHeight: "var(--line-height-solid)",
  textTransform: "uppercase",

  svg: {
    flex: "none",
    color: "var(--palette-accent-fine)"
  }
};

export const compactControlSize = {
  gap: "var(--control-gap-md)",
  minHeight: "var(--control-height-md)",
  padding: "0 var(--space-2)",

  svg: {
    width: "var(--icon-size-md)",
    height: "var(--icon-size-md)"
  }
};

export const controlSurface = {
  background: "var(--color-surface)",
  color: "var(--color-ink)"
};

export const controlAccent = {
  borderColor: "var(--palette-accent-fine)",
  background: "var(--palette-accent-fine)",
  color: "var(--color-on-accent)"
};
