import { Link as RouterLink } from "react-router-dom";
import { mergeClassNames } from "src/styles/classNames.js";
import { standardLink } from "src/styles/linkStyles.js";
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

    "&:not(:disabled):hover > svg, &:not(:disabled):focus-visible > svg": {
      translate: "var(--space-0) 0"
    },

    "&:not(:disabled):hover > [data-navigation-arrow='left'], &:not(:disabled):focus-visible > [data-navigation-arrow='left']":
      {
        translate: "calc(-1 * var(--space-0)) 0"
      }
  },
  scale: {
    "> svg": {
      transition: "scale var(--transition-duration-fast) ease"
    },

    "&:not(:disabled):hover > svg, &:not(:disabled):focus-visible > svg": {
      scale: "1.2"
    }
  }
};

const styles = {
  link: {
    ...standardLink,
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-1)",
    position: "relative",
    border: 0,
    borderRadius: "var(--radius-sm)",
    padding: 0,
    background: "var(--color-transparent)",
    fontFamily: "inherit",
    lineHeight: "var(--line-height-compact)",
    textAlign: "left",
    whiteSpace: "nowrap",

    "> svg": {
      color: "var(--palette-accent-fine)",
      display: "block",
      flex: "none",
      width: "var(--icon-size-md)",
      height: "var(--icon-size-md)"
    },

    "&:focus-visible": {
      "@media (forced-colors: active)": {
        outlineColor: "Highlight"
      }
    }
  },

  arrow: {
    // Optical offset follows the text baseline rather than the spacing scale.
    transform: "translateY(calc(0.16em - 2px))"
  },

  text: {
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
    lineHeight: "var(--line-height-solid)",
    transform: "translateY(-0.01em)"
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
  ...props
}) {
  const linkClassName = mergeClassNames(
    styles.link,
    sizes[size] || sizes.md,
    animations[animation] || animations.scale,
    styles.reducedMotion,
    className
  );
  const content = (
    <>
      {leading}
      {!icon && arrow === "left" ? (
        <Arrow
          className={mergeClassNames(styles.arrow)}
          data-navigation-arrow="left"
          direction="left"
        />
      ) : null}
      <span className={mergeClassNames(styles.text)} data-link-text>
        {children}
      </span>
      {icon ||
        (arrow === "right" ? (
          <Arrow
            className={mergeClassNames(styles.arrow)}
            data-navigation-arrow="right"
            direction="right"
          />
        ) : arrow === "external" ? (
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
        ) : null)}
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
