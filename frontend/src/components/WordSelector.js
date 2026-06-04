import React, { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "../services/api";
import "./WordSelector.css";

const cleanWord = (w) => w.trim().toUpperCase().replace(/[^A-Z]/g, "");

function parseFileText(text) {
  const errors = [];
  const sections = text.split(/={10,}/);
  const topics = {};

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const topicLine = lines[0];
    if (!topicLine.startsWith(">")) {
      errors.push(`Missing topic header (line should start with >): found "${topicLine.slice(0, 40)}"`);
      continue;
    }
    const topic = topicLine.slice(1).trim();
    if (!topic) {
      errors.push("Empty topic name after >");
      continue;
    }

    const words = lines.slice(1).map(cleanWord).filter((w) => w.length >= 2);
    if (words.length === 0) {
      errors.push(`Topic "${topic}" has no valid words (min 2 letters each)`);
      continue;
    }

    if (topics[topic]) {
      topics[topic] = [...new Set([...topics[topic], ...words])];
    } else {
      topics[topic] = words;
    }
  }

  return { topics, errors };
}

const WordSelector = ({ topics, onWordsUpdate }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicWords, setTopicWords] = useState({});
  const [customWords, setCustomWords] = useState({});
  const [customTopicName, setCustomTopicName] = useState("");
  const [customWordInput, setCustomWordInput] = useState("");
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [error, setError] = useState(null);
  const [selectionType, setSelectionType] = useState("preset");

  /* ---- File upload state ---- */
  const [fileTopics, setFileTopics] = useState({});
  const [fileExcluded, setFileExcluded] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [fileUploadedIds, setFileUploadedIds] = useState([]);
  const fileInputRef = useRef(null);

  const fetchTopicWords = useCallback(async (topic) => {
    try {
      setIsLoadingWords(true);
      const response = await apiService.getTopicWords(topic);
      setTopicWords((prev) => ({
        ...prev,
        [topic]: response.data.words,
      }));
    } catch (err) {
      setError(`Failed to load words for topic: ${topic}`);
      console.error(`Error fetching words for ${topic}:`, err);
    } finally {
      setIsLoadingWords(false);
    }
  }, []);

  const toggleTopic = useCallback((topic) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      }
      fetchTopicWords(topic);
      return [...prev, topic];
    });
  }, [fetchTopicWords]);

  const addCustomWord = useCallback(() => {
    if (!customTopicName.trim()) {
      setError("Please enter a topic name");
      return;
    }

    const inputWords = customWordInput.trim().split(/[,/;]+/);
    const words = inputWords.map(cleanWord).filter((w) => w.length >= 2);
    if (words.length === 0) {
      setError("Please enter a word");
      return;
    }

    setCustomWords((prev) => {
      const existingWords = prev[customTopicName] || [];
      return {
        ...prev,
        [customTopicName]: [...existingWords, ...words],
      };
    });

    setCustomWordInput("");
    setError(null);
  }, [customTopicName, customWordInput]);

  const removeCustomWord = useCallback((topic, word) => {
    setCustomWords((prev) => {
      const updatedWords = prev[topic].filter((w) => w !== word);
      const updatedTopics = { ...prev };

      if (updatedWords.length === 0) {
        delete updatedTopics[topic];
      } else {
        updatedTopics[topic] = updatedWords;
      }

      return updatedTopics;
    });
  }, []);

  /* ---- File upload handler ---- */
  const handleFileUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    const newErrors = [];
    let accumulated = { ...fileTopics };

    for (const file of files) {
      try {
        const resp = await apiService.uploadFile(file);
        setFileUploadedIds((prev) => [...prev, resp.data.file_id]);
      } catch {
        newErrors.push(`Failed to upload "${file.name}" to server.`);
        continue;
      }

      const text = await file.text();
      const { topics: parsed, errors: parseErrs } = parseFileText(text);
      newErrors.push(...parseErrs.map((e) => `"${file.name}": ${e}`));

      if (Object.keys(parsed).length === 0) {
        newErrors.push(`"${file.name}" — no valid topics found. Use >TOPIC_NAME header and === separators.`);
        continue;
      }

      for (const [topic, words] of Object.entries(parsed)) {
        if (accumulated[topic]) {
          accumulated[topic] = [...new Set([...accumulated[topic], ...words])];
        } else {
          accumulated[topic] = words;
        }
      }
    }

    setFileErrors(newErrors);
    if (Object.keys(accumulated).length > 0) {
      setFileTopics(accumulated);
      setSelectionType("file");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [fileTopics]);

  const toggleFileWord = useCallback((topic, word) => {
    setFileExcluded((prev) => {
      const excluded = prev[topic] ? new Set(prev[topic]) : new Set();
      if (excluded.has(word)) {
        excluded.delete(word);
      } else {
        excluded.add(word);
      }
      const next = { ...prev, [topic]: [...excluded] };
      if (next[topic].length === 0) delete next[topic];
      return next;
    });
  }, []);

  useEffect(() => {
    if (selectionType === "preset" && selectedTopics.length > 0) {
      const selectedWordsPayload = {};
      selectedTopics.forEach((topic) => {
        if (topicWords[topic]) {
          selectedWordsPayload[topic] = topicWords[topic];
        }
      });
      if (Object.keys(selectedWordsPayload).length > 0) {
        onWordsUpdate(selectedWordsPayload);
      }
    } else if (selectionType === "custom" && Object.keys(customWords).length > 0) {
      onWordsUpdate(customWords);
    } else if (selectionType === "file" && Object.keys(fileTopics).length > 0) {
      const payload = {};
      for (const [topic, words] of Object.entries(fileTopics)) {
        const excluded = fileExcluded[topic] || [];
        const included = words.filter((w) => !excluded.includes(w));
        if (included.length > 0) payload[topic] = included;
      }
      onWordsUpdate(Object.keys(payload).length > 0 ? payload : null);
    } else {
      onWordsUpdate(null);
    }
  }, [selectedTopics, topicWords, customWords, selectionType, onWordsUpdate, fileTopics, fileExcluded]);

  return (
    <div className="word-selector">
      <div className="selection-type-buttons">
        <button
          className={`btn ${selectionType === "preset" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSelectionType("preset")}
        >Use Preset Topics</button>
        <button
          className={`btn ${selectionType === "custom" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSelectionType("custom")}
        >Add Custom Words</button>
        <button
          className={`btn ${selectionType === "file" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSelectionType("file")}
        >Upload Word File</button>
      </div>

      {(error || fileErrors.length > 0) && (
        <div className="alert alert-danger">
          {error}
          {fileErrors.length > 0 && (
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem" }}>
              {fileErrors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}

      {selectionType === "preset" && (
        <div className="preset-topics">
          <h3>Select Topics</h3>
          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                key={topic}
                className={`topic-item ${selectedTopics.includes(topic) ? "selected" : ""}`}
                onClick={() => toggleTopic(topic)}
              >{topic}</div>
            ))}
          </div>
          {isLoadingWords && <p className="loading-text">Loading words...</p>}
          {selectedTopics.length > 0 && (
            <div className="selected-topics">
              <h3>Selected Topics</h3>
              <ul className="topic-list">
                {selectedTopics.map((topic) => (
                  <li key={topic}>
                    <div className="topic-header">
                      <strong>{topic}</strong>
                      <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleTopic(topic); }}>×</button>
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

      {selectionType === "custom" && (
        <div className="custom-words">
          <h3>Add Your Own Words</h3>
          <div className="form-group">
            <label htmlFor="custom-topic">Topic Name</label>
            <input type="text" id="custom-topic" className="form-control"
              placeholder="e.g., Animals, Sports, Geography"
              value={customTopicName} onChange={(e) => setCustomTopicName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group flex-grow">
              <label htmlFor="custom-word">Word</label>
              <input type="text" id="custom-word" className="form-control"
                placeholder="Enter a word" value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomWord()} />
            </div>
            <div className="form-group">
              <button id="add-word" className="btn btn-primary form-control" onClick={addCustomWord}>Add Word</button>
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
                        <button className="remove-word-btn" onClick={() => removeCustomWord(topic, word)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectionType === "file" && (
        <div className="file-upload">
          <h3>Upload Words File</h3>
          <p className="upload-instructions">
            Upload a <code>.txt</code> file with topics and words in this format:
          </p>
          <pre className="format-example">{`>TECHNOLOGY
algorithm
binary
compiler
====================
>ASTRONOMY
asteroid
comet`}</pre>

          <div className="upload-control">
            <input type="file" id="words-file" accept=".txt" multiple
              onChange={handleFileUpload} className="file-input" ref={fileInputRef} />
            <label htmlFor="words-file" className="file-label btn btn-primary">Choose File(s)</label>
          </div>

          {Object.keys(fileTopics).length > 0 && (
            <div className="file-topics-list">
              <h3>Words from file{fileUploadedIds.length > 1 ? "s" : ""}</h3>
              {Object.entries(fileTopics).map(([topic, words]) => {
                const excluded = fileExcluded[topic] || [];
                const included = words.filter((w) => !excluded.includes(w));
                return (
                  <div key={topic} className="custom-topic-item">
                    <h4>{topic} <span className="text-secondary" style={{ fontSize: "0.8rem", fontWeight: 400 }}>({included.length}/{words.length} selected)</span></h4>
                    <div className="word-chips">
                      {words.map((word, i) => {
                        const isExcluded = excluded.includes(word);
                        return (
                          <span key={i}
                            className={`word-chip${isExcluded ? " excluded" : ""}`}
                            onClick={() => toggleFileWord(topic, word)}>
                            {word}
                            {isExcluded ? " ✕" : " ✓"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="pg-word-count" style={{ marginTop: "0.75rem" }}>
                Total: {Object.values(fileTopics).reduce((s, w) => s + w.length, 0)} words
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(WordSelector);
