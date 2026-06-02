import React, { useState, useEffect } from "react";
import { useGeneration } from "../context/GenerationContext";
import "./LoadingOverlay.css";

const GRID_SIZE = 4;
const genGrid = () =>
  Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );

const PROGRESS_STEPS = [
  { step: "parsing", label: "Parsing word lists" },
  { step: "cover", label: "Adding cover page" },
  { step: "toc", label: "Creating table of contents" },
  { step: "puzzles", label: "Generating puzzles" },
  { step: "render_puzzles", label: "Rendering puzzle pages" },
  { step: "render_solutions", label: "Rendering solution pages" },
  { step: "merge_pdfs", label: "Merging PDFs" },
  { step: "finalizing", label: "Finalizing PDF" },
];

const LoadingOverlay = () => {
  const { isGenerating, progress, generationError } = useGeneration();
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    if (!isGenerating) return;
    setGrid(genGrid());
    const interval = setInterval(() => setGrid(genGrid()), 3000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating && !generationError) return null;

  const currentStep = progress?.step || "starting";
  const stepLabel = progress?.detail || "";

  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="grid-spinner">
          {grid.map((letter, i) => {
            const delay = (Math.random() * 1).toFixed(2);
            const duration = (2 + Math.random() * 1).toFixed(2);
            return (
              <div key={i} className="grid-cell"
                style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}>
                {letter}
              </div>
            );
          })}
        </div>

        <div className="progress-steps">
          {PROGRESS_STEPS.map((ps, i) => {
            const order = ["parsing","cover","toc","puzzles","render_puzzles","render_solutions","merge_pdfs","finalizing"];
            const currentIdx = order.indexOf(currentStep);
            const stepIdx = order.indexOf(ps.step);
            let cls = "progress-step-item";
            if (stepIdx < currentIdx || (currentStep === "complete")) cls += " done";
            else if (stepIdx === currentIdx) cls += " active";
            return (
              <div key={ps.step} className={cls}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="progress-step-icon">
                  {stepIdx < currentIdx || currentStep === "complete" ? "\u2713" :
                   stepIdx === currentIdx ? "\u25B6" : "\u25CB"}
                </span>
                <span className="progress-step-label">{ps.label}</span>
                {stepIdx === currentIdx && stepLabel && (
                  <span className="progress-step-detail">{stepLabel}</span>
                )}
              </div>
            );
          })}
        </div>

        {generationError && (
          <p className="loading-error">Error: {generationError}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
