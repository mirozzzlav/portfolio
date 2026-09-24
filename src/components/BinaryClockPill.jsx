import { useEffect, useState } from "react";
import { className } from "../styles/classNames.js";

const styles = {
  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    minHeight: "38px",
    padding: "0 var(--space-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-pill)",
    background: "var(--surface-overlay-soft)",
    color: "var(--color-ink)",
    lineHeight: "var(--line-height-solid)"
  },

  label: {
    fontSize: "0.78rem",
    fontWeight: "var(--font-weight-semibold)",
    letterSpacing: 0,
    textTransform: "uppercase"
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
    <span
      className={className(styles.pill)}
      aria-label={`Binárne hodinky ${timeLabel}`}
      title={timeLabel}
    >
      <span className={className(styles.label)}>BIN</span>
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
    </span>
  );
}
