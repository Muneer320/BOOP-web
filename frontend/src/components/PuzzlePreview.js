import React, { useMemo, useState, useRef } from "react";
import "./PuzzlePreview.css";

const GRID_SIZE = 8;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const genGrid = (seed = 0) => {
  const grids = [
    () => Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () =>
        LETTERS[Math.floor(Math.random() * 26)]
      )
    ),
    () => Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () =>
        LETTERS[Math.floor(Math.random() * 26)]
      )
    ),
    () => Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () =>
        LETTERS[Math.floor(Math.random() * 26)]
      )
    ),
  ];
  return grids[seed % grids.length]();
};

const PuzzlePreview = ({ formData, wordsPayload }) => {
  const [page, setPage] = useState(0);
  const totalNormal = (formData.normal || 0) + (formData.bonus_normal || 0);
  const totalHard = (formData.hard || 0) + (formData.bonus_hard || 0);
  const totalPuzzles = totalNormal + totalHard;
  const seedRef = useRef(Math.floor(Math.random() * 1000));

  const hasWords = wordsPayload
    ? Object.keys(wordsPayload).length > 0 && Object.values(wordsPayload).some(w => w.length > 0)
    : false;

  const sampleWords = useMemo(() => {
    if (!hasWords) return [];
    const all = Object.values(wordsPayload).flat();
    return all.slice(0, 8);
  }, [wordsPayload, hasWords]);

  const pages = useMemo(() => {
    const p = [];
    const seed = seedRef.current;
    p.push({
      type: "cover",
      title: formData.name || "My Puzzle Book",
    });
    const numSample = Math.min(totalPuzzles, 3);
    for (let i = 0; i < numSample; i++) {
      p.push({
        type: "puzzle",
        grid: genGrid(seed + i),
        pageNum: i + 1,
        words: sampleWords,
      });
    }
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name, totalPuzzles, sampleWords.length]);

  if (totalPuzzles === 0) {
    return (
      <div className="puzzle-preview-card preview-empty-state">
        <div className="preview-empty">
          <svg viewBox="0 0 120 120" fill="none" className="empty-illustration">
            <path d="M10 30 L60 20 L110 30 L110 100 L60 90 L10 100 Z"
              fill="var(--paper-light)" stroke="var(--border)" strokeWidth="1.5"/>
            <line x1="35" y1="40" x2="35" y2="80" stroke="var(--border-light)" strokeDasharray="3 3"/>
            <line x1="85" y1="40" x2="85" y2="80" stroke="var(--border-light)" strokeDasharray="3 3"/>
            <line x1="25" y1="55" x2="50" y2="50" stroke="var(--border-light)" strokeDasharray="2 2"/>
            <line x1="25" y1="65" x2="50" y2="60" stroke="var(--border-light)" strokeDasharray="2 2"/>
            <line x1="70" y1="50" x2="95" y2="55" stroke="var(--border-light)" strokeDasharray="2 2"/>
            <line x1="70" y1="60" x2="95" y2="65" stroke="var(--border-light)" strokeDasharray="2 2"/>
          </svg>
          <p>Add at least one puzzle to see a preview</p>
        </div>
      </div>
    );
  }

  const totalUniqueWords = wordsPayload
    ? [...new Set(Object.values(wordsPayload).flat())].length
    : 0;
  const topicCount = wordsPayload ? Object.keys(wordsPayload).length : 0;

  // Estimate page count:
  // 1 title page + ceil(topics/3) TOC pages + puzzles * 1 page each +
  // puzzles/6 solutions pages + 1 solutions title page
  const puzzleCount = totalNormal + totalHard;
  const tocPages = Math.max(1, Math.ceil(topicCount / 3));
  const solPages = Math.max(1, Math.ceil(puzzleCount / 6));
  const estPages = 1 + tocPages + puzzleCount + 1 + solPages;

  if (!hasWords) {
    return (
      <div className="puzzle-preview-card preview-empty-state">
        <div className="preview-empty">
          <svg viewBox="0 0 120 120" fill="none" className="empty-illustration">
            <rect x="20" y="30" width="80" height="60" rx="2" stroke="var(--border)" strokeWidth="1.5" fill="var(--paper-light)"/>
            <line x1="35" y1="45" x2="85" y2="45" stroke="var(--border-light)" strokeWidth="1.5"/>
            <line x1="35" y1="55" x2="85" y2="55" stroke="var(--border-light)" strokeWidth="1.5"/>
            <line x1="35" y1="65" x2="70" y2="65" stroke="var(--border-light)" strokeWidth="1.5"/>
            <circle cx="30" cy="75" r="3" fill="var(--ink-faded)"/>
          </svg>
          <p>Select words to see a puzzle preview</p>
        </div>
      </div>
    );
  }

  const currentPage = pages[page] || pages[0];

  return (
    <div className="puzzle-preview-card">
      <div className="preview-header">
        <h3 className="preview-title">Preview</h3>
        <span className="preview-badge">{totalPuzzles} puzzle{totalPuzzles > 1 ? "s" : ""}</span>
      </div>

      <div className="preview-book">
        {currentPage.type === "cover" ? (
          <div className="preview-cover">
            <div className="preview-cover-content">
              <span className="preview-cover-label">PUZZLE BOOK</span>
              <span className="preview-cover-title">{currentPage.title}</span>
              <span className="preview-cover-divider"></span>
              <span className="preview-cover-subtitle">Word Search</span>
            </div>
          </div>
        ) : (
          <div className="preview-page">
            <div className="preview-page-header">
              <span className="preview-page-num">#{currentPage.pageNum}</span>
              <span className="preview-page-label">Word Search</span>
            </div>
            <svg viewBox={`0 0 ${GRID_SIZE * 28 + 20} ${GRID_SIZE * 28 + 20}`} className="preview-svg">
              {currentPage.grid.map((row, ri) =>
                row.map((cell, ci) => (
                  <rect
                    key={`${ri}-${ci}`}
                    x={ci * 28 + 10}
                    y={ri * 28 + 10}
                    width={24}
                    height={24}
                    className={ri % 2 === ci % 2 ? "preview-cell-dark" : "preview-cell-light"}
                    strokeWidth="0.5"
                    rx="1"
                  />
                ))
              )}
              {currentPage.grid.map((row, ri) =>
                row.map((cell, ci) => (
                  <text
                    key={`t${ri}-${ci}`}
                    x={ci * 28 + 22}
                    y={ri * 28 + 27}
                    textAnchor="middle"
                    fontSize="11"
                    className="preview-cell-text"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {cell}
                  </text>
                ))
              )}
            </svg>
            {currentPage.words && currentPage.words.length > 0 && (
              <div className="preview-words-list">
                <span className="preview-words-label">Find:</span>
                {currentPage.words.slice(0, 4).join(", ")}
                {currentPage.words.length > 4 && ` +${currentPage.words.length - 4} more`}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="preview-nav">
        <button
          className="preview-nav-btn"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          &larr; Prev
        </button>
        <span className="preview-nav-text">
          {currentPage.type === "cover" ? "Cover" : `Page ${currentPage.pageNum}`}
          <span className="preview-nav-total"> / {pages.length}</span>
        </span>
        <button
          className="preview-nav-btn"
          onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
          disabled={page === pages.length - 1}
        >
          Next &rarr;
        </button>
      </div>

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
          <span className="stat-value">{topicCount}</span>
          <span className="stat-label">Topics</span>
        </div>
        <div className="preview-stat">
          <span className="stat-value">{totalUniqueWords}</span>
          <span className="stat-label">Words</span>
        </div>
        <div className="preview-stat">
          <span className="stat-value">{estPages}</span>
          <span className="stat-label">Est. Pages</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PuzzlePreview);
