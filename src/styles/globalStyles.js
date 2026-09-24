export const globalStyles = {
  ":root": {
    "--palette-ink": "#000000",
    "--palette-accent-soft": "#dcecff",
    "--palette-accent-fine": "#49a1f7",
    "--palette-surface-muted": "#f2f5f7",
    "--palette-surface": "#ffffff",
    "--palette-border": "#c9d1dc",

    "--opacity-subtle": "8%",
    "--opacity-muted": "18%",
    "--opacity-medium": "34%",
    "--opacity-strong": "45%",

    "--color-surface": "var(--palette-surface)",
    "--color-border": "var(--palette-border)",
    "--color-ink": "var(--palette-ink)",
    "--color-accent": "var(--palette-ink)",
    "--surface-frosted":
      "color-mix(in srgb, var(--color-surface), var(--color-transparent) var(--opacity-strong))",
    "--surface-overlay-soft":
      "color-mix(in srgb, var(--color-surface), var(--color-transparent) var(--opacity-muted))",
    "--surface-overlay-strong":
      "color-mix(in srgb, var(--color-surface), var(--color-transparent) var(--opacity-subtle))",
    "--surface-solid": "var(--color-surface)",
    "--line-muted": "var(--color-border)",

    "--color-background": "var(--color-surface)",
    "--color-text": "var(--color-ink)",
    "--color-on-accent": "var(--color-surface)",
    "--color-focus-ring": "var(--palette-accent-soft)",
    "--color-transparent": "transparent",
    "--color-nav-hover":
      "color-mix(in srgb, var(--palette-accent-soft) var(--opacity-strong), var(--color-transparent))",
    "--color-scrollbar":
      "color-mix(in srgb, var(--palette-ink) var(--opacity-medium), var(--color-transparent))",
    "--color-scrollbar-strong":
      "color-mix(in srgb, var(--palette-ink) var(--opacity-strong), var(--color-transparent))",
    "--color-scrollbar-track": "var(--color-transparent)",
    "--shadow-menu":
      "0 12px 28px color-mix(in srgb, var(--palette-ink) var(--opacity-subtle), var(--color-transparent))",
    "--main-inline-pad": "var(--space-5)",
    "--section-inline-gap": "var(--space-6)",

    "--font-size-sm": "0.92rem",
    "--font-size-md": "1.08rem",
    "--font-weight-regular": 400,
    "--font-weight-medium": 500,
    "--font-weight-semibold": 600,
    "--font-weight-bold": 700,

    "--content-width": "1000px",

    "--space-0": "0.25rem",
    "--space-1": "0.5rem",
    "--space-2": "0.75rem",
    "--space-3": "1rem",
    "--space-4": "1.5rem",
    "--space-5": "2rem",
    "--space-6": "3rem",
    "--space-7": "4rem",

    "--radius-sm": "8px",
    "--radius-md": "8px",
    "--radius-lg": "10px",
    "--radius-pill": "999px"
  },

  "*": {
    boxSizing: "border-box"
  },

  "[hidden]": {
    display: "none !important"
  },

  "html, #root": {
    height: "100%"
  },

  body: {
    height: "100%",
    margin: 0,
    color: "var(--color-text)",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: "var(--font-weight-regular)",
    lineHeight: 1.6,
    overflow: "hidden",
    textRendering: "optimizeLegibility"
  },

  "#root": {
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto"
  },

  a: {
    color: "inherit",
    textDecoration: "none"
  },

  "a:hover": {
    color: "var(--color-accent)"
  },

  "h3, p": {
    marginTop: 0
  },

  h3: {
    marginBottom: "var(--space-2)",
    fontSize: "var(--font-size-md)",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: 1.2
  },

  ":where(a, button, input, textarea):focus-visible": {
    outline: "3px solid var(--color-focus-ring)",
    outlineOffset: "var(--space-0)"
  },

  "@keyframes section-enter": {
    from: {
      opacity: 0,
      transform: "translateY(var(--space-3))"
    },

    to: {
      opacity: 1,
      transform: "translateY(0)"
    }
  },

  "@keyframes section-exit": {
    from: {
      opacity: 1,
      transform: "translateY(0)"
    },

    to: {
      opacity: 0,
      transform: "translateY(calc(-1 * var(--space-2)))"
    }
  },

  "@media (max-width: 780px)": {
    ":root": {
      "--main-inline-pad": "var(--space-3)",
      "--section-inline-gap": "var(--space-5)"
    },

    "html, body": {
      minHeight: "100%"
    },

    body: {
      overflow: "hidden"
    }
  }
};
