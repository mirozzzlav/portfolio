import { Link as RouterLink } from "react-router-dom";
import { mergeClassNames } from "src/styles/classNames.js";
import Arrow from "src/components/Arrow.jsx";

const sizes = {
  sm: { fontSize: "var(--font-size-sm)" },
  md: { fontSize: "var(--font-size-md)" }
};

const animations = {
  slide: {
    "> svg": {
      transition: "translate var(--transition-duration-fast) ease"
    },

    "&:not(:disabled):is(:hover, :focus-visible) > svg": {
      translate: "var(--space-0) 0"
    },

    "&:not(:disabled):is(:hover, :focus-visible) > [data-navigation-arrow='left']": {
      translate: "calc(-1 * var(--space-0)) 0"
    }
  },
  scale: {
    "> svg": {
      transition: "scale var(--transition-duration-fast) ease"
    },

    "&:not(:disabled):hover > svg": {
      scale: "1.2"
    }
  }
};

const styles = {
  hoverUnderline: {
    "&:not(:disabled):hover, &:not(:disabled):hover > [data-link-text]": {
      textDecorationLine: "underline",
      textDecorationColor: "var(--palette-accent-fine)",
      textDecorationThickness: "var(--border-width-medium)",
      textUnderlineOffset: "calc(var(--space-2) / 2)"
    }
  },

  link: {
    color: "var(--color-ink)",
    fontWeight: "var(--font-weight-semibold)",
    textDecoration: "none",
    cursor: "pointer",
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-0)",
    position: "relative",
    border: 0,
    borderRadius: "var(--radius-pill)",
    padding: 0,
    background: "var(--color-transparent)",
    fontFamily: "inherit",
    textAlign: "left",
    whiteSpace: "nowrap",

    "&:disabled": {
      cursor: "default",
      opacity: "var(--opacity-disabled)"
    },

    "> svg": {
      color: "var(--palette-accent-fine)",
      display: "block",
      flex: "none",
      width: "var(--icon-size-md)",
      height: "var(--icon-size-md)"
    }
  },

  arrow: {
    // Optical offset follows the text baseline rather than the spacing scale.
    transform: "translateY(calc(0.16em - 2px))"
  },

  text: {
    display: "block",
    flex: "1 1 auto",
    minWidth: 0
  },

  reducedMotion: {
    "@media (prefers-reduced-motion: reduce)": {
      "> svg": {
        transition: "none"
      }
    }
  }
};

export function IconLink({
  animation = "scale",
  arrow = "external",
  children,
  className,
  href,
  icon,
  leading,
  size = "md",
  to,
  type = "button",
  underline = true,
  ...props
}) {
  const linkClassName = mergeClassNames(
    styles.link,
    underline && styles.hoverUnderline,
    sizes[size] || sizes.md,
    animations[animation] || animations.scale,
    styles.reducedMotion,
    className
  );
  let linkIcon = icon;

  if (!icon && (arrow === "left" || arrow === "right")) {
    linkIcon = (
      <Arrow
        className={mergeClassNames(styles.arrow)}
        data-navigation-arrow={arrow}
        direction={arrow}
      />
    );
  } else if (!icon && arrow === "external") {
    linkIcon = (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h6v6m0-6L10 14M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      </svg>
    );
  }

  const isLeadingArrow = !icon && arrow === "left";
  const content = (
    <>
      {leading}
      {isLeadingArrow && linkIcon}
      <span className={mergeClassNames(styles.text)} data-link-text>
        {children}
      </span>
      {!isLeadingArrow && linkIcon}
    </>
  );

  if (to) {
    return (
      <RouterLink className={linkClassName} to={to} {...props}>
        {content}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a className={linkClassName} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={linkClassName} type={type} {...props}>
      {content}
    </button>
  );
}
