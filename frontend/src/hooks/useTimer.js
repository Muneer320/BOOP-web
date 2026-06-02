import { useState, useRef, useCallback, useEffect } from "react";

const STORAGE_KEY_PREFIX = "boop_timer_";

export default function useTimer(gameId) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(null);
  const pausedElapsedRef = useRef(0);
  const intervalRef = useRef(null);
  const storageKey = STORAGE_KEY_PREFIX + gameId;

  const saveState = useCallback((state) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch { /* quota exceeded */ }
  }, [storageKey]);

  const loadState = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, [storageKey]);

  const tick = useCallback(() => {
    if (!startRef.current) return;
    const now = Date.now();
    const live = now - startRef.current;
    const total = pausedElapsedRef.current + live;
    setElapsed(total);
    saveState({ startTime: now, pausedElapsed: pausedElapsedRef.current, running: true, paused: false });
  }, [saveState]);

  const start = useCallback(() => {
    pausedElapsedRef.current = 0;
    startRef.current = Date.now();
    setRunning(true);
    setPaused(false);
    setElapsed(0);
    intervalRef.current = setInterval(tick, 200);
    saveState({ startTime: startRef.current, pausedElapsed: 0, running: true, paused: false });
  }, [tick, saveState]);

  const doPause = useCallback(() => {
    if (!running || paused) return;
    if (startRef.current) {
      pausedElapsedRef.current += Date.now() - startRef.current;
    }
    startRef.current = null;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPaused(true);
    setElapsed(pausedElapsedRef.current);
    saveState({ startTime: null, pausedElapsed: pausedElapsedRef.current, running: true, paused: true });
  }, [running, paused, saveState]);

  const resume = useCallback(() => {
    if (!running || !paused) return;
    startRef.current = Date.now();
    setPaused(false);
    intervalRef.current = setInterval(tick, 200);
    saveState({ startTime: startRef.current, pausedElapsed: pausedElapsedRef.current, running: true, paused: false });
  }, [running, paused, tick, saveState]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (startRef.current && !paused) {
      pausedElapsedRef.current += Date.now() - startRef.current;
    }
    startRef.current = null;
    setRunning(false);
    setPaused(false);
    setElapsed(pausedElapsedRef.current);
    localStorage.removeItem(storageKey);
  }, [paused, storageKey]);

  const restore = useCallback(() => {
    const saved = loadState();
    if (!saved || !saved.running) return false;
    pausedElapsedRef.current = saved.pausedElapsed || 0;
    if (saved.paused) {
      setElapsed(saved.pausedElapsed || 0);
      setRunning(true);
      setPaused(true);
    } else if (saved.startTime) {
      const live = Date.now() - saved.startTime;
      const total = pausedElapsedRef.current + live;
      setElapsed(total);
      setRunning(true);
      setPaused(false);
      startRef.current = saved.startTime;
      intervalRef.current = setInterval(tick, 200);
    }
    return true;
  }, [loadState, tick]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return { elapsed, running, paused, start, pause: doPause, resume, stop, restore, formatTime: formatTime(elapsed) };
}
