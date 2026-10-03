import { useCallback, useEffect, useRef, useState } from "react";

export const GRID_SIZE = 14;
const DEFAULT_SPEED = 5.5;

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export function useSnakeGame(speed = DEFAULT_SPEED) {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState("demo");
  const [paused, setPaused] = useState(false);
  const [crashing, setCrashing] = useState(false);

  const snakeRef = useRef([]);
  const foodRef = useRef(null);
  const scoreRef = useRef(0);
  const modeRef = useRef("demo");
  const pausedRef = useRef(false);
  const crashingRef = useRef(false);

  const directionRef = useRef(DIRECTIONS.right);
  const nextDirectionRef = useRef(DIRECTIONS.right);

  const same = (a, b) => a.x === b.x && a.y === b.y;

  const updateSnake = (value) => {
    snakeRef.current = value;
    setSnake(value);
  };

  const updateFood = (value) => {
    foodRef.current = value;
    setFood(value);
  };

  const updateScore = (value) => {
    scoreRef.current = value;
    setScore(value);
  };

  const updateMode = (value) => {
    modeRef.current = value;
    setMode(value);
  };

  const updatePaused = (value) => {
    pausedRef.current = value;
    setPaused(value);
  };

  const updateCrashing = (value) => {
    crashingRef.current = value;
    setCrashing(value);
  };

  const createSnake = () => {
    const x = Math.floor(GRID_SIZE / 2);
    const y = Math.floor(GRID_SIZE / 2);

    return [
      { x, y },
      { x: x - 1, y },
      { x: x - 2, y }
    ];
  };

  const spawnFood = useCallback((currentSnake) => {
    const occupied = new Set(currentSnake.map(({ x, y }) => `${x}:${y}`));

    const free = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!occupied.has(`${x}:${y}`)) {
          free.push({ x, y });
        }
      }
    }

    return free[Math.floor(Math.random() * free.length)] ?? null;
  }, []);

  const reset = useCallback(
    (newMode) => {
      const initialSnake = createSnake();

      directionRef.current = DIRECTIONS.right;
      nextDirectionRef.current = DIRECTIONS.right;

      updateSnake(initialSnake);
      updateFood(spawnFood(initialSnake));
      updateScore(0);
      updatePaused(false);
      updateCrashing(false);
      updateMode(newMode);
    },
    [spawnFood]
  );

  const validMove = useCallback((direction) => {
    const currentSnake = snakeRef.current;
    const head = currentSnake[0];

    const next = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };

    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      return false;
    }

    return !currentSnake.slice(0, -1).some((part) => same(part, next));
  }, []);

  const chooseDemoDirection = useCallback(() => {
    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;

    if (!currentFood) {
      return directionRef.current;
    }

    const head = currentSnake[0];
    const currentDirection = directionRef.current;

    const options = Object.values(DIRECTIONS).filter((direction) => {
      const reverse =
        direction.x === -currentDirection.x && direction.y === -currentDirection.y;

      return !reverse && validMove(direction);
    });

    if (!options.length) {
      return currentDirection;
    }

    options.sort((a, b) => {
      const distanceA =
        Math.abs(head.x + a.x - currentFood.x) + Math.abs(head.y + a.y - currentFood.y);

      const distanceB =
        Math.abs(head.x + b.x - currentFood.x) + Math.abs(head.y + b.y - currentFood.y);

      return distanceA - distanceB;
    });

    return options[0];
  }, [validMove]);

  const crash = useCallback(() => {
    updateMode("crashed");
    updatePaused(true);
    updateCrashing(true);
  }, []);

  const step = useCallback(() => {
    if (!snakeRef.current.length || pausedRef.current || crashingRef.current) {
      return;
    }

    if (modeRef.current === "demo") {
      nextDirectionRef.current = chooseDemoDirection();
    }

    directionRef.current = nextDirectionRef.current;

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];

    const nextHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y
    };

    const hitsBorder =
      nextHead.x < 0 ||
      nextHead.x >= GRID_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_SIZE;

    const hitsSelf = currentSnake.slice(0, -1).some((part) => same(part, nextHead));

    if (hitsBorder || hitsSelf) {
      if (modeRef.current === "demo") {
        reset("demo");
      } else {
        crash();
      }

      return;
    }

    const nextSnake = [nextHead, ...currentSnake];

    if (foodRef.current && same(nextHead, foodRef.current)) {
      const nextScore = scoreRef.current + 1;

      updateSnake(nextSnake);
      updateScore(nextScore);
      const nextFood = spawnFood(nextSnake);
      updateFood(nextFood);
      if (!nextFood) {
        if (modeRef.current === "demo") reset("demo");
        else crash();
      }
    } else {
      nextSnake.pop();
      updateSnake(nextSnake);
    }
  }, [chooseDemoDirection, crash, reset, spawnFood]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => reset("demo"), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reset]);

  useEffect(() => {
    if (!Number.isFinite(speed) || speed <= 0) return undefined;

    const interval = setInterval(step, 1000 / speed);

    return () => clearInterval(interval);
  }, [step, speed]);

  const changeDirection = useCallback((name) => {
    if (modeRef.current !== "player" || pausedRef.current || crashingRef.current) {
      return;
    }

    const next = DIRECTIONS[name];

    if (!next) return;

    const current = directionRef.current;

    const reverse = next.x === -current.x && next.y === -current.y;

    if (!reverse) {
      nextDirectionRef.current = next;
    }
  }, []);

  const startGame = useCallback(() => {
    reset("player");
  }, [reset]);

  const togglePause = useCallback(() => {
    if (modeRef.current !== "player" || crashingRef.current) {
      return;
    }

    updatePaused(!pausedRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.target?.closest?.(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"]'
        )
      ) {
        return;
      }

      const rawKey = event.key;
      const key = rawKey.toLowerCase();

      if (modeRef.current === "demo") {
        if (key === "s") {
          event.preventDefault();
          startGame();
        }

        return;
      }

      if (modeRef.current !== "player" || crashingRef.current) {
        return;
      }

      if (key === "p" && !event.repeat) {
        event.preventDefault();
        togglePause();
        return;
      }

      if (pausedRef.current) {
        return;
      }

      const movement = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",

        w: "up",
        a: "left",
        s: "down",
        d: "right"
      };

      const direction = movement[rawKey] ?? movement[key];

      if (!direction) return;

      event.preventDefault();

      changeDirection(direction);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, startGame, togglePause]);

  useEffect(() => {
    if (!crashing) return undefined;

    const timeoutId = window.setTimeout(() => reset("demo"), 1260);
    return () => window.clearTimeout(timeoutId);
  }, [crashing, reset]);

  return { snake, food, score, mode, paused, crashing, startGame, togglePause };
}
