import { mediaQueries } from "src/styles/mediaQueries.js";
export const globalStyles = {
  "@font-face": {
    fontFamily: '"DSEG7 Modern"',
    src: 'url("/assets/fonts/dseg/dseg7-modern-bold.woff2") format("woff2")',
    fontDisplay: "swap",
    fontStyle: "normal",
    fontWeight: 700
  },

  ":root": {
    // Palette and colors
    "--palette-ink": "#000000",
    "--palette-accent-soft": "#dcecff",
    "--palette-accent-fine": "#49a1f7",
    "--palette-surface-muted": "#f2f5f7",
    "--palette-surface": "#ffffff",
    "--palette-border": "#c9d1dc",
    "--palette-error": "#b42318",
    "--palette-success": "#177245",
    "--color-surface": "var(--palette-surface)",
    "--color-border": "var(--palette-border)",
    "--color-ink": "var(--palette-ink)",
    "--color-accent": "var(--palette-ink)",
    "--color-link": "var(--palette-accent-fine)",
    "--color-error": "var(--palette-error)",
    "--color-success": "var(--palette-success)",
    "--line-muted": "var(--color-border)",
    "--color-background": "var(--color-surface)",
    "--color-text": "var(--color-ink)",
    "--color-on-accent": "var(--color-surface)",
    "--color-focus-ring": "var(--palette-accent-fine)",
    "--color-transparent": "transparent",

    // Opacity, surfaces and shadows
    "--opacity-disabled": 0.36,
    "--opacity-disabled-button": 0.58,
    "--surface-preview-title":
      "color-mix(in srgb, var(--surface-solid) 78%, var(--color-transparent))",
    "--surface-project-title":
      "color-mix(in srgb, var(--palette-surface-muted), var(--color-transparent) var(--opacity-medium))",
    "--surface-status-success":
      "color-mix(in srgb, var(--color-success) 10%, var(--color-transparent))",
    "--surface-status-error":
      "color-mix(in srgb, var(--color-error) 10%, var(--color-transparent))",
    "--shadow-footer":
      "0 -6px 16px color-mix(in srgb, var(--palette-ink) 4%, var(--color-transparent))",
    "--shadow-preview":
      "0 20px 60px color-mix(in srgb, var(--palette-ink) var(--opacity-muted), var(--color-transparent))",
    "--shadow-preview-title":
      "0 -10px 30px color-mix(in srgb, var(--palette-ink) 10%, var(--color-transparent))",
    "--opacity-subtle": "8%",
    "--opacity-muted": "18%",
    "--opacity-medium": "34%",
    "--opacity-strong": "45%",
    "--surface-frosted":
      "color-mix(in srgb, var(--color-surface), var(--color-transparent) var(--opacity-strong))",
    "--surface-overlay-strong":
      "color-mix(in srgb, var(--color-surface), var(--color-transparent) var(--opacity-subtle))",
    "--surface-solid": "var(--color-surface)",
    "--shadow-menu":
      "0 12px 28px color-mix(in srgb, var(--palette-ink) var(--opacity-subtle), var(--color-transparent))",
    "--shadow-divider":
      "0 var(--space-0) var(--space-0) color-mix(in srgb, var(--palette-ink) var(--opacity-subtle), var(--color-transparent))",

    // Typography
    "--font-family-ui":
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    "--font-family-condensed":
      '"Arial Narrow", "Liberation Sans Narrow", "Roboto Condensed", var(--font-family-ui)',
    "--letter-spacing-condensed": "-0.02em",
    "--font-size-base": "1rem",
    "--font-size-lg": "1.25rem",
    "--font-size-page-title": "clamp(1.8rem, 1.55rem + 1.25vw, 2.55rem)",
    "--font-size-project-title": "clamp(1.05rem, 2.4vw, 1.35rem)",
    "--font-size-not-found-code": "clamp(4rem, 16vw, 8rem)",
    "--font-size-not-found-title": "clamp(1.6rem, 5vw, 3rem)",
    "--font-size-footer-year": "0.78em",
    "--letter-spacing-digital": "0.04em",
    "--font-size-2xs": "0.78rem",
    "--font-size-xs": "0.84rem",
    "--font-size-sm": "0.92rem",
    "--font-size-md": "1.08rem",
    "--font-family-digital-numeric": '"DSEG7 Modern", monospace',
    "--font-weight-regular": 400,
    "--font-weight-medium": 500,
    "--font-weight-semibold": 600,
    "--font-weight-bold": 700,
    "--line-height-none": 0,
    "--line-height-solid": 1,
    "--line-height-compact": 1.1,
    "--line-height-heading": 1.2,
    "--line-height-body": 1.6,
    "--line-height-prose": 1.72,
    "--line-height-display": 0.98,

    // Spacing and layout
    "--content-width": "75ch",
    "--project-content-width": "68ch",
    "--game-width": "470px",
    "--main-inline-pad": "var(--space-5)",
    "--header-height": "76px",
    "--section-inline-gap": "var(--space-5)",
    "--space-2xs": "0.125rem",
    "--space-0": "0.25rem",
    "--space-1": "0.5rem",
    "--space-2": "0.75rem",
    "--space-3": "1rem",
    "--space-4": "1.5rem",
    "--space-5": "2rem",
    "--space-6": "3rem",
    "--space-7": "4rem",
    "--space-8": "5rem",

    // Controls and icons
    "--field-textarea-min-height": "132px",
    "--icon-button-size-xl": "48px",
    "--icon-size-lg": "22px",
    "--icon-size-status": "1.28rem",
    "--selection-indicator-size": "0.66rem",
    "--radius-xs": "2px",
    "--border-width-medium": "2px",
    "--outline-width-hover": "3px",
    "--control-height-sm": "30px",
    "--control-height-md": "40px",
    "--control-height-lg": "44px",
    "--control-gap-md": "0.4rem",
    "--icon-size-sm": "14px",
    "--icon-size-md": "16px",
    "--border-width-thin": "1px",
    "--radius-sm": "8px",
    "--radius-xl": "16px",
    "--radius-pill": "999px",

    // Component dimensions
    "--project-header-min-height": "1.2rem",
    "--preview-title-min-height-mobile": "3.5rem",
    "--header-control-width": "70px",
    "--header-menu-width": "190px",
    "--not-found-logo-width": "clamp(88px, 22vw, 148px)",

    // Effects and layers
    "--transition-duration-instant": "80ms",
    "--transition-duration-normal": "200ms",
    "--transition-duration-page": "280ms",
    "--transition-duration-crash": "0.42s",
    "--blur-sm": "4px",
    "--blur-md": "12px",
    "--layer-content": 10,
    "--layer-navigation": 20,
    "--layer-modal": 50,
    "--layer-modal-control": 60,
    "--transition-duration-fast": "160ms"
  },
  "*": {
    boxSizing: "border-box"
  },

  "[hidden]": {
    display: "none !important"
  },

  "html, #root": {
    minHeight: "100%"
  },

  body: {
    minHeight: "100%",
    margin: 0,
    color: "var(--color-text)",
    fontFamily: "var(--font-family-ui)",
    fontWeight: "var(--font-weight-regular)",
    lineHeight: "var(--line-height-body)",
    overflowX: "hidden",
    overflowY: "auto",
    textRendering: "optimizeLegibility"
  },

  "#root": {
    display: "grid",
    minHeight: "100vh",
    gridTemplateRows: "auto 1fr auto"
  },

  "@supports (height: 100svh)": {
    "#root": {
      minHeight: "100svh"
    }
  },

  a: {
    color: "inherit",
    fontWeight: "var(--font-weight-semibold)",
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
    lineHeight: "var(--line-height-heading)"
  },

  ":where(a, button, input, textarea, select, [tabindex]):focus-visible": {
    outline: "var(--border-width-medium) solid var(--color-focus-ring)",
    outlineOffset: "var(--border-width-medium)"
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

  [`@media ${mediaQueries.mobile}`]: {
    ":root": {
      "--header-height": "72px",
      "--section-inline-gap": "var(--space-4)"
    }
  }
};
