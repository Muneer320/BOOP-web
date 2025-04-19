import React, { createContext, useState, useContext } from 'react';

// Create the context
const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [generationStarted, setGenerationStarted] = useState(null); // timestamp

  // Start a generation process
  const startGeneration = () => {
    setIsGenerating(true);
    setGeneratedFile(null);
    setGenerationStarted(new Date());
  };

  // Complete a generation process
  const completeGeneration = (fileData) => {
    setIsGenerating(false);
    setGeneratedFile(fileData);
  };

  // Cancel or reset generation status
  const resetGeneration = () => {
    setIsGenerating(false);
    setGeneratedFile(null);
    setGenerationStarted(null);
  };

  return (
    <GenerationContext.Provider 
      value={{
        isGenerating,
        generatedFile,
        generationStarted,
        startGeneration,
        completeGeneration,
        resetGeneration
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

// Custom hook to use the context
export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};
