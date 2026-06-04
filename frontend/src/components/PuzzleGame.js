import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { apiService } from "../services/api";
import { useGamePersistence } from "../hooks/useGamePersistence";
import useTimer from "../hooks/useTimer";
import "./PuzzleGame.css";

const MODES = [
  { id: "easy", label: "Easy", grid: 10, minW: 4, maxW: 10, back: false, mask: null },
  { id: "normal", label: "Normal", grid: 13, minW: 6, maxW: 10, back: true, mask: null },
  { id: "hard", label: "Hard", grid: 15, minW: 8, maxW: 18, back: true, mask: null },
  { id: "veryhard", label: "Very Hard", grid: 18, minW: 10, maxW: 26, back: true, mask: null },
  { id: "nightmare", label: "Nightmare", grid: 20, minW: 12, maxW: 34, back: true, mask: null },
  { id: "bonus", label: "Bonus", grid: 15, minW: 6, maxW: 15, back: true, mask: "circle" },
];

const COLORS = ["#3a6b35", "#8b3a3a", "#b8860b", "#4a6fa5", "#6b4a8b", "#c4956a", "#2d6b5e", "#8b5e3a", "#4a7c5e", "#7a5e3a"];

const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];

const cleanWord = (w) => w.trim().toUpperCase().replace(/[^A-Z]/g, "");

