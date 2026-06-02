import React from "react";
import "./PuzzlePreview.css";

const GRID_SIZE = 8;

const PuzzlePreview = ({ formData }) => {
  const totalNormal = (formData.normal || 0) + (formData.bonus_normal || 0);
  const totalHard = (formData.hard || 0) + (formData.bonus_hard || 0);
  const totalPuzzles = totalNormal + totalHard;

  if (totalPuzzles === 0) {
    return (
      <div className="puzzle-preview-card">
        <div className="preview-empty">
          <p>Add at least one puzzle to see a preview</p>
        </div>
      </div>
    );
  }

  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );

  return (
    <div className="puzzle-preview-card">
      <div className="preview-header">
        <h3 className="preview-title">{formData.name || "My Word Search"}</h3>
        <span className="preview-badge">{totalPuzzles} puzzle{totalPuzzles > 1 ? "s" : ""}</span>
      </div>

      <svg viewBox={`0 0 ${GRID_SIZE * 30 + 40} ${GRID_SIZE * 30 + 80}`} className="preview-svg">
        {grid.map((row, ri) =>
          row.map((cell, ci) => (
            <rect
              key={`${ri}-${ci}`}
              x={ci * 30 + 20}
              y={ri * 30 + 50}
              width={26}
              height={26}
              fill={ri % 2 === ci % 2 ? "#f0f4ff" : "#ffffff"}
              stroke="#cbd5e1"
              strokeWidth="1"
              rx="2"
            />
          ))
        )}
        {grid.map((row, ri) =>
          row.map((cell, ci) => (
            <text
              key={`t${ri}-${ci}`}
              x={ci * 30 + 33}
              y={ri * 30 + 68}
              textAnchor="middle"
              fontSize="14"
              fill="#334155"
              fontFamily="monospace"
            >
              {cell}
            </text>
          ))
        )}
      </svg>

      <div className="preview-stats">
        <div className="preview-stat">
          <span className="stat-value">{totalNormal}</span>
          <span className="stat-label">Normal</span>
        </div>
        <div className="preview-stat">
          <span className="stat-value">{totalHard}</span>
          <span className="stat-label">Hard</span>
        </div>
        <div className="preview-stat">
          <span className="stat-value">{GRID_SIZE}x{GRID_SIZE}</span>
          <span className="stat-label">Grid</span>
        </div>
      </div>
    </div>
  );
};

export default PuzzlePreview;
