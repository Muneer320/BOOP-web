import React, { useState, useRef } from "react";
import "./BookViewer.css";

const BookViewer = ({ pdfUrl, coverUrl, title }) => {
  const [showPdf, setShowPdf] = useState(false);
  const iframeRef = useRef(null);

  const handleOpen = () => {
    setShowPdf(true);
  };

  const handleClose = () => {
    setShowPdf(false);
  };

  return (
    <div className="book-viewer">
      {!showPdf ? (
        <div className="book-closed" onClick={handleOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") handleOpen(); }}>
          <div className="book-cover-display">
            <img src={coverUrl} alt={`${title} cover`} className="book-cover-img" onError={(e) => { e.target.style.display = "none"; }} />
            <div className="book-cover-overlay">
              <svg viewBox="0 0 40 40" className="book-open-icon" width="40" height="40">
                <rect x="4" y="8" width="32" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="23" y1="17" x2="26" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Open Book</span>
            </div>
          </div>
          <div className="book-spine"></div>
          <div className="book-pages-shadow"></div>
        </div>
      ) : (
        <div className="book-open">
          <div className="book-toolbar">
            <button className="book-close-btn" onClick={handleClose} aria-label="Close book">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="book-title-bar">{title}</span>
            <a href={pdfUrl} download className="book-download-btn" title="Download PDF">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 18v1a2 2 0 002 2h10a2 2 0 002-2v-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
          <div className="book-pages">
            <div className="book-page-left">
              <div className="book-page-inner">
                <iframe
                  ref={iframeRef}
                  src={pdfUrl}
                  title={title}
                  className="book-pdf-iframe"
                  onError={() => {}}
                />
              </div>
            </div>
            <div className="book-page-divider"></div>
            <div className="book-page-right">
              <div className="book-page-inner">
                <iframe
                  src={pdfUrl}
                  title={title}
                  className="book-pdf-iframe"
                  onError={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookViewer;
