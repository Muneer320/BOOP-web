import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from "react";
import { apiService } from "../services/api";

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [generationStarted, setGenerationStarted] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [progress, setProgress] = useState(null);
  const abortRef = useRef(null);
  const pollRef = useRef(null);
  const sessionIdRef = useRef(null);

  const startGeneration = useCallback(() => {
    setIsGenerating(true);
    setGeneratedFile(null);
    setGeneratedFileName("");
    setGenerationStarted(new Date());
    setGenerationError(null);
    setProgress({ step: "starting", detail: "Initializing…" });
    sessionIdRef.current = "gen_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }, []);

  const completeGeneration = useCallback((fileData, fileName) => {
    setIsGenerating(false);
    setGeneratedFile(fileData);
    setGeneratedFileName(fileName || "puzzle-book.pdf");
    setGenerationError(null);
    setProgress({ step: "complete", detail: "PDF ready", done: true });
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    sessionIdRef.current = null;
  }, []);

  const failGeneration = useCallback((error) => {
    setIsGenerating(false);
    setGenerationError(error?.message || "Generation failed");
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    sessionIdRef.current = null;
  }, []);

  const resetGeneration = useCallback(() => {
    setIsGenerating(false);
    setGeneratedFile(null);
    setGeneratedFileName("");
    setGenerationStarted(null);
    setGenerationError(null);
    setProgress(null);
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    sessionIdRef.current = null;
  }, []);

  const generatePuzzle = useCallback(async (formData) => {
    startGeneration();
    const controller = new AbortController();
    abortRef.current = controller;
    const sid = sessionIdRef.current;

    pollRef.current = setInterval(async () => {
      try {
        const r = await apiService.getGenerationProgress(sid);
        if (r.data) setProgress(r.data);
      } catch { /* poll quietly */ }
    }, 600);

    try {
      const response = await apiService.generatePuzzle(formData, controller.signal, sid);
      if (response?.data) {
        completeGeneration(response.data, `${formData.name}.pdf`);
      }
      return response?.data;
    } catch (err) {
      if (err.name !== "CanceledError") {
        failGeneration(err);
        throw err;
      }
    } finally {
      abortRef.current = null;
    }
  }, [startGeneration, completeGeneration, failGeneration]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isGenerating) {
        e.preventDefault();
        e.returnValue = "A puzzle is being generated. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGenerating]);

  return (
    <GenerationContext.Provider value={{
      isGenerating, generatedFile, generatedFileName, generationStarted,
      generationError, progress, startGeneration, completeGeneration,
      resetGeneration, generatePuzzle,
    }}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error("useGeneration must be used within a GenerationProvider");
  return context;
};
