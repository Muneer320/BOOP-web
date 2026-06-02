import React, { useState, useEffect, useRef } from "react";
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
  const [previewUrl, setPreviewUrl] = useState(null);
  const onFileUploadedRef = useRef(onFileUploaded);
  useEffect(() => { onFileUploadedRef.current = onFileUploaded; });

  useEffect(() => {
    if (useDefault) {
      onFileUploadedRef.current(null);
      setFileName(defaultFile);
      setIsUploaded(true);
      setPreviewUrl(null);
    }
  }, [useDefault, defaultFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    try {
      setIsUploading(true);
      setFileName(file.name);
      setError(null);
      setUseDefault(false);

      const response = await apiService.uploadFile(file);
      const fileId = response.data.file_id;

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

      {previewUrl && (
        <div className="upload-preview">
          <img src={previewUrl} alt="Preview" className="upload-thumbnail" />
        </div>
      )}

      <p className="file-name">{fileName || defaultFile}</p>

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
};

export default React.memo(FileUploader);
