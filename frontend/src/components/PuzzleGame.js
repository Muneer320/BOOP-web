import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { apiService } from "../services/api";
import { useGamePersistence } from "../hooks/useGamePersistence";
import useTimer from "../hooks/useTimer";
import "./PuzzleGame.css";

const MODES = [
  { id: "easy",      label: "Easy",     grid: 10, minW: 5,  maxW: 12, back: false, mask: null },
  { id: "normal",    label: "Normal",   grid: 13, minW: 8,  maxW: 20, back: true,  mask: null },
  { id: "hard",      label: "Hard",     grid: 15, minW: 10, maxW: 25, back: true,  mask: null },
  { id: "veryhard",  label: "Very Hard", grid: 18, minW: 12, maxW: 30, back: true,  mask: null },
  { id: "nightmare", label: "Nightmare", grid: 20, minW: 15, maxW: 35, back: true,  mask: null },
  { id: "bonus",     label: "Bonus",    grid: 15, minW: 8,  maxW: 20, back: true,  mask: "circle" },
];

const COLORS = ["#3a6b35","#8b3a3a","#b8860b","#4a6fa5","#6b4a8b","#c4956a","#2d6b5e","#8b5e3a","#4a7c5e","#7a5e3a"];

const DIRECTIONS = [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];

