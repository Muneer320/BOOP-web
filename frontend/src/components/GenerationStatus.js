import React, { useState, useEffect } from "react";
import { useGeneration } from "../context/GenerationContext";
import "./GenerationStatus.css";

const GenerationStatus = () => {
  const { isGenerating, generatedFile, generatedFileName, generationStarted, generationError, resetGeneration } = useGeneration();
  const [durationText, setDurationText] = useState("");

  useEffect(() => {
    if (!generationStarted) return;
    const timer = setInterval(() => {
      const duration = Math.floor((new Date() - new Date(generationStarted)) / 1000);
      setDurationText(duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [generationStarted]);

  const handleDownload = () => {
    if (!generatedFile) return;
    const url = window.URL.createObjectURL(new Blob([generatedFile]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", generatedFileName);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  if (!isGenerating && !generatedFile && !generationError) return null;

  return (
    <div className="generation-status-container">
      {isGenerating ? (
        <div className="generation-status generating">
          <div className="status-icon">
            <div className="mini-grid">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="mini-cell">
                  {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                </div>
              ))}
            </div>
          </div>
          <div className="status-info">
            <p className="status-title">Generating…</p>
            <p className="status-subtitle">{durationText || "Starting…"}</p>
          </div>
        </div>
      ) : generationError ? (
        <div className="generation-status error">
          <div className="status-icon err">&#10007;</div>
          <div className="status-info">
            <p className="status-title">Generation Failed</p>
            <p className="status-subtitle">{generationError}</p>
          </div>
          <button className="close-status-btn" onClick={resetGeneration}>&times;</button>
        </div>
      ) : generatedFile ? (
        <div className="generation-status complete">
          <div className="status-icon success">&#10003;</div>
          <div className="status-info">
            <p className="status-title">Book Ready!</p>
          </div>
          <button className="download-again-btn" onClick={handleDownload}>Download</button>
          <button className="close-status-btn" onClick={resetGeneration}>&times;</button>
        </div>
      ) : null}
    </div>
  );
};

export default GenerationStatus;
