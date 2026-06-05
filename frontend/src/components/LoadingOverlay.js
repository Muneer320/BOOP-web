import React from "react";
import { useGeneration } from "../context/GenerationContext";
import "./LoadingOverlay.css";

const PROGRESS_STEPS = [
  { step: "parsing", label: "Setting the press..." },
  { step: "cover", label: "Printing cover..." },
  { step: "toc", label: "Building table of contents..." },
  { step: "puzzles", label: "Filling puzzle pages..." },
  { step: "render_puzzles", label: "Arranging puzzles..." },
  { step: "render_solutions", label: "Preparing solutions..." },
  { step: "merge_pdfs", label: "Binding the book..." },
  { step: "finalizing", label: "Finalizing your book..." },
];

const PROGRESS_ORDER = ["parsing","cover","toc","puzzles","render_puzzles","render_solutions","merge_pdfs","finalizing"];

const LoadingOverlay = () => {
  const { isGenerating, progress, generationError } = useGeneration();

  if (!isGenerating && !generationError) return null;

  const currentStep = progress?.step || "starting";
  const currentIdx = PROGRESS_ORDER.indexOf(currentStep);
  const progressPct = currentIdx >= 0 ? ((currentIdx + 1) / PROGRESS_ORDER.length) * 100 : 10;

  return (
    <div className="loading-overlay" role="alert" aria-live="polite" aria-busy={isGenerating}>
      <div className="loading-box">
        {/* Book assembly visual */}
        <div className="loading-book" aria-hidden="true">
          <div className="lb-spine" />
          <div className="lb-cover">
            <div className="lb-cover-text">BOOP</div>
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="lb-page"
              style={{
                opacity: currentIdx >= i ? 1 : 0,
                transform: `translateX(${i * 2}px)`,
                zIndex: 10 - i,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="loading-progress-bar">
          <div
            className="loading-progress-fill"
            style={{ width: `${Math.min(progressPct, 95)}%` }}
          />
        </div>

        {/* Step label */}
        <p className="loading-step-label">
          {progress?.detail || PROGRESS_STEPS.find((s) => s.step === currentStep)?.label || "Preparing..."}
        </p>

        {generationError && (
          <p className="loading-error">Error: {generationError}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
