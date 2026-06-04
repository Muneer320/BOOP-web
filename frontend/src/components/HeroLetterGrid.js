import React, { useEffect, useRef } from "react";

const COLS = 36;
const ROWS = 14;

const HeroLetterGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

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
          const flicker = Math.sin(time * cell.speed + cell.phase) * 0.035 + 0.04;
          ctx.fillStyle = `rgba(44, 24, 16, ${flicker})`;
          ctx.font = `${Math.min(cellW, cellH) * 0.65}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell.char, ci * cellW + cellW / 2, ri * cellH + cellH / 2);
        });
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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
