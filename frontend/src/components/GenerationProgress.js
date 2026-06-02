import React, { useState, useEffect } from "react";
import "./GenerationProgress.css";

const STEPS = [
  { key: "parsing", label: "Parsing words…" },
  { key: "normal", label: "Building normal puzzles…" },
  { key: "hard", label: "Building hard puzzles…" },
  { key: "bonus", label: "Building bonus puzzles…" },
  { key: "transitions", label: "Creating transition pages…" },
  { key: "solutions", label: "Generating solution keys…" },
  { key: "assembling", label: "Assembling PDF…" },
  { key: "finalizing", label: "Finalizing…" },
];

const GenerationProgress = ({ formData, isComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { normal = 0, hard = 0, bonus_normal = 0, bonus_hard = 0 } = formData;

  useEffect(() => {
    if (isComplete) {
      setCurrentStep(STEPS.length);
      return;
    }

    const totalPuzzles = normal + hard + bonus_normal + bonus_hard;
    const stepDuration = Math.max(600, Math.min(2000, 12000 / Math.max(totalPuzzles, 1)));

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) return STEPS.length - 1;
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [normal, hard, bonus_normal, bonus_hard, isComplete]);

  if (isComplete) {
    return (
      <div className="gen-progress complete">
        <div className="gen-progress-header">Generation Complete</div>
        {STEPS.map((step) => (
          <div key={step.key} className="gen-step done">
            <span className="gen-step-icon">&#10003;</span>
            <span className="gen-step-label">{step.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="gen-progress">
      <div className="gen-progress-header">Generating Your Puzzle Book</div>
      <div className="gen-progress-bar">
        <div
          className="gen-progress-fill"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      {STEPS.map((step, i) => (
        <div
          key={step.key}
          className={`gen-step ${i < currentStep ? "done" : ""} ${i === currentStep ? "active" : ""} ${i > currentStep ? "pending" : ""}`}
        >
          <span className="gen-step-icon">
            {i < currentStep ? "\u2713" : i === currentStep ? "\u25B6" : "\u25CB"}
          </span>
          <span className="gen-step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GenerationProgress;