const PuzzleGame = () => {
  const { saveGame, loadGame, clearGame } = useGamePersistence();

  /* ---- Core State ---- */
  const [screen, setScreen] = useState("start"); // start | play | complete
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foundWords, setFoundWords] = useState({});
  const [selectedCells, setSelectedCells] = useState([]);
  const [dragCells, setDragCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightCells, setHighlightCells] = useState([]);
  const [paused, setPaused] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);

  /* ---- Config State (start screen + modify panel) ---- */
  const [modeId, setModeId] = useState("normal");
  const [wordSource, setWordSource] = useState("preset"); // preset | manual | file
  const [wordChips, setWordChips] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [topicExcludedWords, setTopicExcludedWords] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topicWordMap, setTopicWordMap] = useState({});
  const [manualInput, setManualInput] = useState("");

  const mode = MODES.find(m => m.id === modeId) || MODES[1];
  const gameId = useRef(`game_${Date.now()}`);
  const timer = useTimer(gameId.current);
  const gridRef = useRef(null);

  /* ---- Load topics on mount ---- */
  useEffect(() => {
    apiService.getTopics().then(r => {
      setTopics(r.data.topics || []);
    }).catch(() => {});
  }, []);

  const selectTopic = useCallback(async (topic) => {
    if (activeTopic === topic) {
      setActiveTopic(null);
      setTopicExcludedWords([]);
      return;
    }
    setActiveTopic(topic);
    setTopicExcludedWords([]);
    if (!topicWordMap[topic]) {
      setLoadingTopics(true);
      try {
        const r = await apiService.getTopicWords(topic);
        setTopicWordMap(prev => ({ ...prev, [topic]: r.data.words || [] }));
      } catch {
        setTopicWordMap(prev => ({ ...prev, [topic]: [] }));
      }
      setLoadingTopics(false);
    }
  }, [activeTopic, topicWordMap]);

  /* ---- Words of the active topic (minus excluded) ---- */
  const topicSelectedWords = useMemo(() => {
    if (!activeTopic || !topicWordMap[activeTopic]) return [];
    return topicWordMap[activeTopic].filter(w => !topicExcludedWords.includes(w));
  }, [activeTopic, topicWordMap, topicExcludedWords]);

  const toggleExcludeWord = useCallback((word) => {
    setTopicExcludedWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  }, []);

  /* ---- Compute final word list for the puzzle ---- */
  const computeWords = useCallback(() => {
    if (wordSource === "preset") return topicSelectedWords;
    if (wordSource === "manual") return wordChips;
    return [];
  }, [wordSource, topicSelectedWords, wordChips]);

  /* ---- Generate puzzle ---- */
  const generatePuzzle = useCallback(async (words, timerOn) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiService.playGenerate(words, modeId);
      const data = resp.data;
      data.words.sort();
      setPuzzle(data);
      setFoundWords({});
      setSelectedCells([]);
      setDragCells([]);
      setScreen("play");
      if (timerOn) timer.start();
      saveGame({ gameId: gameId.current, puzzle: data, mode: modeId, timerEnabled: timerOn, wordSource, wordChips });
    } catch (err) {
      setError(err.response?.data?.detail || "Could not generate puzzle. Try different words.");
    } finally {
      setLoading(false);
    }
  }, [modeId, saveGame, timer, wordSource, wordChips]);

  /* ---- Start game ---- */
  const handleStart = useCallback(async () => {
    let words = computeWords();
    if (words.length < mode.minW) {
      setError(`Need at least ${mode.minW} words. Selected ${words.length}. Try a different topic or add words.`);
      return;
    }
    if (words.length > mode.maxW) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      words = shuffled.slice(0, mode.maxW);
    }
    gameId.current = `game_${Date.now()}`;
    await generatePuzzle(words, timerEnabled);
  }, [computeWords, mode, generatePuzzle, timerEnabled]);

  /* ---- Restore game from localStorage ---- */
  useEffect(() => {
    const saved = loadGame();
    if (saved && saved.puzzle) {
      setPuzzle(saved.puzzle);
      setFoundWords(saved.foundWords || {});
      setModeId(saved.mode || "normal");
      setTimerEnabled(saved.timerEnabled !== false);
      gameId.current = saved.gameId || `game_${Date.now()}`;
      const restored = timer.restore();
      if (restored || saved.screen === "complete") {
        setScreen("play");
      }
    }
  // eslint-disable-next-line
  }, []);

  /* ---- Persist progress ---- */
  useEffect(() => {
    if (screen === "play" && puzzle) {
      saveGame({ gameId: gameId.current, puzzle, mode: modeId, foundWords, timerEnabled, screen, wordSource, wordChips, words: puzzle.words });
    }
  }, [screen, puzzle, foundWords, modeId, timerEnabled, saveGame, wordSource, wordChips]);

  /* ---- Cell helpers ---- */
  const inFound = useCallback((r, c) => {
    for (const positions of Object.values(foundWords)) {
      if (positions.some(([fr, fc]) => fr === r && fc === c)) return true;
    }
    return false;
  }, [foundWords]);

  const getWordColor = useCallback((word) => {
    const idx = Object.keys(foundWords).indexOf(word);
    return idx >= 0 ? COLORS[idx % COLORS.length] : null;
  }, [foundWords]);

  const getDirection = useCallback((start, end) => {
    const dr = end[0] - start[0];
    const dc = end[1] - start[1];
    const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(dr, dc);
    return [dr / g, dc / g];
  }, []);

  /* ---- Word selection ---- */
  const attemptWord = useCallback((start, end) => {
    if (!puzzle) return;
    if (start[0] === end[0] && start[1] === end[1]) return;

    const dir = getDirection(start, end);
    if (!DIRECTIONS.some(d => d[0] === dir[0] && d[1] === dir[1])) return;

    const cells = [];
    let r = start[0], c = start[1];
    const maxSteps = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1])) + 1;
    for (let i = 0; i < maxSteps; i++) {
      if (r < 0 || r >= puzzle.grid_size || c < 0 || c >= puzzle.grid_size) break;
      cells.push([r, c]);
      if (r === end[0] && c === end[1]) break;
      r += dir[0]; c += dir[1];
    }
    if (!cells.length || cells[cells.length-1][0] !== end[0] || cells[cells.length-1][1] !== end[1]) return;

    const word = cells.map(([rr, cc]) => puzzle.grid[rr][cc]).join("");
    const matched = puzzle.words.find(w => w === word && !foundWords.hasOwnProperty(w));
    if (!matched) {
      setHighlightCells(cells);
      setTimeout(() => setHighlightCells([]), 400);
      return;
    }
    const newFound = { ...foundWords, [matched]: cells };
    setFoundWords(newFound);
    if (Object.keys(newFound).length === puzzle.words.length) {
      timer.stop();
      setScreen("complete");
    }
  }, [puzzle, foundWords, getDirection, timer]);

  /* ---- Click/tap handling ---- */
  const handleCellClick = useCallback((r, c) => {
    if (!puzzle || paused || screen !== "play") return;
    setSelectedCells(prev => {
      if (prev.length === 0) return [[r, c]];
      if (prev[0][0] === r && prev[0][1] === c) return [];
      attemptWord(prev[0], [r, c]);
      return [];
    });
  }, [puzzle, paused, screen, attemptWord]);

  /* ---- Drag handling ---- */
  const handleMouseDown = useCallback((r, c) => {
    if (!puzzle || paused || screen !== "play" || inFound(r, c)) return;
    setIsDragging(true);
    setSelectedCells([[r, c]]);
    setDragCells([[r, c]]);
  }, [puzzle, paused, screen, inFound]);

  const handleMouseMove = useCallback((r, c) => {
    if (!isDragging || !puzzle || paused) return;
    const start = selectedCells[0];
    if (start[0] === r && start[1] === c) return;
    const dir = getDirection(start, [r, c]);
    if (!DIRECTIONS.some(d => d[0] === dir[0] && d[1] === dir[1])) return;
    const cells = [];
    let cr = start[0], cc = start[1];
    const maxSteps = Math.max(Math.abs(r - start[0]), Math.abs(c - start[1])) + 1;
    for (let i = 0; i < maxSteps; i++) {
      if (cr < 0 || cr >= puzzle.grid_size || cc < 0 || cc >= puzzle.grid_size) break;
      cells.push([cr, cc]);
      if (cr === r && cc === c) break;
      cr += dir[0]; cc += dir[1];
    }
    setDragCells(cells);
  }, [isDragging, selectedCells, puzzle, paused, getDirection]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragCells.length > 1) {
      attemptWord(selectedCells[0], dragCells[dragCells.length - 1]);
    }
    setSelectedCells([]);
    setDragCells([]);
  }, [isDragging, dragCells, selectedCells, attemptWord]);

  useEffect(() => {
    const handler = () => { if (isDragging) handleMouseUp(); };
    window.addEventListener("mouseup", handler);
    return () => window.removeEventListener("mouseup", handler);
  }, [isDragging, handleMouseUp]);

  const isSelected = (r, c) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c) ||
    dragCells.some(([dr, dc]) => dr === r && dc === c);
  const isHighlighted = (r, c) =>
    highlightCells.some(([hr, hc]) => hr === r && hc === c);

  /* ---- Manual word chips ---- */
  const handleManualInput = useCallback((e) => {
    const val = e.target.value;
    setManualInput(val);
    const parts = val.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
    if (parts.length > 1) {
      setWordChips(prev => {
        const combined = [...prev, ...parts.slice(0, -1)];
        const unique = [...new Set(combined)];
        return unique.slice(0, mode.maxW);
      });
      setManualInput(parts[parts.length - 1]);
    }
  }, [mode.maxW]);

  const removeChip = useCallback((word) => {
    setWordChips(prev => prev.filter(w => w !== word));
  }, []);

  const handleManualKeyDown = useCallback((e) => {
    if (e.key === "Enter" && manualInput.trim()) {
      const word = manualInput.trim().toUpperCase();
      if (word && !wordChips.includes(word) && wordChips.length < mode.maxW) {
        setWordChips(prev => [...prev, word]);
      }
      setManualInput("");
      e.preventDefault();
    }
    if (e.key === "Backspace" && !manualInput && wordChips.length > 0) {
      removeChip(wordChips[wordChips.length - 1]);
    }
  }, [manualInput, wordChips, mode.maxW, removeChip]);

  /* ---- Reset to new game ---- */
  const handleNewGame = useCallback(() => {
    if (screen === "complete") {
      setShowConfirmNew(true);
    } else {
      setShowConfirmQuit(true);
    }
  }, [screen]);

  const confirmNewGame = useCallback(() => {
    clearGame();
    setPuzzle(null);
    setFoundWords({});
    setScreen("start");
    setError(null);
    setShowConfirmNew(false);
    setShowConfirmQuit(false);
    timer.stop();
  }, [clearGame, timer]);

  /* ---- Copy share link ---- */
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.origin + "/play").catch(() => {});
  }, []);

  /* ---- Share ---- */
  const handleShare = useCallback((platform) => {
    const url = encodeURIComponent(window.location.origin + "/play");
    const text = encodeURIComponent("I just solved a word search puzzle on BOOP! Can you beat my time?");
    const hrefs = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (hrefs[platform]) window.open(hrefs[platform], "_blank", "noopener");
  }, []);

  /* ---- Pause ---- */
  const handlePause = useCallback(() => {
    timer.pause();
    setPaused(true);
  }, [timer]);

  const handleResume = useCallback(() => {
    timer.resume();
    setPaused(false);
  }, [timer]);

  /* ---- File upload ---- */
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const resp = await apiService.uploadFile(file);
      const text = await apiService.getFile(resp.data.file_id).then(r => r.data.text());
      const lines = text.split(/[\n\r,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length >= 2);
      setWordChips(prev => { const combined = [...new Set([...prev, ...lines])]; return combined.slice(0, mode.maxW); });
    } catch { setError("Failed to parse uploaded file."); }
  }, [mode.maxW]);

  /* ---- Topic card helper ---- */
  const renderTopicCard = useCallback((topic) => {
    const words = topicWordMap[topic] || [];
    const isActive = activeTopic === topic;
    const wordCount = words.length;
    const selectedCount = words.filter(w => !topicExcludedWords.includes(w)).length;
    return (
      <div key={topic} className={`pg-topic-card${isActive ? " expanded active" : ""}${isActive && wordCount > 0 && selectedCount === wordCount ? " all-selected" : ""}`}>
        <div className="pg-topic-header" onClick={() => selectTopic(topic)}>
          <span className="pg-topic-name">{topic}</span>
          <span className="pg-topic-meta">
            {wordCount > 0 && `${isActive ? selectedCount + '/' : ''}${wordCount}`} words
          </span>
          <span className="pg-topic-arrow">{isActive ? "\u25BC" : "\u25B6"}</span>
        </div>
        {isActive && wordCount > 0 && (
          <div className="pg-topic-words">
            {words.map(w => {
              const excluded = topicExcludedWords.includes(w);
              return (
                <span key={w}
                  className={`pg-word-tag${excluded ? " removed" : " added"}`}
                  onClick={() => toggleExcludeWord(w)}>
                  {w}
                  <span className="pg-tag-action">{excluded ? "+" : "\u2713"}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }, [topicWordMap, activeTopic, topicExcludedWords, selectTopic, toggleExcludeWord]);

  /* ======== RENDER: START SCREEN ======== */
  const renderStart = () => (
    <div className="pg-start">
      <div className="pg-start-card">
        <h2 className="pg-start-title">Play Word Search</h2>
        <p className="pg-start-sub">Choose your mode, pick words, and start solving.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="pg-modes">
          {MODES.map(m => (
            <button key={m.id} className={`pg-mode-btn${modeId === m.id ? " active" : ""}`}
              onClick={() => { setModeId(m.id); setError(null); }}>
              <span className="pg-mode-label">{m.label}</span>
              <span className="pg-mode-size">{m.grid}×{m.grid}</span>
            </button>
          ))}
        </div>

        <div className="pg-word-source">
          <div className="pg-source-tabs">
            {[
              { id: "preset", label: "Themes" },
              { id: "manual", label: "Type Words" },
              { id: "file", label: "Upload" },
            ].map(tab => (
              <button key={tab.id}
                className={`pg-source-tab${wordSource === tab.id ? " active" : ""}`}
                onClick={() => setWordSource(tab.id)}>{tab.label}</button>
            ))}
          </div>

          {wordSource === "preset" && (
            <div className="pg-preset-panel">
              {loadingTopics && <p className="pg-loading-hint">Loading words…</p>}
              {topics.length === 0 ? <p>No topics available.</p> : topics.map(topic =>
                renderTopicCard(topic)
              )}
              {activeTopic && (
                <p className="pg-word-count-total">
                  {topicSelectedWords.length} word{topicSelectedWords.length !== 1 ? "s" : ""} selected
                  {topicSelectedWords.length > mode.maxW ? ` (will pick ${mode.maxW} at random)` : ` (min ${mode.minW}, max ${mode.maxW})`}
                </p>
              )}
            </div>
          )}

          {wordSource === "manual" && (
            <div className="pg-manual-panel">
              <div className="form-group">
                <label>Type words (comma or Enter to add)</label>
                <input className="form-control" value={manualInput} onChange={handleManualInput}
                  onKeyDown={handleManualKeyDown} placeholder="e.g. APPLE,BANANA,ORANGE" />
              </div>
              <div className="pg-chips">
                {wordChips.map(w => (
                  <span key={w} className="pg-chip" onClick={() => removeChip(w)}>
                    {w} <span className="pg-chip-remove">&times;</span>
                  </span>
                ))}
              </div>
              {wordChips.length > 0 && (
                <p className="pg-word-count">{wordChips.length} words (min {mode.minW}, max {mode.maxW})</p>
              )}
            </div>
          )}

          {wordSource === "file" && (
            <div className="pg-file-panel">
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                Choose .txt File
                <input type="file" accept=".txt" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
              {wordChips.length > 0 && (
                <div className="pg-chips">
                  {wordChips.map(w => (
                    <span key={w} className="pg-chip" onClick={() => removeChip(w)}>
                      {w} <span className="pg-chip-remove">&times;</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pg-timer-option">
          <label className="pg-toggle">
            <input type="checkbox" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} />
            <span>Show timer</span>
          </label>
        </div>

        <button className="btn btn-primary btn-lg pg-start-btn" onClick={handleStart} disabled={loading}>
          {loading ? "Generating…" : "Start Game"}
        </button>
      </div>
    </div>
  );

  /* ======== RENDER: PLAY SCREEN ======== */
  const renderPlay = () => {
    if (!puzzle) return null;
    const foundCount = Object.keys(foundWords).length;
    const total = puzzle.words.length;
    return (
      <>
        {paused && (
          <div className="pg-pause-overlay" onClick={handleResume}>
            <div className="pg-pause-box" onClick={e => e.stopPropagation()}>
              <h2>Paused</h2>
              <p>Timer: {timer.formatTime}</p>
              <button className="btn btn-primary btn-lg" onClick={handleResume}>Resume</button>
            </div>
          </div>
        )}
        <div className={`pg-play${paused ? " blurred" : ""}`}>
          <div className="pg-play-header">
            <div className="pg-play-info">
              <span className="pg-mode-label-small">{mode.label}</span>
              {timerEnabled && <span className="pg-timer">{timer.formatTime}</span>}
              <span className="pg-found-count">{foundCount}/{total}</span>
            </div>
            <div className="pg-play-actions">
              {timerEnabled && !paused && <button className="btn btn-outline btn-sm" onClick={handlePause}>Pause</button>}
              <button className="btn btn-outline btn-sm" onClick={handleNewGame}>New</button>
            </div>
          </div>

          <div className="pg-layout">
            <div className="pg-grid-wrap">
              <div className="pg-grid" ref={gridRef}
                onMouseLeave={handleMouseUp}
                style={{ gridTemplateColumns: `repeat(${puzzle.grid_size}, 1fr)` }}>
                {puzzle.grid.map((row, ri) => row.map((cell, ci) => {
                  const isCircle = puzzle.mask === "circle";
                  const center = (puzzle.grid_size - 1) / 2;
                  const inCircle = !isCircle || Math.hypot(ri - center, ci - center) <= center;
                  const isEmpty = !cell || cell === " " || cell === "";
                  if (isCircle && !inCircle && isEmpty) return <div key={`${ri}-${ci}`} className="pg-cell pg-cell-hidden" />;
                  const found = inFound(ri, ci);
                  const sel = isSelected(ri, ci);
                  const hl = isHighlighted(ri, ci);
                  const color = found ? getWordColor(Object.keys(foundWords).find(k => foundWords[k].some(([fr, fc]) => fr === ri && fc === ci))) : null;
                  return (
                    <div key={`${ri}-${ci}`}
                      className={`pg-cell${found ? " found" : ""}${sel ? " selecting" : ""}${hl ? " hilite" : ""}`}
                      style={color ? { background: color, color: "#fff" } : sel ? { background: "var(--primary)", color: "#fff" } : {}}
                      onMouseDown={() => handleMouseDown(ri, ci)}
                      onMouseMove={() => handleMouseMove(ri, ci)}
                      onMouseUp={handleMouseUp}
                      onClick={() => handleCellClick(ri, ci)}>
                      <span className="pg-cell-letter" data-char={cell} aria-hidden="true" />
                    </div>
                  );
                }))}
              </div>
            </div>

            <div className="pg-words-panel">
              <h3>Find These Words</h3>
              <div className="pg-words-list">
                {puzzle.words.map(word => (
                  <div key={word} className={`pg-word${foundWords[word] ? " found" : ""}`}
                    style={foundWords[word] ? { color: getWordColor(word) } : {}}>
                    <span className="pg-word-bullet">{foundWords[word] ? "\u2713" : "\u25CB"}</span>
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  /* ======== RENDER: CONFIRM ======== */
  const renderConfirm = (msg, onConfirm, onCancel) => (
    <div className="pg-modal" onClick={onCancel}>
      <div className="pg-modal-content pg-confirm" onClick={e => e.stopPropagation()}>
        <p>{msg}</p>
        <div className="pg-confirm-actions">
          <button className="btn btn-primary" onClick={onConfirm}>Yes</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );

  /* ======== RENDER: COMPLETE ======== */
  const renderComplete = () => {
    const completedWordCount = Object.keys(foundWords).length;
    return (
      <div className="pg-complete">
        <div className="pg-complete-card">
          <div className="pg-complete-icon">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--success)" strokeWidth="4"
                strokeDasharray="283" strokeDashoffset="0" className="pg-complete-circle" />
              <path d="M30 55 L42 68 L72 35" fill="none" stroke="var(--success)" strokeWidth="6"
                strokeLinecap="round" strokeLinejoin="round" className="pg-complete-check" />
            </svg>
          </div>
          <h2>Puzzle Complete!</h2>
          {timerEnabled && <p className="pg-complete-time">Time: {timer.formatTime}</p>}
          <p className="pg-complete-stat">{completedWordCount} word{completedWordCount > 1 ? "s" : ""} found</p>
          <div className="pg-complete-grid">
            {puzzle.grid.map((row, ri) => (
              <div key={ri} className="pg-complete-row">
                {row.map((cell, ci) => {
                  const found = inFound(ri, ci);
                  return (
                    <span key={ci} className={`pg-complete-cell${found ? " found" : ""}`}
                      style={found ? { color: getWordColor(Object.keys(foundWords).find(k => foundWords[k].some(([fr, fc]) => fr === ri && fc === ci))), fontWeight: 700 } : {}}>
                      {cell}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="pg-share-buttons">
            <button className="btn btn-outline btn-sm" onClick={handleCopyLink}>Copy Link</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleShare("x")}>Share on X</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleShare("whatsapp")}>WhatsApp</button>
          </div>
          <div className="pg-complete-actions">
            <button className="btn btn-primary" onClick={handleNewGame}>New Game</button>
          </div>
        </div>
        {showConfirmNew && renderConfirm("Share your result with friends first?", () => {
          setShowConfirmNew(false);
          handleShare("x");
        }, () => confirmNewGame())}
      </div>
    );
  };

  /* ======== LOADING ======== */
  if (loading) {
    return (
      <div className="puzzle-game">
        <div className="card">
          <div className="pg-loading">
            <h2>Generating Puzzle…</h2>
            <div className="spinner" />
            <p className="text-secondary">Fitting words into a {mode.grid}×{mode.grid} grid</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-game">
      {screen === "start" && renderStart()}
      {screen === "play" && renderPlay()}
      {screen === "complete" && renderComplete()}
    </div>
  );
};

export default PuzzleGame;
