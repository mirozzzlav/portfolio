import { useEffect, useState } from "react";
import { className } from "../styles/classNames.js";
import { Pill } from "./Pill.jsx";

const styles = {
  icon: {
    flex: "none",
    width: "16px",
    height: "16px",
    color: "var(--palette-accent-fine)"
  },

  time: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.16rem",
    fontFamily: "var(--font-family-digital-numeric)",
    fontSize: "0.78rem",
    fontWeight: "var(--font-weight-bold)",
    letterSpacing: "0.04em"
  },

  separator: {
    color: "var(--palette-accent-fine)",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: "0.92rem",
    fontWeight: "var(--font-weight-bold)",
    lineHeight: "var(--line-height-solid)",
    margin: "0 0.22rem"
  }
};

function ClockIcon() {
  return (
    <svg className={className(styles.icon)} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 6.75v5.25l3.25 2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M4.75 12a7.25 7.25 0 1 0 14.5 0 7.25 7.25 0 1 0-14.5 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function toBinary(value, length) {
  return value.toString(2).padStart(length, "0");
}

function getBinaryClockParts(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    binaryTimeParts: [toBinary(hours, 5), toBinary(minutes, 6), toBinary(seconds, 6)],
    timeLabel: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  };
}

export function BinaryClockPill() {
  const [clockDate, setClockDate] = useState(() => new Date());
  const { binaryTimeParts, timeLabel } = getBinaryClockParts(clockDate);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClockDate(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Pill aria-label={`Binárne hodinky ${timeLabel}`} title={timeLabel}>
      <ClockIcon />
      <span className={className(styles.time)}>
        {binaryTimeParts.map((timePart, timePartIndex) => (
          <span key={timePartIndex}>
            {timePartIndex > 0 ? (
              <span className={className(styles.separator)}>:</span>
            ) : null}
            {timePart}
          </span>
        ))}
      </span>
    </Pill>
  );
}
