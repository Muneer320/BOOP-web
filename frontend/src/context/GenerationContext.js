import React, { createContext, useState, useContext } from "react";

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [generationStarted, setGenerationStarted] = useState(null);

  const startGeneration = () => {
    setIsGenerating(true);
    setGeneratedFile(null);
    setGeneratedFileName("");
    setGenerationStarted(new Date());
  };

  const completeGeneration = (fileData, fileName) => {
    setIsGenerating(false);
    setGeneratedFile(fileData);
    setGeneratedFileName(fileName || "puzzle-book.pdf");
  };

  const resetGeneration = () => {
    setIsGenerating(false);
    setGeneratedFile(null);
    setGeneratedFileName("");
    setGenerationStarted(null);
  };

  return (
    <GenerationContext.Provider
      value={{
        isGenerating,
        generatedFile,
        generatedFileName,
        generationStarted,
        startGeneration,
        completeGeneration,
        resetGeneration,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error("useGeneration must be used within a GenerationProvider");
  }
  return context;
};
