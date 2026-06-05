import React, { useEffect, useRef } from "react";

const COLS = 36;
const ROWS = 14;

const getInkColor = () => {
  if (typeof document === "undefined") return "44, 24, 16";
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  return isDark ? "226, 216, 200" : "44, 24, 16";
};

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const HeroLetterGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let rgb = getInkColor();
    const reduced = prefersReducedMotion();

    const observer = new MutationObserver(() => {
      rgb = getInkColor();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        char: letters[Math.floor(Math.random() * 26)],
        opacity: Math.random() * 0.06 + 0.015,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      }))
    );

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cellW = canvas.width / COLS;
      const cellH = canvas.height / ROWS;

      grid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          const flicker = reduced ? 0.025 : (Math.sin(time * cell.speed + cell.phase) * 0.02 + 0.025);
          ctx.fillStyle = `rgba(${rgb}, ${flicker})`;
          ctx.font = `${Math.min(cellW, cellH) * 0.65}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell.char, ci * cellW + cellW / 2, ri * cellH + cellH / 2);
        });
      });

      if (!reduced) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-letter-grid"
      aria-hidden="true"
    />
  );
};

export default HeroLetterGrid;
