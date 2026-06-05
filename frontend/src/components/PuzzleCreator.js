import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { useGeneration } from "../context/GenerationContext";
import WordSelector from "./WordSelector";
import FileUploader from "./FileUploader";
import LoadingOverlay from "./LoadingOverlay";
import PuzzlePreview from "./PuzzlePreview";
import Tooltip from "./Tooltip";
import { SkeletonForm } from "./Skeleton";
import "./PuzzleCreator.css";

const Section = ({ title, id, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`config-section ${open ? "open" : ""}`}>
      <button
        className="config-section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="config-section-title">{title}</span>
        <span className="config-section-chevron">{open ? "–" : "+"}</span>
      </button>
      <div className={`config-section-body ${open ? "visible" : ""}`}>
        {children}
      </div>
    </section>
  );
};

const PuzzleCreator = () => {
  const [settings, setSettings] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isGenerating, generatedFile, generatedFileName, generationDuration, generatePuzzle: contextGenerate, completeGeneration, resetGeneration } = useGeneration();

  const [formData, setFormData] = useState({
    name: "My Puzzle Book",
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

  const [showSuccess, setShowSuccess] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setShowSuccess(false);
    resetGeneration();
  }, [resetGeneration]);

  const handleTitleBlur = useCallback((e) => {
    const value = e.target.value;
    const valid = /^[A-Za-z0-9\s\-']+$/.test(value);
    setError(
      valid
        ? null
        : "Title can only contain letters, numbers, spaces, hyphens, and apostrophes."
    );
  }, []);

  const handleFileUpload = useCallback((fileType, fileId) => {
    setFormData((prev) => ({
      ...prev,
      [fileType]: fileId,
    }));
    setShowSuccess(false);
    resetGeneration();
  }, [resetGeneration]);

  const handleWordsUpdate = useCallback((wordsPayload) => {
    setFormData((prev) => ({
      ...prev,
      words_payload: wordsPayload,
      words_file_id: null,
    }));
    setShowSuccess(false);
    resetGeneration();
  }, [resetGeneration]);

  const handleWordsFileUpload = useCallback((fileId) => {
    setFormData((prev) => ({
      ...prev,
      words_file_id: fileId,
      words_payload: null,
    }));
    setShowSuccess(false);
    resetGeneration();
  }, [resetGeneration]);

  const hasWords = formData.words_payload
    ? Object.keys(formData.words_payload).length > 0
    : !!formData.words_file_id;

  const generatePuzzle = useCallback(async () => {
    if (!hasWords) {
      setError("Please select topics, add custom words, or upload a word file before proceeding.");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

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

      setShowSuccess(true);
    } catch (err) {
      if (err?.name !== "CanceledError") {
        setError("Failed to generate puzzle book. Please try again.");
        console.error("Error generating puzzle:", err);
      }
    }
  }, [formData, hasWords, contextGenerate, completeGeneration]);

  const handleDownloadAgain = useCallback(() => {
    if (!generatedFile) return;
    const url = window.URL.createObjectURL(new Blob([generatedFile]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", generatedFileName);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }, [generatedFile, generatedFileName]);

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

  const totalPuzzles = (formData.normal || 0) + (formData.hard || 0) +
    (formData.bonus_normal || 0) + (formData.bonus_hard || 0);

  return (
    <div className="puzzle-creator">
      <div className="container">
        <LoadingOverlay />
        <div className="creator-layout">
          <div className="creator-config">
            <Section title="Settings" id="settings" defaultOpen={true}>
              <div className="form-group">
                <label htmlFor="name">Book Title</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleTitleBlur}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Tooltip text="13×13 grid · words can go backwards · 10–15 words per puzzle">
                    <label htmlFor="normal">Normal Puzzles</label>
                  </Tooltip>
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
                  <Tooltip text="17×17 grid · harder word placements · 13–20 words per puzzle">
                    <label htmlFor="hard">Hard Puzzles</label>
                  </Tooltip>
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
                    <label htmlFor="bonus_normal">Bonus Normal</label>
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
                    <label htmlFor="bonus_hard">Bonus Hard</label>
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
            </Section>

            <Section title="Words" id="words" defaultOpen={false}>
              <WordSelector
                topics={topics}
                onWordsUpdate={handleWordsUpdate}
                onFileUpload={handleWordsFileUpload}
              />
            </Section>

            <Section title="Appearance" id="appearance" defaultOpen={false}>
              <div className="image-uploads">
                <FileUploader
                  label="Cover Image"
                  accept="image/*"
                  onFileUploaded={(fileId) =>
                    handleFileUpload("cover_id", fileId)
                  }
                  description="Upload a custom cover image"
                  hasDefaultOption={true}
                  defaultFile=""
                />

                <FileUploader
                  label="Background Image"
                  accept="image/*"
                  onFileUploaded={(fileId) =>
                    handleFileUpload("background_id", fileId)
                  }
                  description="Upload a background for title pages"
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
            </Section>

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              className="btn btn-primary btn-lg btn-generate"
              onClick={generatePuzzle}
              disabled={isGenerating || (generatedFile && !showSuccess)}
              aria-label={isGenerating ? "Generating puzzle book" : "Generate puzzle book"}
            >
              {isGenerating ? "Generating..." : "Generate Puzzle Book"}
            </button>
          </div>

          <div className="creator-preview">
            {showSuccess && generatedFile ? (
              <div className="success-panel">
                <div className="success-stamp">APPROVED<br />FOR PRINT</div>
                <h3 className="success-heading">Your Book is Ready!</h3>
                <p className="success-description">
                  <strong>{formData.name}</strong> &mdash; {totalPuzzles} puzzles
                </p>
                {generationDuration != null && (
                  <p className="success-time">
                    Generated in {generationDuration < 60
                      ? `${generationDuration}s`
                      : `${Math.floor(generationDuration / 60)}m ${generationDuration % 60}s`}
                  </p>
                )}
                <div className="success-actions">
                  <button className="btn btn-primary btn-lg" onClick={handleDownloadAgain}>
                    Download PDF
                  </button>
                  <button className="btn btn-outline" onClick={() => { setShowSuccess(false); resetGeneration(); }}>
                    Edit Settings
                  </button>
                </div>
              </div>
            ) : (
              <PuzzlePreview formData={formData} wordsPayload={formData.words_payload} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleCreator;