function parseFileText(text) {
  const errors = [];
  const sections = text.split(/={10,}/);
  const topics = {};
  let hasTopicHeader = false;

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const topicLine = lines[0];
    if (!topicLine.startsWith(">")) continue;
    hasTopicHeader = true;
    const topic = topicLine.slice(1).trim();
    if (!topic) { errors.push("Empty topic name after >"); continue; }
    const words = lines.slice(1).map(cleanWord).filter((w) => w.length >= 2);
    if (words.length === 0) { errors.push(`Topic "${topic}" has no valid words`); continue; }
    if (topics[topic]) {
      topics[topic] = [...new Set([...topics[topic], ...words])];
    } else {
      topics[topic] = words;
    }
  }

  if (!hasTopicHeader) {
    const allLines = text.split(/[\n\r,;]+/).map(cleanWord).filter(w => w.length >= 2);
    if (allLines.length > 0) {
      topics["_flat"] = allLines;
    }
  }

  return { topics, errors };
}

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
  const [gameId, setGameId] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [hintWord, setHintWord] = useState(null);
  const [fullSolutionMode, setFullSolutionMode] = useState(null); // null | "confirm" | "done"
  const [, forceTick] = useState(0);
  const lastGlobalHintRef = useRef(0);
  const gameStartTime = useRef(null);

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
  const [topicError, setTopicError] = useState(null);

  /* ---- File upload state ---- */
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);

  const mode = useMemo(() => MODES.find(m => m.id === modeId) || MODES[1], [modeId]);
  const timer = useTimer();
  const gridRef = useRef(null);

  /* ---- Load topics on mount ---- */
  useEffect(() => {
    apiService.getTopics().then(r => {
      setTopics(r.data.topics || []);
    }).catch(() => {
      setTopicError("Could not load topics. Check your connection and try again.");
    });
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
    if (wordSource === "manual" || wordSource === "file") return wordChips;
    return [];
  }, [wordSource, topicSelectedWords, wordChips]);

  /* ---- Generate puzzle ---- */
  const generatePuzzle = useCallback(async (words, timerOn) => {
    const id = `game_${Date.now()}`;
    setGameId(id);
    setLoading(true);
    setError(null);
    gameStartTime.current = Date.now();
    setHintWord(null);
    setFullSolutionMode(null);
    try {
      const resp = await apiService.playGenerate(words, modeId);
      const data = resp.data;
      data.words.sort();
      setPuzzle(data);
      setFoundWords({});
      setSelectedCells([]);
      setDragCells([]);
      setScreen("play");
      if (timerOn) timer.start(id);
      saveGame({ gameId: id, puzzle: data, mode: modeId, timerEnabled: timerOn, wordSource, wordChips, gameStartTime: gameStartTime.current });
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
      setGameId(saved.gameId || null);
      if (saved.gameStartTime) {
        gameStartTime.current = saved.gameStartTime;
      }
      const restored = timer.restore(saved.gameId);
      if (restored || saved.screen === "complete") {
        setScreen("play");
      }
    }
    // eslint-disable-next-line
  }, []);

  /* ---- Persist progress ---- */
  useEffect(() => {
    if (screen === "play" && puzzle) {
      saveGame({ gameId, puzzle, mode: modeId, foundWords, timerEnabled, screen, wordSource, wordChips, words: puzzle.words, gameStartTime: gameStartTime.current });
    }
  }, [screen, puzzle, foundWords, modeId, timerEnabled, saveGame, wordSource, wordChips, gameId]);

  /* ---- Cell helpers ---- */
  const foundSetRef = useRef(new Set());
  foundSetRef.current = new Set(
    Object.values(foundWords).flatMap(cells => cells.map(([r, c]) => `${r},${c}`))
  );

  const inFound = useCallback((r, c) => {
    return foundSetRef.current.has(`${r},${c}`);
  }, []);

  const getWordColor = useCallback((word) => {
    const idx = Object.keys(foundWords).indexOf(word);
    return idx >= 0 ? COLORS[idx % COLORS.length] : null;
  }, [foundWords]);

  const getBlendedColor = useCallback((r, c) => {
    const wordsAtCell = Object.keys(foundWords).filter(word =>
      foundWords[word].some(([fr, fc]) => fr === r && fc === c)
    );

    if (wordsAtCell.length === 0) return null;
    if (wordsAtCell.length === 1) return getWordColor(wordsAtCell[0]);

    // Blend multiple colors by averaging RGB values
    const colors = wordsAtCell.map(word => getWordColor(word) || COLORS[0]);
    const rgbs = colors.map(hex => {
      const h = hex.replace('#', '');
      return [
        parseInt(h.substr(0, 2), 16),
        parseInt(h.substr(2, 2), 16),
        parseInt(h.substr(4, 2), 16)
      ];
    });

    const avgRGB = [
      Math.round(rgbs.reduce((sum, rgb) => sum + rgb[0], 0) / rgbs.length),
      Math.round(rgbs.reduce((sum, rgb) => sum + rgb[1], 0) / rgbs.length),
      Math.round(rgbs.reduce((sum, rgb) => sum + rgb[2], 0) / rgbs.length)
    ];

    return '#' + avgRGB.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  }, [foundWords, getWordColor]);

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
    if (!cells.length || cells[cells.length - 1][0] !== end[0] || cells[cells.length - 1][1] !== end[1]) return;

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

  /* ---- Keyboard navigation ---- */
  const handleCellKeyDown = useCallback((e, r, c) => {
    if (!puzzle || paused || screen !== "play") return;
    const s = puzzle.grid_size;
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); setFocusedCell([Math.max(0, r - 1), c]); break;
      case "ArrowDown": e.preventDefault(); setFocusedCell([Math.min(s - 1, r + 1), c]); break;
      case "ArrowLeft": e.preventDefault(); setFocusedCell([r, Math.max(0, c - 1)]); break;
      case "ArrowRight": e.preventDefault(); setFocusedCell([r, Math.min(s - 1, c + 1)]); break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleCellClick(r, c);
        break;
      default: break;
    }
  }, [puzzle, paused, screen, handleCellClick]);

  /* ---- Drag handling ---- */
  const dragCellsRef = useRef([]);
  const dragRafRef = useRef(null);

  const handleMouseDown = useCallback((r, c) => {
    if (!puzzle || paused || screen !== "play" || inFound(r, c)) return;
    setIsDragging(true);
    setSelectedCells([[r, c]]);
    dragCellsRef.current = [[r, c]];
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
    dragCellsRef.current = cells;
    if (!dragRafRef.current) {
      dragRafRef.current = requestAnimationFrame(() => {
        dragRafRef.current = null;
        setDragCells(dragCellsRef.current);
      });
    }
  }, [isDragging, selectedCells, puzzle, paused, getDirection]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    if (dragRafRef.current) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    setIsDragging(false);
    const cells = dragCellsRef.current;
    if (cells.length > 1) {
      attemptWord(selectedCells[0], cells[cells.length - 1]);
    }
    dragCellsRef.current = [];
    setSelectedCells([]);
    setDragCells([]);
  }, [isDragging, selectedCells, attemptWord]);

  /* ---- Touch handlers ---- */
  const handleTouchStart = useCallback((e, r, c) => {
    if (!puzzle || paused || screen !== "play" || inFound(r, c)) return;
    setIsDragging(true);
    setSelectedCells([[r, c]]);
    dragCellsRef.current = [[r, c]];
    setDragCells([[r, c]]);
  }, [puzzle, paused, screen, inFound]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !puzzle || paused) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const cell = el.closest("[data-row]");
    if (!cell) return;
    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);
    if (isNaN(r) || isNaN(c)) return;
    handleMouseMove(r, c);
  }, [isDragging, puzzle, paused, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

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
    const parts = val.split(",").map(cleanWord).filter(w => w.length >= 2);
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
      const word = cleanWord(manualInput);
      if (word.length >= 2 && !wordChips.includes(word) && wordChips.length < mode.maxW) {
        setWordChips(prev => [...prev, word]);
      }
      setManualInput("");
      e.preventDefault();
    }
    if (e.key === "Backspace" && !manualInput && wordChips.length > 0) {
      e.preventDefault();
      removeChip(wordChips[wordChips.length - 1]);
    }
  }, [manualInput, wordChips, mode.maxW, removeChip]);

  /* ---- Hint helpers ---- */
  const hintWordCell = useCallback((word) => {
    if (!puzzle) return;
    const positions = puzzle.cells_by_word?.[word] || puzzle.positions?.[word] || puzzle.words_positions?.[word] || [];
    if (!positions.length) return;
    const newFound = { ...foundWords, [word]: positions };
    setFoundWords(newFound);
    lastGlobalHintRef.current = Date.now();
    setHintWord(null);
    if (Object.keys(newFound).length === puzzle.words.length) {
      timer.stop();
      setScreen("complete");
    }
  }, [puzzle, foundWords, timer]);

  const handleRequestHint = useCallback((word) => {
    const now = Date.now();
    const elapsed = (now - (gameStartTime.current || now)) / 1000;
    if (elapsed < 60) return;
    if (now - lastGlobalHintRef.current < 30000) return;
    setHintWord(word);
  }, []);

  const handleFullSolution = useCallback(() => {
    if (!puzzle) return;
    const now = Date.now();
    const elapsed = (now - (gameStartTime.current || now)) / 1000;
    if (elapsed < 120) return;
    setFullSolutionMode("confirm");
  }, [puzzle]);

  const confirmFullSolution = useCallback(() => {
    const wordCells = puzzle.cells_by_word || puzzle.positions || puzzle.words_positions;
    if (!puzzle || !wordCells) return;
    const newFound = { ...foundWords };
    for (const word of puzzle.words) {
      if (!newFound[word] && wordCells[word]) {
        newFound[word] = wordCells[word];
      }
    }
    setFoundWords(newFound);
    setFullSolutionMode("done");
    timer.stop();
    setScreen("complete");
  }, [puzzle, foundWords, timer]);

  const canFullSolution = useCallback(() => {
    if (!puzzle || fullSolutionMode === "done") return false;
    return true;
  }, [puzzle, fullSolutionMode]);

  /* ---- Cooldown ticker ---- */
  useEffect(() => {
    if (screen !== "play") return;
    const id = setInterval(() => forceTick(t => t + 1), 200);
    return () => clearInterval(id);
  }, [screen]);

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

  /* ---- Poster canvas (grid + word list + stats) ---- */
  const renderPosterCanvas = useCallback(() => {
    if (!puzzle) return null;
    const gs = puzzle.grid_size;
    const cellPx = Math.max(22, Math.min(36, Math.floor(500 / gs)));
    const gap = 2;
    const gridPad = 16;
    const margin = 30;
    const gridInner = gs * cellPx + (gs - 1) * gap;
    const gridW = gridInner + gridPad * 2;
    const pW = gridW + margin * 2;

    const wordList = puzzle.words || puzzle.words || [];
    const foundWordNames = Object.keys(foundWords);
    const cols = 2;
    const wordRows = Math.ceil(wordList.length / cols);

    const rowH = 26;
    const wordSectionH = wordRows * rowH + 8;
    const headerH = 64;
    const footerH = 80;

    let pH = margin + headerH + 16 + gridPad * 2 + gridInner + 18 + 30 + wordSectionH + 20 + footerH + margin;

    const canvas = document.createElement("canvas");
    canvas.width = pW;
    canvas.height = pH;
    const ctx = canvas.getContext("2d");

    /* Background gradient */
    const grad = ctx.createLinearGradient(0, 0, 0, pH);
    grad.addColorStop(0, "#16213e");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, pW, pH);

    let y = margin;

    /* Title */
    ctx.fillStyle = "#fdfaf4";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("BOOP - Word Search", pW / 2, y);
    y += 36;
    ctx.fillStyle = "#a0aec0";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Mode: ${(puzzle.mode || "custom").charAt(0).toUpperCase() + (puzzle.mode || "custom").slice(1)}`, pW / 2, y);
    y += 28;

    /* Grid background — clipped to circle for bonus mode */
    const bgX = margin;
    const bgY = y;
    const bgW = gridW;
    const bgH = gridPad * 2 + gridInner;
    ctx.save();
    const isCircle = puzzle.mask === "circle";
    if (isCircle) {
      const cx = bgX + bgW / 2;
      const cy2 = bgY + bgH / 2;
      const r = (Math.min(bgW, bgH) - 4) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy2, r, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(bgX, bgY, bgW, bgH);
    ctx.restore();
    if (!isCircle) {
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.strokeRect(bgX, bgY, bgW, bgH);
    }

    const gridX = margin + gridPad;
    const gridY = y + gridPad;
    const center = (gs - 1) / 2;
    for (let r = 0; r < gs; r++) {
      for (let c = 0; c < gs; c++) {
        const isOut = isCircle && Math.hypot(r - center, c - center) > center;
        const letter = puzzle.grid[r][c];
        const isEmpty = !letter || letter === " " || letter === "";
        if (isOut && isEmpty) continue;
        const x = gridX + c * (cellPx + gap);
        const cy = gridY + r * (cellPx + gap);
        const found = foundSetRef.current.has(`${r},${c}`);
        if (found) {
          const blended = getBlendedColor(r, c);
          ctx.fillStyle = blended || "#3a6b35";
        } else {
          ctx.fillStyle = "#2a2a2a";
        }
        ctx.fillRect(x, cy, cellPx, cellPx);
        ctx.fillStyle = found ? "#ffffff" : "#94a3b8";
        ctx.font = `bold ${Math.floor(cellPx * 0.52)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(letter, x + cellPx / 2, cy + cellPx / 2 + 1);
      }
    }
    y += bgH + 20;

    /* Word list */
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const colW = (pW - margin * 2) / cols;
    for (let i = 0; i < wordList.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const wx = margin + col * colW + 8;
      const wy = y + row * rowH;
      const isFound = foundWordNames.includes(wordList[i]);
      const idx = foundWordNames.indexOf(wordList[i]);
      ctx.fillStyle = isFound ? COLORS[idx % COLORS.length] : "#475569";
      ctx.beginPath();
      ctx.arc(wx + 6, wy + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isFound ? "#e2e8f0" : "#64748b";
      ctx.font = `${isFound ? "bold " : ""}14px sans-serif`;
      ctx.fillText(wordList[i], wx + 16, wy + 1);
    }
    y += wordRows * rowH + 20;

    /* Footer */
    ctx.fillStyle = "#fdfaf4";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    const timeStr = timer?.formatTime || "00:00";
    ctx.fillText(`Time: ${timeStr}`, pW / 2, y);
    y += 26;
    const url = "https://boop-web.vercel.app/";
    ctx.textBaseline = "top";
    ctx.font = "14px sans-serif";
    const boldPart = "boop-web";
    const before = url.slice(0, url.indexOf(boldPart));
    const after = url.slice(url.indexOf(boldPart) + boldPart.length);
    const beforeW = ctx.measureText(before).width;
    ctx.font = "bold 14px sans-serif";
    const boldW2 = ctx.measureText(boldPart).width;
    ctx.font = "14px sans-serif";
    const afterW = ctx.measureText(after).width;
    const totalW = beforeW + boldW2 + afterW;
    const startX = pW / 2 - totalW / 2;
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(before, startX, y);
    ctx.fillStyle = "#fdfaf4";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(boldPart, startX + beforeW, y);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText(after, startX + beforeW + boldW2, y);

    return canvas;
  }, [puzzle, foundWords, timer, getBlendedColor]);

  /* ---- Download poster as PNG ---- */
  const handleDownloadGrid = useCallback(() => {
    const canvas = renderPosterCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "boop-solved-grid.png";
    link.href = canvas.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [renderPosterCanvas]);

  /* ---- Share ---- */
  const handleShare = useCallback(async (platform) => {
    if (!puzzle) return;
    const timeStr = timer?.formatTime || "00:00";
    const shareText = `I just solved this word search on BOOP in ${timeStr}!\nCan you beat my time?\n`;
    if (navigator.share) {
      try {
        const canvas = renderPosterCanvas();
        if (canvas) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
          const file = new File([blob], "boop-solved-grid.png", { type: "image/png" });
          await navigator.share({ files: [file], title: "BOOP Word Search", text: shareText });
          return;
        }
      } catch { /* fall through to URL share */ }
    }
    const url = encodeURIComponent(window.location.origin + "/play");
    const text = encodeURIComponent(shareText + window.location.origin + "/play");
    const hrefs = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}`,
    };
    if (hrefs[platform]) window.open(hrefs[platform], "_blank", "noopener");
  }, [puzzle, renderPosterCanvas, timer]);

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
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    const newErrors = [];
    const allWords = [];

    for (const file of files) {
      try {
        await apiService.uploadFile(file);
      } catch {
        newErrors.push(`Failed to upload "${file.name}" to server.`);
        continue;
      }

      const text = await file.text();
      const { topics: parsed, errors: parseErrs } = parseFileText(text);
      newErrors.push(...parseErrs.map((e) => `"${file.name}": ${e}`));

      for (const words of Object.values(parsed)) {
        allWords.push(...words);
      }
    }

    setFileErrors(newErrors);
    if (allWords.length > 0) {
      const words = [...new Set(allWords)];
      setWordChips(prev => [...new Set([...prev, ...words])]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

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

        {error && <div className="pg-error">
          <span>{error}</span>
          <button className="pg-error-close" onClick={() => setError(null)}>&times;</button>
        </div>}

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
              {topicError && <p className="alert alert-danger">{topicError}</p>}
              {loadingTopics && <p className="pg-loading-hint">Loading words\u2026</p>}
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
              <p className="pg-file-hint">Upload a <code>.txt</code> file with topics and words, or a simple word list:</p>
              <pre className="format-example" style={{ fontSize: "0.75rem", padding: "0.5rem" }}>{`>TECHNOLOGY
algorithm
binary
====================
>ASTRONOMY
asteroid, comet`}</pre>
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                Choose .txt File(s)
                <input type="file" accept=".txt" multiple ref={fileInputRef}
                  onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
              {fileErrors.length > 0 && (
                <div className="pg-error" style={{ marginTop: "0.5rem" }}>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {fileErrors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
              {wordChips.length > 0 && (
                <>
                  <div className="pg-chips">
                    {wordChips.map(w => (
                      <span key={w} className="pg-chip" onClick={() => removeChip(w)}>
                        {w} <span className="pg-chip-remove">&times;</span>
                      </span>
                    ))}
                  </div>
                  <p className="pg-word-count">{wordChips.length} words (min {mode.minW}, max {mode.maxW})</p>
                </>
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
            {error && <div className="pg-error pg-error-inline">
              <span>{error}</span>
              <button className="pg-error-close" onClick={() => setError(null)}>&times;</button>
            </div>}
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
                  const isFocused = focusedCell && focusedCell[0] === ri && focusedCell[1] === ci;
                  const color = found ? getBlendedColor(ri, ci) : null;
                  return (
                    <div key={`${ri}-${ci}`}
                      className={`pg-cell${found ? " found" : ""}${sel ? " selecting" : ""}${hl ? " hilite" : ""}`}
                      style={color ? { background: color, color: "#fff" } : sel ? { background: "var(--primary)", color: "#fff" } : {}}
                      data-row={ri} data-col={ci}
                      role="gridcell"
                      tabIndex={isFocused ? 0 : -1}
                      onMouseDown={() => handleMouseDown(ri, ci)}
                      onMouseMove={() => handleMouseMove(ri, ci)}
                      onMouseUp={handleMouseUp}
                      onTouchStart={e => handleTouchStart(e, ri, ci)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={() => { setFocusedCell([ri, ci]); handleCellClick(ri, ci); }}
                      onKeyDown={e => handleCellKeyDown(e, ri, ci)}>
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
                    <span className="pg-word-text">{word}</span>
                    {!foundWords[word] && (() => {
                      const now = Date.now();
                      const gameTime = (now - (gameStartTime.current || now)) / 1000;
                      const sinceLast = (now - lastGlobalHintRef.current) / 1000;
                      const hintReady = gameTime >= 60 && sinceLast >= 30;
                      let hintPct = 100;
                      let hintLabel = "Show hint";
                      if (!hintReady) {
                        if (gameTime < 60) {
                          hintPct = Math.min(99, (gameTime / 60) * 100);
                          hintLabel = `Hint in ${60 - Math.ceil(gameTime)}s`;
                        } else {
                          hintPct = Math.min(99, (sinceLast / 30) * 100);
                          hintLabel = `Hint in ${30 - Math.ceil(sinceLast)}s`;
                        }
                      }
                      return (
                        <button className="pg-hint-btn" onClick={() => handleRequestHint(word)}
                          disabled={!hintReady}>
                          <span className="pg-hint-bar" style={{ width: `${hintPct}%`, transition: "width 0.2s linear" }} />
                          <span className="pg-hint-icon">&#128161;</span>
                          <span className="pg-hint-label">{hintLabel}</span>
                        </button>
                      );
                    })()}
                  </div>
                ))}
              </div>
              {(() => {
                const now = Date.now();
                const gameTime = (now - (gameStartTime.current || now)) / 1000;
                const fullReady = gameTime >= 120;
                const fullPct = Math.min(99, (gameTime / 120) * 100);
                const fullLabel = fullReady ? "Show Full Solution" : `Full solution in ${120 - Math.ceil(gameTime)}s`;
                return canFullSolution() && fullSolutionMode !== "done" ? (
                  <button className="btn btn-outline btn-sm pg-full-soln-btn"
                    disabled={!fullReady} onClick={handleFullSolution}>
                    <span className="pg-hint-bar" style={{ width: `${fullPct}%`, transition: "width 0.2s linear" }} />
                    <span className="pg-hint-label">{fullLabel}</span>
                  </button>
                ) : null;
              })()}
            </div>
          </div>
        </div>

        {hintWord && renderConfirm(
          `Reveal "${hintWord}"? This will count as found.`,
          () => { hintWordCell(hintWord); },
          () => setHintWord(null)
        )}
        {fullSolutionMode === "confirm" && renderConfirm(
          "Reveal the entire puzzle solution? All remaining words will be marked as found.",
          confirmFullSolution,
          () => setFullSolutionMode(null)
        )}
      </>
    );
  };

  /* ======== RENDER: CONFIRM ======== */
  const renderConfirm = (msg, onConfirm, onCancel) => (
    <ConfirmModal msg={msg} onConfirm={onConfirm} onCancel={onCancel} />
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
          <div className="pg-complete-grid"
            style={{ "--grid-size": puzzle.grid_size }}>
            {puzzle.grid.map((row, ri) => (
              <div key={ri} className="pg-complete-row">
                {row.map((cell, ci) => {
                  const found = inFound(ri, ci);
                  const cellPx = Math.min(24, Math.floor((Math.min(500, window.innerWidth - 64)) / puzzle.grid_size));
                  const blendedColor = found ? getBlendedColor(ri, ci) : null;
                  return (
                    <span key={ci} className={`pg-complete-cell${found ? " found" : ""}`}
                      style={{ width: cellPx, height: cellPx, fontSize: Math.max(6, cellPx * 0.5), ...(blendedColor ? { background: blendedColor, color: "#fff", fontWeight: 700 } : {}) }}>
                      {cell}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="pg-share-buttons">
            <button className="btn btn-outline btn-sm" onClick={handleDownloadGrid}>Download Solved Grid</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleShare("x")}>Share on X</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleShare("whatsapp")}>WhatsApp</button>
            {navigator.share && <button className="btn btn-outline btn-sm" onClick={() => handleShare("native")}>Share Image</button>}
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
            <button className="btn btn-secondary btn-sm pg-loading-back" onClick={() => setLoading(false)}>Cancel</button>
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
      {showConfirmQuit && renderConfirm(
        "Quit current game and start a new one?",
        confirmNewGame,
        () => setShowConfirmQuit(false)
      )}
    </div>
  );
};

/* ---- Focus-trapping Confirm Modal ---- */
const ConfirmModal = ({ msg, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    const handleKey = (e) => {
      if (e.key === "Escape") { onCancel(); return; }
      if (e.key === "Tab" && focusable.length > 1) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className="pg-modal" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="pg-modal-content pg-confirm" onClick={e => e.stopPropagation()} ref={modalRef}>
        <p>{msg}</p>
        <div className="pg-confirm-actions">
          <button className="btn btn-primary" onClick={onConfirm}>Yes</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
