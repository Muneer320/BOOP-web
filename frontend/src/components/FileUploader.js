import React, { useState } from 'react';
import { apiService } from '../services/api';
import './FileUploader.css';

const FileUploader = ({ label, accept, onFileUploaded, description }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFileName(file.name);
      setError(null);
      
      const response = await apiService.uploadFile(file);
      const fileId = response.data.file_id;
      
      // Pass the file ID to the parent component
      onFileUploaded(fileId);
      setIsUploaded(true);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`file-uploader ${isUploaded ? 'uploaded' : ''}`}>
      <h4>{label}</h4>
      {description && <p className="uploader-description">{description}</p>}
      
      <div className="upload-area">
        <input
          type="file"
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          accept={accept}
          onChange={handleFileChange}
          className="file-input"
          disabled={isUploading}
        />
        
        <label 
          htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`file-label ${isUploading ? 'uploading' : ''}`}
        >
          {isUploading ? 'Uploading...' : 
           isUploaded ? 
           <span className="uploaded-text">✓ {fileName}</span> : 
           'Choose File'}
        </label>
      </div>
      
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
};

export default FileUploader;
