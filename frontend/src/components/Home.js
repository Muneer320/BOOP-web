import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Word Search Generator</div>
            <h1>
              <span className="masthead-main">BOOP</span>
              <span className="masthead-sub">Puzzle Book Maker</span>
            </h1>
            <p className="hero-description">
              Create custom word search puzzle books for education, events, or
              just for fun &mdash; or jump straight in and play online right now.
              Choose from preset topics, add your own words, and either generate a
              print-ready PDF, or solve it on the go.
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
            <div className="puzzle-preview">
              <div className="puzzle-grid">
                {Array(10).fill().map((_, ri) => (
                  <div className="puzzle-row" key={ri}>
                    {Array(10).fill().map((_, ci) => (
                      <div className="puzzle-cell" key={ci}>
                        {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="puzzle-word-list">
                <h3>Find these words:</h3>
                <ul>
                  <li>PUZZLE</li>
                  <li>SEARCH</li>
                  <li>WORDS</li>
                  <li>BOOP</li>
                  <li>FIND</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="newspaper-divider" />

      <section className="features-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="heading-ornament">&#10022;</span>
            Features
            <span className="heading-ornament">&#10022;</span>
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3>Preset Topics</h3>
              <p>Choose from a library of curated word lists covering a wide range of themes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3>6 Difficulty Levels</h3>
              <p>Easy through Nightmare, plus Bonus circular grids. Play online or add to your book.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="8" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3>Custom Words</h3>
              <p>Add your own words, upload a file, or type directly to build a bespoke puzzle.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>PDF Export</h3>
              <p>Download a print-ready PDF including puzzles, solutions, and a table of contents.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <h3>Play Online</h3>
              <p>Solve puzzles directly in your browser with timer, hints, touch support, and shareable results.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="newspaper-divider" />

      <section className="how-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="heading-ornament">&#10022;</span>
            How It Works
            <span className="heading-ornament">&#10022;</span>
          </h2>
          <div className="steps">
            <div className="step">
              <div className="step-circle">1</div>
              <h3>Configure</h3>
              <p>Set your book title, number of puzzles, and difficulty levels.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">2</div>
              <h3>Select Words</h3>
              <p>Pick from preset topics or enter your own custom words.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">3</div>
              <h3>Customize</h3>
              <p>Upload backgrounds and a cover image to personalise your book.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">4</div>
              <h3>Download</h3>
              <p>Generate and download your complete puzzle book as a PDF, or play it online instantly.</p>
            </div>
          </div>
          <div className="cta-container">
            <Link to="/create" className="btn btn-primary btn-lg">
              Get Started &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
