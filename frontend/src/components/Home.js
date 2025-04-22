import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page word-grid-bg">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Generate Word Search Puzzles <span>with BOOP</span>
            </h1>
            <p className="hero-description">
              Create custom word search puzzles for educational purposes,
              events, or just for fun. Customize difficulty levels, choose from
              various topics, or add your own words.
            </p>
            <div className="hero-buttons">
              <Link to="/create" className="btn btn-primary">
                Create Puzzle
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="puzzle-preview">
              <div className="puzzle-grid">
                {Array(10)
                  .fill()
                  .map((_, rowIndex) => (
                    <div className="puzzle-row" key={rowIndex}>
                      {Array(10)
                        .fill()
                        .map((_, colIndex) => {
                          // Randomly display letters
                          const randomChar = String.fromCharCode(
                            65 + Math.floor(Math.random() * 26)
                          );
                          return (
                            <div className="puzzle-cell" key={colIndex}>
                              {randomChar}
                            </div>
                          );
                        })}
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
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Multiple Topics</h3>
              <p>
                Choose from a variety of pre-defined topics or create your own
                custom word lists.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Difficulty Levels</h3>
              <p>
                Generate puzzles in normal or hard mode with adjustable grid
                sizes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Customizable</h3>
              <p>
                Personalize your puzzle book with custom backgrounds, covers,
                and titles.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>PDF Export</h3>
              <p>
                Download your puzzle book as a PDF, ready for printing or
                sharing digitally.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Your Settings</h3>
              <p>
                Set your book title, difficulty levels, and the number of
                puzzles you want.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Select Words</h3>
              <p>
                Use our pre-defined topics or create your own custom word lists.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Customize Design</h3>
              <p>
                Upload custom backgrounds and cover images to personalize your
                book.
              </p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Generate & Download</h3>
              <p>Create your puzzle book and download it as a PDF file.</p>
            </div>
          </div>

          <div className="cta-container">
            <Link to="/create" className="btn btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
