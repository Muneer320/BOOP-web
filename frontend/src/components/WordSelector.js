import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './WordSelector.css';

const WordSelector = ({ topics, onWordsUpdate, onFileUpload }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicWords, setTopicWords] = useState({});
  const [customWords, setCustomWords] = useState({});
  const [customTopicName, setCustomTopicName] = useState('');
  const [customWordInput, setCustomWordInput] = useState('');
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [error, setError] = useState(null);
  const [selectionType, setSelectionType] = useState('preset'); // 'preset', 'custom', 'file'

  // Fetch words for a specific topic
  const fetchTopicWords = async (topic) => {
    try {
      setIsLoadingWords(true);
      const response = await apiService.getTopicWords(topic);
      setTopicWords(prev => ({
        ...prev,
        [topic]: response.data.words
      }));
    } catch (err) {
      setError(`Failed to load words for topic: ${topic}`);
      console.error(`Error fetching words for ${topic}:`, err);
    } finally {
      setIsLoadingWords(false);
    }
  };

  // Select or deselect a topic
  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    } else {
      setSelectedTopics(prev => [...prev, topic]);
      if (!topicWords[topic]) {
        fetchTopicWords(topic);
      }
    }
  };

  // Add a custom word to a topic
  const addCustomWord = () => {
    if (!customTopicName.trim()) {
      setError('Please enter a topic name');
      return;
    }
    
    const inputWords = customWordInput.trim().split(/[,\/;]+/);
    const words = inputWords.filter(word => !!word.trim());
    if (words.length === 0) {
      setError('Please enter a word');
      return;
    }
    
    setCustomWords(prev => {
      const existingWords = prev[customTopicName] || [];
      return {
        ...prev,
        [customTopicName]: [...existingWords, ...words]
      };
    });
    
    setCustomWordInput('');
    setError(null);
  };

  // Remove a custom word
  const removeCustomWord = (topic, word) => {
    setCustomWords(prev => {
      const updatedWords = prev[topic].filter(w => w !== word);
      const updatedTopics = { ...prev };
      
      if (updatedWords.length === 0) {
        delete updatedTopics[topic];
      } else {
        updatedTopics[topic] = updatedWords;
      }
      
      return updatedTopics;
    });
  };

  // Handle file upload for words
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const response = await apiService.uploadFile(file);
      onFileUpload(response.data.file_id);
      setSelectionType('file');
      setError(null);
    } catch (err) {
      setError('Failed to upload words file. Please make sure it\'s a valid text file.');
      console.error('Error uploading file:', err);
    }
  };

  // Update parent component with selected words
  useEffect(() => {
    if (selectionType === 'preset' && selectedTopics.length > 0) {
      const selectedWordsPayload = {};
      selectedTopics.forEach(topic => {
        if (topicWords[topic]) {
          selectedWordsPayload[topic] = topicWords[topic];
        }
      });
      
      if (Object.keys(selectedWordsPayload).length > 0) {
        onWordsUpdate(selectedWordsPayload);
      }
    } else if (selectionType === 'custom' && Object.keys(customWords).length > 0) {
      onWordsUpdate(customWords);
    } else if (selectionType === 'file') {
      // File upload is handled separately
    } else {
      onWordsUpdate(null);
    }
  }, [selectedTopics, topicWords, customWords, selectionType, onWordsUpdate]);

  return (
    <div className="word-selector">
      <div className="selection-type-buttons">
        <button 
          className={`btn ${selectionType === 'preset' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectionType('preset')}
        >
          Use Preset Topics
        </button>
        <button 
          className={`btn ${selectionType === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectionType('custom')}
        >
          Add Custom Words
        </button>
        <button 
          className={`btn ${selectionType === 'file' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectionType('file')}
        >
          Upload Word File
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Preset Topics Selection */}
      {selectionType === 'preset' && (
        <div className="preset-topics">
          <h3>Select Topics</h3>
          <div className="topics-grid">
            {topics.map(topic => (
              <div 
                key={topic}
                className={`topic-item ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </div>
            ))}
          </div>

          {isLoadingWords && <p className="loading-text">Loading words...</p>}

          {selectedTopics.length > 0 && (
            <div className="selected-topics">
              <h3>Selected Topics</h3>
              <ul className="topic-list">
                {selectedTopics.map(topic => (
                  <li key={topic}>
                    <div className="topic-header">
                      <strong>{topic}</strong>
                      <button 
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(topic);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    {topicWords[topic] && (
                      <div className="word-chips">
                        {topicWords[topic].map((word, index) => (
                          <span key={index} className="word-chip">{word}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Custom Words Input */}
      {selectionType === 'custom' && (
        <div className="custom-words">
          <h3>Add Your Own Words</h3>
          
          <div className="form-group">
            <label htmlFor="custom-topic">Topic Name</label>
            <input
              type="text"
              id="custom-topic"
              className="form-control"
              placeholder="e.g., Animals, Sports, Geography"
              value={customTopicName}
              onChange={(e) => setCustomTopicName(e.target.value)}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group flex-grow">
              <label htmlFor="custom-word">Word</label>
              <input
                type="text"
                id="custom-word"
                className="form-control"
                placeholder="Enter a word"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomWord()}
              />
            </div>
            <div className="form-group">
              <label htmlFor="add-word">&nbsp;</label>
              <button
                id="add-word"
                className="btn btn-primary form-control"
                onClick={addCustomWord}
              >
                Add Word
              </button>
            </div>
          </div>
          
          {Object.keys(customWords).length > 0 && (
            <div className="custom-topics-list">
              {Object.entries(customWords).map(([topic, words]) => (
                <div key={topic} className="custom-topic-item">
                  <h4>{topic}</h4>
                  <div className="word-chips">
                    {words.map((word, index) => (
                      <span key={index} className="word-chip">
                        {word}
                        <button 
                          className="remove-word-btn"
                          onClick={() => removeCustomWord(topic, word)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      {selectionType === 'file' && (
        <div className="file-upload">
          <h3>Upload Words File</h3>
          <p className="upload-instructions">
            Upload a text file containing your words. The file should have the following format:
          </p>
          <pre className="format-example">
{`>TOPIC NAME
word1
word2
word3
====================
>ANOTHER TOPIC
word1
word2
word3`}
          </pre>
          
          <div className="upload-control">
            <input
              type="file"
              id="words-file"
              accept=".txt"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="words-file" className="file-label btn btn-primary">
              Choose File
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSelector;
