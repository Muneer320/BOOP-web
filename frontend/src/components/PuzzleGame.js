import React, { useState, useCallback, useRef, useEffect } from "react";
import { apiService } from "../services/api";
import "./PuzzleGame.css";

const DIRECTIONS = [
  [0, 1], [1, 0], [1, 1], [1, -1],
  [0, -1], [-1, 0], [-1, -1], [-1, 1]
];

const COLORS = [
  "#4a6fa5", "#e67e22", "#27ae60", "#e74c3c",
  "#9b59b6", "#1abc9c", "#f39c12", "#2ecc71",
  "#3498db", "#e91e63"
];

const PuzzleGame = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [words, setWords] = useState("");
  const [gridSize, setGridSize] = useState(15);
  const [foundWords, setFoundWords] = useState({});
  const [highlightCells, setHighlightCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [dragCells, setDragCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const gridRef = useRef(null);

  const generatePuzzle = useCallback(async () => {
    const wordList = words.split(/[,\n\r]+/).map(w => w.trim().toUpperCase()).filter(w => w.length >= 2);
    if (wordList.length < 3) {
      setError("Enter at least 3 words (comma or newline separated)");
      return;
    }
    setLoading(true);
    setError(null);
    setFoundWords({});
    setHighlightCells([]);
    setSelectedCells([]);
    setShowSuccess(false);
    try {
      const response = await apiService.playGenerate(wordList, gridSize);
      setPuzzle(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate puzzle. Try fewer or shorter words.");
    } finally {
      setLoading(false);
    }
  }, [words, gridSize]);

  const reset = useCallback(() => {
    setPuzzle(null);
    setFoundWords({});
    setHighlightCells([]);
    setSelectedCells([]);
    setShowSuccess(false);
    setError(null);
  }, []);

  const cellKey = (r, c) => `${r}-${c}`;
  const inFound = (r, c) => {
    for (const positions of Object.values(foundWords)) {
      for (const [fr, fc] of positions) {
        if (fr === r && fc === c) return true;
      }
    }
    return false;
  };

  const getWordColor = (word) => {
    const idx = Object.keys(foundWords).indexOf(word);
    return idx >= 0 ? COLORS[idx % COLORS.length] : null;
  };

  const cellsEqual = (a, b) => a[0] === b[0] && a[1] === b[1];

  const getDirection = (start, end) => {
    const dr = end[0] - start[0];
    const dc = end[1] - start[1];
    const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(dr, dc);
    return [dr / g, dc / g];
  };

  const attemptWord = useCallback((start, end) => {
    if (!puzzle) return;
    if (cellsEqual(start, end)) return;

    const dr = end[0] - start[0];
    const dc = end[1] - start[1];
    const dir = getDirection(start, end);

    if (!DIRECTIONS.some(d => d[0] === dir[0] && d[1] === dir[1])) return;

    const cells = [];
    let r = start[0], c = start[1];
    const maxSteps = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    for (let i = 0; i < maxSteps; i++) {
      if (r < 0 || r >= puzzle.grid_size || c < 0 || c >= puzzle.grid_size) break;
      cells.push([r, c]);
      if (cellsEqual([r, c], end)) break;
      r += dir[0];
      c += dir[1];
    }

    if (!cellsEqual(cells[cells.length - 1], end)) return;

    const word = cells.map(([r, c]) => puzzle.grid[r][c]).join("");

    const matchingWord = puzzle.words.find(w =>
      w === word && !foundWords.hasOwnProperty(w)
    );
    if (!matchingWord) {
      setHighlightCells(cells);
      setTimeout(() => setHighlightCells([]), 400);
      return;
    }

    setFoundWords(prev => ({
      ...prev,
      [matchingWord]: cells
    }));

    const newFound = { ...foundWords, [matchingWord]: cells };
    if (Object.keys(newFound).length === puzzle.words.length) {
      setTimeout(() => setShowSuccess(true), 300);
    }
  }, [puzzle, foundWords]);

  const handleCellClick = useCallback((r, c) => {
    if (!puzzle || foundWords.hasOwnProperty(
      Object.keys(foundWords).find(k =>
        foundWords[k].some(([fr, fc]) => fr === r && fc === c)
      )
    )) return;

    setSelectedCells(prev => {
      if (prev.length === 0) return [[r, c]];
      if (prev.length === 1) {
        if (prev[0][0] === r && prev[0][1] === c) return [];
        attemptWord(prev[0], [r, c]);
        return [];
      }
      return [[r, c]];
    });
  }, [puzzle, foundWords, attemptWord]);

  const handleMouseDown = useCallback((r, c) => {
    if (!puzzle || inFound(r, c)) return;
    setIsDragging(true);
    setSelectedCells([[r, c]]);
    setDragCells([[r, c]]);
  }, [puzzle, inFound]);

  const handleMouseMove = useCallback((r, c) => {
    if (!isDragging || !puzzle) return;
    const start = selectedCells[0];
    if (cellsEqual(start, [r, c])) return;
    const dr = r - start[0];
    const dc = c - start[1];
    const dir = getDirection(start, [r, c]);
    if (!DIRECTIONS.some(d => d[0] === dir[0] && d[1] === dir[1])) return;

    const newCells = [];
    let cr = start[0], cc = start[1];
    const maxSteps = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    for (let i = 0; i < maxSteps; i++) {
      if (cr < 0 || cr >= puzzle.grid_size || cc < 0 || cc >= puzzle.grid_size) break;
      newCells.push([cr, cc]);
      if (cellsEqual([cr, cc], [r, c])) break;
      cr += dir[0];
      cc += dir[1];
    }
    setDragCells(newCells);
  }, [isDragging, selectedCells, puzzle]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !puzzle) return;
    setIsDragging(false);
    if (dragCells.length > 1) {
      attemptWord(selectedCells[0], dragCells[dragCells.length - 1]);
    }
    setSelectedCells([]);
    setDragCells([]);
  }, [isDragging, dragCells, selectedCells, attemptWord, puzzle]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, handleMouseUp]);

  const isSelected = (r, c) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c) ||
    dragCells.some(([dr, dc]) => dr === r && dc === c);
  const isHighlighted = (r, c) =>
    highlightCells.some(([hr, hc]) => hr === r && hc === c);

  if (puzzle && showSuccess) {
    return (
      <div className="puzzle-game">
        <div className="puzzle-success">
          <h2>You found all words!</h2>
          <button className="btn btn-primary" onClick={reset}>Play Again</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="puzzle-game">
        <div className="card p-3">
          <h2>Generating puzzle...</h2>
          <div className="game-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-game">
      <div className="card p-3">
        {!puzzle ? (
          <>
            <h2>Play Word Search</h2>
            <p className="text-secondary">Enter words to create an interactive puzzle you can solve in your browser.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label htmlFor="play-words">Words (comma or newline separated)</label>
              <textarea
                id="play-words"
                className="form-control"
                rows="5"
                value={words}
                onChange={e => setWords(e.target.value)}
                placeholder="Enter at least 3 words, e.g.&#10;APPLE,BANANA,ORANGE"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="play-grid-size">Grid Size</label>
                <select
                  id="play-grid-size"
                  className="form-control"
                  value={gridSize}
                  onChange={e => setGridSize(Number(e.target.value))}
                >
                  <option value={10}>10 x 10</option>
                  <option value={12}>12 x 12</option>
                  <option value={15}>15 x 15</option>
                  <option value={18}>18 x 18</option>
                  <option value={20}>20 x 20</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" onClick={generatePuzzle}>
              Generate Puzzle
            </button>
          </>
        ) : (
          <>
            <div className="game-header">
              <h2>Word Search</h2>
              <div className="game-progress">
                {Object.keys(foundWords).length} / {puzzle.words.length} found
              </div>
            </div>

            <div className="game-layout">
              <div className="game-grid-wrapper">
                <div
                  className="game-grid"
                  ref={gridRef}
                  onMouseLeave={handleMouseUp}
                  style={{
                    gridTemplateColumns: `repeat(${puzzle.grid_size}, minmax(28px, 1fr))`
                  }}
                >
                  {puzzle.grid.map((row, ri) =>
                    row.map((cell, ci) => {
                      const found = inFound(ri, ci);
                      const sel = isSelected(ri, ci);
                      const hl = isHighlighted(ri, ci);
                      const color = found ? getWordColor(
                        Object.keys(foundWords).find(k =>
                          foundWords[k].some(([fr, fc]) => fr === ri && fc === ci)
                        )
                      ) : null;
                      return (
                        <div
                          key={cellKey(ri, ci)}
                          className={`game-cell${found ? " found" : ""}${sel ? " selecting" : ""}${hl ? " highlight" : ""}`}
                          style={{
                            ...(color ? { backgroundColor: color, color: "#fff" } : {}),
                            ...(sel && !found ? { backgroundColor: "var(--primary)", color: "#fff" } : {})
                          }}
                          onMouseDown={() => handleMouseDown(ri, ci)}
                          onMouseMove={() => handleMouseMove(ri, ci)}
                          onMouseUp={handleMouseUp}
                          onClick={() => handleCellClick(ri, ci)}
                        >
                          {cell}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="game-words-panel">
                <h3>Words to Find</h3>
                <div className="word-list">
                  {puzzle.words.map(word => (
                    <div
                      key={word}
                      className={`word-item${foundWords[word] ? " found" : ""}`}
                      style={foundWords[word] ? { color: getWordColor(word), textDecoration: "line-through" } : {}}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="game-actions">
              <button className="btn btn-secondary" onClick={reset}>New Puzzle</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame;
