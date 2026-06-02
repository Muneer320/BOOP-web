import { useCallback } from "react";

const STORAGE_KEY = "boop_active_game";

export function useGamePersistence() {
  const saveGame = useCallback((state) => {
    try {
      const data = {
        ...state,
        _savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded */ }
  }, []);

  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data;
    } catch { return null; }
  }, []);

  const clearGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.gameId) {
          localStorage.removeItem("boop_timer_" + data.gameId);
        }
      }
    } catch { /* ignore */ }
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { saveGame, loadGame, clearGame };
}
