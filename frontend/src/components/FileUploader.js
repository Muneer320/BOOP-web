import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import "./FileUploader.css";

const FileUploader = ({
  label,
  accept,
  onFileUploaded,
  description,
  hasDefaultOption = false,
  defaultFile = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [useDefault, setUseDefault] = useState(hasDefaultOption);

  // apply defaultFile on mount or when toggled on
  useEffect(() => {
    if (useDefault) {
      // apply UI default display, but send null id for backend
      onFileUploaded(null);
      setFileName(defaultFile);
      setIsUploaded(true);
    }
  }, [useDefault]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFileName(file.name);
      setError(null);
      setUseDefault(false);

      const response = await apiService.uploadFile(file);
      const fileId = response.data.file_id;

      // Pass the file ID to the parent component
      onFileUploaded(fileId);
      setIsUploaded(true);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDefaultToggle = () => {
    setUseDefault((prev) => {
      const newVal = !prev;
      if (!newVal) {
        // disable default
        onFileUploaded(null);
        setFileName("");
        setIsUploaded(false);
      }
      return newVal;
    });
  };

  return (
    <div className={`file-uploader ${isUploaded ? "uploaded" : ""}`}>
      <h4>{label}</h4>
      {description && <p className="uploader-description">{description}</p>}

      {hasDefaultOption && (
        <div className="default-option">
          <label className="toggle-container">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={handleDefaultToggle}
              className="toggle-input"
            />
            <span className="toggle-label">
              Use default {label.toLowerCase()}
            </span>
          </label>
        </div>
      )}

      <div className={`upload-area ${useDefault ? "disabled" : ""}`}>
        <input
          type="file"
          id={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
          accept={accept}
          onChange={handleFileChange}
          className="file-input"
          disabled={isUploading || useDefault}
        />

        <label
          htmlFor={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className={`file-label ${isUploading ? "uploading" : ""} ${
            useDefault ? "disabled" : ""
          }`}
        >
          {isUploading ? (
            "Uploading..."
          ) : isUploaded ? (
            <span className="uploaded-text">✓ {fileName}</span>
          ) : useDefault ? (
            `Using ${defaultFile}`
          ) : (
            "Choose File"
          )}
        </label>
      </div>

      <p className="file-name">{fileName || defaultFile}</p>

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
};

export default FileUploader;
