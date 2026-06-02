import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const gridRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const scramble = () => {
      if (!gridRef.current) return;
      const cells = gridRef.current.querySelectorAll(".puzzle-cell");
      cells.forEach((cell) => {
        cell.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      });
    };
    intervalRef.current = setInterval(scramble, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Word Search Generator</div>
            <h1>
              Create Beautiful
              <span className="gradient-text"> Puzzle Books</span>
            </h1>
            <p className="hero-description">
              Generate custom word search puzzles in seconds. Choose from
              pre-made topics, add your own words, and download a print-ready
              PDF — all from your browser.
            </p>
            <div className="hero-buttons">
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Puzzle Book
              </Link>
              <Link to="/play" className="btn btn-outline btn-lg">
                Play Online
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="puzzle-preview" ref={gridRef}>
              <div className="puzzle-grid">
                {Array(8).fill().map((_, ri) => (
                  <div className="puzzle-row" key={ri}>
                    {Array(8).fill().map((_, ci) => (
                      <div className="puzzle-cell" key={ci}>
                        {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="puzzle-word-list">
                <span className="word-chip">PUZZLE</span>
                <span className="word-chip">SEARCH</span>
                <span className="word-chip">WORDS</span>
                <span className="word-chip">BOOP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2>Everything You Need</h2>
            <p className="section-sub">
              Build professional word search puzzle books with ease.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap" style={{ "--accent": "var(--primary)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3>Multiple Topics</h3>
              <p>Choose from a variety of pre-defined topics or create your own custom word lists.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap" style={{ "--accent": "#e67e22" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3>Difficulty Levels</h3>
              <p>Generate puzzles in normal or hard mode with adjustable grid sizes and bonus rounds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap" style={{ "--accent": "#27ae60" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>Customizable</h3>
              <p>Personalize your puzzle book with custom backgrounds, covers, and titles.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap" style={{ "--accent": "#8e44ad" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>PDF Export</h3>
              <p>Download your puzzle book as a print-ready PDF, complete with solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2>Four Simple Steps</h2>
            <p className="section-sub">
              From setup to download in minutes.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-circle">1</div>
              <h3>Configure</h3>
              <p>Set your title, difficulty, and number of puzzles.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">2</div>
              <h3>Choose Words</h3>
              <p>Select topics or enter your own custom words.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">3</div>
              <h3>Customize</h3>
              <p>Upload backgrounds and a cover image.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">4</div>
              <h3>Download</h3>
              <p>Generate and save your puzzle book as PDF.</p>
            </div>
          </div>
          <div className="cta-container">
            <Link to="/create" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
