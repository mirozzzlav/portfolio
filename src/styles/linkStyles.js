const linkIcon = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6m0-6L10 14M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/></svg>'
)}")`;

export const textLink = {
  color: "var(--color-link)",
  fontWeight: "var(--font-weight-medium)",
  paddingInlineEnd: "var(--space-1)",
  textUnderlineOffset: "var(--space-0)",

  "&:hover": {
    color: "var(--color-link)",
    textDecoration: "underline"
  },

  "&::after": {
    content: '""',
    display: "inline-block",
    width: "0.8em",
    height: "0.8em",
    marginLeft: "var(--space-0)",
    verticalAlign: "-0.05em",
    backgroundColor: "currentColor",
    maskImage: linkIcon,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain"
  }
};
