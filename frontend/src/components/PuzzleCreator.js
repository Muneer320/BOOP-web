import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useGeneration } from '../context/GenerationContext';
import WordSelector from './WordSelector';
import FileUploader from './FileUploader';
import LoadingOverlay from './LoadingOverlay';
import './PuzzleCreator.css';

const PuzzleCreator = () => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState(null);
  const [topics, setTopics] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use global generation state
  const { isGenerating, startGeneration, completeGeneration } = useGeneration();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "My Word Search",
    normal: 10,
    hard: 5,
    bonus_normal: 1,
    bonus_hard: 1,
    cover_id: null,
    background_id: null,
    puzzle_bg_id: null,
    words_payload: null,
    words_file_id: null
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [settingsResponse, topicsResponse, templatesResponse] = await Promise.all([
          apiService.getSettings(),
          apiService.getTopics(),
          apiService.getTemplates()
        ]);
        
        setSettings(settingsResponse.data);
        setTopics(topicsResponse.data.topics);
        setTemplates(templatesResponse.data.templates);
        setError(null);
      } catch (err) {
        setError('Failed to load required data. Please try again.');
        console.error('Error fetching initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    });
  };

  // Update uploaded file IDs
  const handleFileUpload = (fileType, fileId) => {
    setFormData({
      ...formData,
      [fileType]: fileId
    });
  };

  // Update words payload
  const handleWordsUpdate = (wordsPayload) => {
    setFormData({
      ...formData,
      words_payload: wordsPayload,
      words_file_id: null // Clear file ID if we've set payload
    });
  };

  // Handle text file upload for words
  const handleWordsFileUpload = (fileId) => {
    setFormData({
      ...formData,
      words_file_id: fileId,
      words_payload: null // Clear payload if we've uploaded a file
    });
  };

  // Navigate to next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Navigate to previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Generate puzzle book
  const generatePuzzle = async () => {
    try {
      startGeneration(); // Start global generation state
      setError(null);
      
      const response = await apiService.generatePuzzle(formData);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Store generated file in context for potential re-download
      completeGeneration(response.data);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();
      
      // Reset form or show success
      setStep(4); // Show success step
    } catch (err) {
      setError('Failed to generate puzzle book. Please try again.');
      console.error('Error generating puzzle:', err);
      completeGeneration(null); // Reset generation state on error
    }
  };

  // Conditionally render loading state
  if (isLoading) {
    return (
      <div className="puzzle-creator loading">
        <div className="container">
          <div className="card">
            <h2>Loading...</h2>
            <p>Preparing the puzzle creator...</p>
          </div>
        </div>
      </div>
    );
  }

  // Conditionally render error state
  if (error && !settings) {
    return (
      <div className="puzzle-creator error">
        <div className="container">
          <div className="card">
            <h2>Error</h2>
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
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
          {isGenerating && <LoadingOverlay text="Generating your puzzle book..." />}
          {/* Progress indicator */}
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
            {step === 4 && (
              <>
                <div className="progress-line"></div>
                <div className="progress-step active">✓</div>
              </>
            )}
          </div>

          <h2 className="form-title">
            {step === 1 && 'Basic Settings'}
            {step === 2 && 'Word Selection'}
            {step === 3 && 'Customize Appearance'}
            {step === 4 && 'Puzzle Generated!'}
          </h2>

          {/* Step 1: Basic Settings */}
          {step === 1 && (
            <div className="form-step">
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
                  <label htmlFor="bonus_normal">Bonus Normal Puzzles</label>
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
                  <label htmlFor="bonus_hard">Bonus Hard Puzzles</label>
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

              <div className="form-navigation">
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Word Selection
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Word Selection */}
          {step === 2 && (
            <div className="form-step">
              <WordSelector 
                topics={topics} 
                onWordsUpdate={handleWordsUpdate} 
                onFileUpload={handleWordsFileUpload} 
              />
              
              <div className="form-navigation">
                <button className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Next: Customize Appearance
                </button>
              </div>
            </div>
          )}

          {/* Step 3: File Uploads & Generation */}
          {step === 3 && (
            <div className="form-step">
              <div className="image-uploads">
                <FileUploader
                  label="Cover Image"
                  accept="image/*"
                  onFileUploaded={(fileId) => handleFileUpload('cover_id', fileId)}
                  description="Upload a custom cover image for your puzzle book"
                  hasDefaultOption={true}
                  defaultFile=""
                />
                
                <FileUploader
                  label="Background Image"
                  accept="image/*"
                  onFileUploaded={(fileId) => handleFileUpload('background_id', fileId)}
                  description="Upload a background for title and transition pages"
                  hasDefaultOption={true}
                  defaultFile=""
                />
                
                <FileUploader
                  label="Puzzle Background"
                  accept="image/*"
                  onFileUploaded={(fileId) => handleFileUpload('puzzle_bg_id', fileId)}
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
                  {isGenerating ? 'Generating...' : 'Generate Puzzle Book'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success & Download */}
          {step === 4 && (
            <div className="form-step success-step">
              <div className="success-icon">✓</div>
              <h3>Your Puzzle Book is Ready!</h3>
              <p>Your word search puzzle book has been successfully generated.</p>
              
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => setStep(1)}>
                  Create Another Puzzle
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
