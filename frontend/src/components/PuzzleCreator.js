import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { useGeneration } from "../context/GenerationContext";
import WordSelector from "./WordSelector";
import FileUploader from "./FileUploader";
import LoadingOverlay from "./LoadingOverlay";
import PuzzleDetails from "./PuzzleDetails";
import Tooltip from "./Tooltip";
import { SkeletonForm } from "./Skeleton";
import "./PuzzleCreator.css";

const PuzzleCreator = () => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isGenerating, generatedFile, generationDuration, generatePuzzle: contextGenerate, completeGeneration } = useGeneration();

  const [formData, setFormData] = useState({
    name: "My Word Search",
    normal: 5,
    hard: 2,
    bonus_normal: 1,
    bonus_hard: 1,
    cover_id: null,
    background_id: null,
    puzzle_bg_id: null,
    words_payload: null,
    words_file_id: null,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [settingsResponse, topicsResponse] =
          await Promise.all([
            apiService.getSettings(),
            apiService.getTopics(),
          ]);

        setSettings(settingsResponse.data);
        setTopics(topicsResponse.data.topics);
        setError(null);
      } catch (err) {
        setError("Failed to load required data. Please try again.");
        console.error("Error fetching initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    if (name === "name") {
      const valid = /^[A-Za-z0-9\s\-']+$/.test(value);
      setError(
        valid
          ? null
          : "Title can only contain letters, numbers, spaces, hyphens, and apostrophes."
      );
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }, []);

  const handleFileUpload = useCallback((fileType, fileId) => {
    setFormData((prev) => ({
      ...prev,
      [fileType]: fileId,
    }));
  }, []);

  const handleWordsUpdate = useCallback((wordsPayload) => {
    setFormData((prev) => ({
      ...prev,
      words_payload: wordsPayload,
      words_file_id: null,
    }));
  }, []);

  const handleWordsFileUpload = useCallback((fileId) => {
    setFormData((prev) => ({
      ...prev,
      words_file_id: fileId,
      words_payload: null,
    }));
  }, []);

  const hasWords = formData.words_payload
    ? Object.keys(formData.words_payload).length > 0
    : !!formData.words_file_id;

  const nextStep = useCallback(() => {
    if (step === 2 && !hasWords) {
      setError("Please select topics, add custom words, or upload a word file before proceeding.");
      return;
    }
    setError(null);
    setStep((prev) => prev + 1);
  }, [step, hasWords]);

  const prevStep = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);



  const generatePuzzle = useCallback(async () => {
    try {
      setError(null);
      const fileData = await contextGenerate(formData);
      if (!fileData) return;

      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${formData.name}.pdf`);
      document.body.appendChild(link);
      link.click();

      completeGeneration(fileData, `${formData.name}.pdf`);

      window.URL.revokeObjectURL(url);
      link.remove();

      setStep(4);
    } catch (err) {
      if (err?.name !== "CanceledError") {
        setError("Failed to generate puzzle book. Please try again.");
        console.error("Error generating puzzle:", err);
      }
    }
  }, [formData, contextGenerate, completeGeneration]);

  if (isLoading) {
    return (
      <div className="puzzle-creator loading">
        <div className="container">
          <SkeletonForm />
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="puzzle-creator error">
        <div className="container">
          <div className="card">
            <h2>Error</h2>
            <p className="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-creator">
      <div className="container">
        <div className="card">
          <LoadingOverlay />
          {/* Progress indicator */}
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
              1
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
              2
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
              3
            </div>
            {step === 4 && (
              <>
                <div className="progress-line"></div>
                <div className="progress-step active">✓</div>
              </>
            )}
          </div>

          <h2 className="form-title">
            {step === 1 && "Basic Settings"}
            {step === 2 && "Word Selection"}
            {step === 3 && "Customize Appearance"}
            {step === 4 && "Puzzle Generated!"}
          </h2>

          {/* Step 1: Basic Settings */}
          {step === 1 && (
            <div className="form-step form-with-preview">
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="name">Book Title</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="normal">Normal Puzzles</label>
                    <input
                      type="number"
                      id="normal"
                      name="normal"
                      className="form-control"
                      value={formData.normal}
                      onChange={handleChange}
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hard">Hard Puzzles</label>
                    <input
                      type="number"
                      id="hard"
                      name="hard"
                      className="form-control"
                      value={formData.hard}
                      onChange={handleChange}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Tooltip text="Extra puzzles at the end of the book with an answer key">
                      <label htmlFor="bonus_normal">Bonus Normal Puzzles</label>
                    </Tooltip>
                    <input
                      type="number"
                      id="bonus_normal"
                      name="bonus_normal"
                      className="form-control"
                      value={formData.bonus_normal}
                      onChange={handleChange}
                      min="0"
                      max="10"
                    />
                  </div>

                  <div className="form-group">
                    <Tooltip text="Extra hard puzzles at the end of the book with an answer key">
                      <label htmlFor="bonus_hard">Bonus Hard Puzzles</label>
                    </Tooltip>
                    <input
                      type="number"
                      id="bonus_hard"
                      name="bonus_hard"
                      className="form-control"
                      value={formData.bonus_hard}
                      onChange={handleChange}
                      min="0"
                      max="10"
                    />
                  </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-navigation">
                  <button
                    className="btn btn-primary"
                    onClick={nextStep}
                    disabled={!!error}
                  >
                    Next: Word Selection
                  </button>
                </div>
              </div>
                <PuzzleDetails formData={formData} />
            </div>
          )}

          {/* Step 2: Word Selection */}
          {step === 2 && (
            <div className="form-step form-with-preview">
              <div className="form-fields">
                <WordSelector
                  topics={topics}
                  onWordsUpdate={handleWordsUpdate}
                  onFileUpload={handleWordsFileUpload}
                />

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-navigation">
                  <button className="btn btn-secondary" onClick={prevStep}>
                    Back
                  </button>
                  <button className="btn btn-primary" onClick={nextStep}>
                    Next: Customize Appearance
                  </button>
                </div>
              </div>
              <PuzzleDetails formData={formData} wordsPayload={formData.words_payload} />
            </div>
          )}

          {/* Step 3: File Uploads & Generation */}
          {step === 3 && (
            <div className="form-step form-with-preview">
              <div className="form-fields">
                <div className="image-uploads">
                  <FileUploader
                    label="Cover Image"
                    accept="image/*"
                    onFileUploaded={(fileId) =>
                      handleFileUpload("cover_id", fileId)
                    }
                    description="Upload a custom cover image for your puzzle book"
                    hasDefaultOption={true}
                    defaultFile=""
                  />

                  <FileUploader
                    label="Background Image"
                    accept="image/*"
                    onFileUploaded={(fileId) =>
                      handleFileUpload("background_id", fileId)
                    }
                    description="Upload a background for title and transition pages"
                    hasDefaultOption={true}
                    defaultFile=""
                  />

                  <FileUploader
                    label="Puzzle Background"
                    accept="image/*"
                    onFileUploaded={(fileId) =>
                      handleFileUpload("puzzle_bg_id", fileId)
                    }
                    description="Upload a background for puzzle pages"
                    hasDefaultOption={true}
                    defaultFile=""
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-navigation">
                  <button className="btn btn-secondary" onClick={prevStep}>
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={generatePuzzle}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Puzzle Book"}
                  </button>
                </div>
              </div>
              <PuzzleDetails formData={formData} wordsPayload={formData.words_payload} />
            </div>
          )}

          {/* Step 4: Success & Download */}
          {step === 4 && (
            <div className="form-step success-step">
              <div className="success-animation">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
                </svg>
              </div>
              <h3 className="success-heading">Book Ready</h3>
              {generationDuration != null && (
                <p className="pg-gen-time">Generated in {Math.floor(generationDuration / 60)}:{String(generationDuration % 60).padStart(2, "0")}</p>
              )}
              <p className="success-description">
                <strong>{formData.name}</strong> with {(formData.normal || 0) + (formData.hard || 0) + (formData.bonus_normal || 0) + (formData.bonus_hard || 0)} puzzles is ready to download.
              </p>

              <div className="success-actions">
                <button className="btn btn-primary btn-lg" onClick={() => {
                  const url = window.URL.createObjectURL(new Blob([generatedFile]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", `${formData.name}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  window.URL.revokeObjectURL(url);
                  link.remove();
                }}>
                  Download PDF
                </button>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleCreator;
