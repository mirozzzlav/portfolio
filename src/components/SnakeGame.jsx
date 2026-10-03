import { keyframes } from "@emotion/css";
import { GRID_SIZE, useSnakeGame } from "src/hooks/useSnakeGame.js";
import { className, mergeClassNames } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { useMemo } from "react";

const blink = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: "var(--opacity-subtle)" }
});

const styles = {
  game: {
    width: "100%",
    "--snake-color": "var(--color-ink)",
    "--food-color": "var(--palette-accent-fine)",
    padding: "var(--space-1)"
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-1)",
    marginTop: "var(--space-1)",
    fontSize: "var(--font-size-sm)",
    textTransform: "uppercase"
  },
  score: {
    fontFamily: "var(--font-family-digital-numeric)",
    paddingLeft: "var(--space-0)"
  },
  button: {
    all: "unset",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-0)",
    "&:focus, &:focus-visible": {
      outline: "none",
      "& > kbd": {
        background: "var(--color-focus-ring)"
      }
    },

    "& > kbd": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      aspectRatio: 1,
      height: "var(--control-height-sm)",
      border: "var(--border-width-thin) solid currentColor",
      borderBottomWidth: "calc(3 * var(--border-width-thin))",
      borderRadius: "var(--radius-sm)"
    }
  },
  board: {
    boxShadow: "var(--shadow-menu)",
    width: "100%",
    border: "var(--border-width-thin) solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    transition: "border-color var(--transition-duration-fast) ease",
    aspectRatio: "1",
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
    // Scale the gutters with the board so the cells stay square at every size.
    gap: "0.75%",
    padding: "0.75%"
  },
  cell: { minWidth: 0, minHeight: 0, borderRadius: "var(--radius-sm)" },
  body: { background: "var(--snake-color)" },
  food: { background: "var(--food-color)" },
  crash: {
    animation: `${blink} 0.42s linear 3`,
    "@media (prefers-reduced-motion: reduce)": { animation: "none" }
  }
};

const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
  x: index % GRID_SIZE,
  y: Math.floor(index / GRID_SIZE)
}));

// speed is moves per second; lower values slow the snake, and zero stops movement.
export function SnakeGame({ speed, snakeClassName, foodClassName }) {
  const { content } = useI18n();
  const labels = content.snakeGame;
  const { snake, food, score, mode, paused, crashing, startGame, togglePause } =
    useSnakeGame(speed);
  const snakePositions = new Set(snake.map(({ x, y }) => `${x}:${y}`));
  const isDemo = mode === "demo";
  const actionLabel = isDemo
    ? labels.start
    : paused && !crashing
      ? labels.resume
      : labels.pause;

  const scoreZeroPrefixed = useMemo(
    () => `${new Array(5 - `${score}`.length).fill(0).join("")}${score}`,
    [score]
  );

  return (
    <div role="group" aria-label={labels.label} className={className(styles.game)}>
      <div
        className={className(styles.board)}
        role="group"
        aria-label={labels.label}
        aria-description={labels.instructions}
      >
        {cells.map(({ x, y }) => {
          const key = `${x}:${y}`;
          const isSnake = snakePositions.has(key);
          const isFood = food?.x === x && food?.y === y;

          return (
            <div
              key={key}
              aria-hidden="true"
              className={mergeClassNames(
                styles.cell,
                isSnake && styles.body,
                isFood && styles.food,
                isSnake && snakeClassName,
                isFood && foodClassName,
                isSnake && crashing && styles.crash
              )}
            />
          );
        })}
      </div>
      <div className={className(styles.footer)}>
        <button
          disabled={crashing}
          onClick={isDemo ? startGame : togglePause}
          aria-label={actionLabel}
          aria-keyshortcuts={isDemo ? "s" : "p"}
          title={labels.instructions}
          className={className(styles.button)}
        >
          <kbd aria-hidden="true">{isDemo ? "S" : "P"}</kbd>
          <span>{actionLabel}</span>
        </button>
        <span>
          {labels.score}{" "}
          <span className={className(styles.score)}>{scoreZeroPrefixed}</span>
        </span>
      </div>
    </div>
  );
}
