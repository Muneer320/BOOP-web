import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="not-found-page">
    <div className="not-found-box">
      <div className="not-found-grid" aria-hidden="true">
        {"WORDSWORDSWORDS".split("").map((c, i) => (
          <span key={i} className="not-found-cell" style={{ opacity: Math.random() * 0.15 + 0.05 }}>
            {c}
          </span>
        ))}
      </div>
      <h1 className="not-found-404">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-text">The page you are looking for does not exist.</p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/create" className="btn btn-outline">Create Puzzle</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
