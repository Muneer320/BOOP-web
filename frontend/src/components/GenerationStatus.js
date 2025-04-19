import React, { useState, useEffect } from 'react';
import { useGeneration } from '../context/GenerationContext';
import './GenerationStatus.css';

const GenerationStatus = () => {
  const { isGenerating, generatedFile, generationStarted } = useGeneration();

  const [durationText, setDurationText] = useState('');

  useEffect(() => {
    if (!generationStarted) return;

    const timer = setInterval(() => {
      const duration = Math.floor(
        (new Date() - new Date(generationStarted)) / 1000
      );
      setDurationText(duration < 60 
        ? `${duration} seconds` 
        : `${Math.floor(duration / 60)} min ${duration % 60} sec`);
    }, 1000);

    return () => clearInterval(timer);
  }, [generationStarted]);

  if (!isGenerating && !generatedFile) return null;

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
            <p className="status-title">Generating Puzzle Book</p>
            <p className="status-subtitle">Started {durationText} ago</p>
          </div>
        </div>
      ) : generatedFile ? (
        <div className="generation-status complete">
          <div className="status-icon success">✓</div>
          <div className="status-info">
            <p className="status-title">Book Ready!</p>
            <button 
              className="download-again-btn"
              onClick={() => {
                const url = window.URL.createObjectURL(new Blob([generatedFile]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'puzzle-book.pdf');
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
              }}
            >
              Download Again
            </button>
          </div>
          <button 
            className="close-status-btn"
            onClick={() => window.location.reload()}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default GenerationStatus;
