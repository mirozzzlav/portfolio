import { LightboxButton } from "src/components/lightbox/LightboxButton.jsx";

export function CloseButton({ className, label = "Close", ...props }) {
  return (
    <LightboxButton className={className} aria-label={label} {...props}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M6 6l12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span>{label}</span>
    </LightboxButton>
  );
}
