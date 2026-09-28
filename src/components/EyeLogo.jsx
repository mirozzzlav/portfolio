import { useEffect, useState } from "react";

function getAutoPosition(progress) {
  const radius = 5;
  const t = (Math.sin(progress) + 1) / 2;
  const angle = Math.PI - t * Math.PI;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}

function useEyePosition(motion) {
  const [pos, setPos] = useState({ x: 3.5, y: 3.5 });

  useEffect(() => {
    if (motion === "auto") {
      let animationFrameId;
      const startedAt = performance.now();

      const animate = (now) => {
        setPos(getAutoPosition((now - startedAt) / 900));
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }

    const onMouseMove = (e) => {
      const width = window.innerWidth;

      // 0 = úplne vľavo, 1 = úplne vpravo
      const t = Math.max(0, Math.min(1, e.clientX / width));

      // spodný polkruh: PI -> 0
      const angle = Math.PI - t * Math.PI;

      const radius = 5;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      setPos({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [motion]);

  return pos;
}

export default function EyeLogo({ motion = "pointer" }) {
  const { x, y } = useEyePosition(motion);

  const pupilStyle = {
    transform: `translate(${x}px, ${y}px)`,
    transition: motion === "auto" ? "transform 160ms linear" : "transform 80ms linear"
  };

  return (
    <svg viewBox="0 0 98 56">
      <path fill="#000" d="M28 0h42a28 28 0 0 1 0 56H28A28 28 0 0 1 28 0Z" />

      <circle cx="28" cy="28" r="14" fill="#fff" />
      <circle cx="70" cy="28" r="14" fill="#fff" />

      <circle cx="28" cy="28" r="4" style={pupilStyle} />
      <circle cx="70" cy="28" r="4" style={pupilStyle} />
    </svg>
  );
}
