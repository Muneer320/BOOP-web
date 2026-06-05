import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Examples.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const genGrid = () =>
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => LETTERS[Math.floor(Math.random() * 26)])
  );

const SAMPLE_BOOKS = [
  {
    id: "animals",
    title: "Animal Word Search",
    desc: "Easy 10×10 puzzles featuring animal names. Perfect for children and beginners.",
    difficulty: "Easy",
    pages: 16,
    words: ["CAT", "DOG", "FISH", "BIRD", "FROG", "BEAR", "WOLF", "DEER"],
    color: "#3D6B3D",
  },
  {
    id: "geography",
    title: "Geography Challenge",
    desc: "Medium 13×13 puzzles with country and capital names. For puzzle enthusiasts.",
    difficulty: "Medium",
    pages: 24,
    words: ["FRANCE", "JAPAN", "BRAZIL", "INDIA", "EGYPT", "CHILE", "KENYA", "TONGA"],
    color: "#C49464",
  },
  {
    id: "science",
    title: "Science & Nature",
    desc: "Hard 15×15 puzzles with scientific terms. For experienced solvers.",
    difficulty: "Hard",
    pages: 20,
    words: ["ATOM", "CELL", "GENE", "PROTON", "NEUTRON", "MOLECULE", "ORBIT", "PLASMA"],
    color: "#8B3A3A",
  },
  {
    id: "mixed",
    title: "Mixed Difficulty Book",
    desc: "A curated collection combining easy, medium, and hard puzzles with bonus rounds.",
    difficulty: "Mixed",
    pages: 40,
    words: ["CLOUD", "STORM", "RIVER", "OCEAN", "FOREST", "DESERT", "VALLEY", "PEAK"],
    color: "#4A6FA5",
  },
];

const BookFlipViewer = ({ book }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;

  const pages = [
    { type: "cover" },
    ...Array.from({ length: 5 }, (_, i) => ({
      type: "puzzle",
      grid: genGrid(),
      num: i + 1,
    })),
  ];

  const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));

  return (
    <div className="flip-viewer">
      <div className="flip-book-wrapper">
        <div className="flip-book" style={{ "--flip-rotation": `${currentPage > 0 ? "-5" : "0"}deg` }}>
          <div className="flip-spine" />
          {pages.map((page, i) => {
            const isVisible = i === currentPage;
            const isLeft = i < currentPage;
            if (!isVisible && !isLeft) return null;
            return (
              <div
                key={i}
                className={`flip-page ${isLeft ? "flipped" : ""} ${isVisible ? "visible" : ""}`}
                style={{
                  zIndex: totalPages - i,
                  transform: isLeft
                    ? "rotateY(-180deg)"
                    : i === currentPage
                    ? "rotateY(0deg)"
                    : "rotateY(0deg)",
                }}
              >
                {page.type === "cover" ? (
                  <div className="flip-cover" style={{ background: book.color }}>
                    <div className="flip-cover-content">
                      <span className="flip-cover-label">PUZZLE BOOK</span>
                      <span className="flip-cover-title">{book.title}</span>
                      <span className="flip-cover-divider" />
                      <span className="flip-cover-subtitle">Word Search</span>
                      <div className="flip-cover-grid">
                        {Array.from({ length: 16 }, (_, i) => (
                          <span key={i} className="flip-cover-cell">
                            {LETTERS[Math.floor(Math.random() * 26)]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flip-puzzle-page">
                    <div className="flip-page-header">
                      <span className="flip-page-num">#{page.num}</span>
                      <span className="flip-page-label">Word Search</span>
                    </div>
                    <svg viewBox="0 0 236 236" className="flip-svg">
                      {page.grid.map((row, ri) =>
                        row.map((cell, ci) => (
                          <g key={`${ri}-${ci}`}>
                            <rect
                              x={ci * 28 + 10}
                              y={ri * 28 + 10}
                              width={24}
                              height={24}
                              fill={(ri + ci) % 2 === 0 ? "#FAF6EF" : "#FDFAF5"}
                              stroke="#D4C9B8"
                              strokeWidth="0.5"
                              rx="1"
                            />
                            <text
                              x={ci * 28 + 22}
                              y={ri * 28 + 27}
                              textAnchor="middle"
                              fontSize="10"
                              fill="#2C1810"
                              fontFamily="JetBrains Mono, monospace"
                              dominantBaseline="central"
                            >
                              {cell}
                            </text>
                          </g>
                        ))
                      )}
                    </svg>
                    <div className="flip-words">
                      <span className="flip-words-label">Find:</span>
                      {book.words.slice(0, 4).join(", ")}
                      <span className="flip-words-more">+{book.words.length - 4} more</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flip-nav">
        <button className="flip-nav-btn" onClick={goPrev} disabled={currentPage === 0}>
          &larr; Previous
        </button>
        <span className="flip-nav-text">
          {pages[currentPage]?.type === "cover" ? "Cover" : `Page ${pages[currentPage]?.num}`}
          <span className="flip-nav-total"> / {totalPages}</span>
        </span>
        <button className="flip-nav-btn" onClick={goNext} disabled={currentPage === totalPages - 1}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

const Examples = () => {
  const [activeBook, setActiveBook] = useState(SAMPLE_BOOKS[0]);

  return (
    <div className="examples-page">
      <div className="container">
        <div className="examples-header">
          <h1>Example Puzzle Books</h1>
          <p className="examples-subtitle">
            See what BOOP can create. Browse sample books across different
            difficulties and themes — all generated with a few clicks.
          </p>
        </div>

        <div className="examples-selector">
          {SAMPLE_BOOKS.map((book) => (
            <button
              key={book.id}
              className={`example-tab ${activeBook.id === book.id ? "active" : ""}`}
              onClick={() => setActiveBook(book)}
            >
              <span className="example-tab-color" style={{ background: book.color }} />
              <span className="example-tab-info">
                <span className="example-tab-title">{book.title}</span>
                <span className="example-tab-diff">{book.difficulty}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="examples-layout">
          <div className="examples-viewer">
            <BookFlipViewer key={activeBook.id} book={activeBook} />
          </div>
          <div className="examples-info">
            <h2 className="examples-book-title">{activeBook.title}</h2>
            <span className="examples-diff-badge" style={{ background: activeBook.color }}>
              {activeBook.difficulty}
            </span>
            <p className="examples-book-desc">{activeBook.desc}</p>
            <div className="examples-specs">
              <div className="examples-spec">
                <span className="spec-value">{activeBook.pages}</span>
                <span className="spec-label">Pages</span>
              </div>
              <div className="examples-spec">
                <span className="spec-value">{activeBook.words.length}</span>
                <span className="spec-label">Sample Words</span>
              </div>
              <div className="examples-spec">
                <span className="spec-value">8×8</span>
                <span className="spec-label">Grid</span>
              </div>
            </div>
            <div className="examples-cta">
              <p>Ready to create your own puzzle book?</p>
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Your Book
              </Link>
            </div>
          </div>
        </div>

        <section className="examples-types">
          <h2 className="section-heading">
            <span className="heading-ornament">&#10022;</span>
            What You Can Create
            <span className="heading-ornament">&#10022;</span>
          </h2>
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Single Theme Books</h3>
              <p>All puzzles on one topic — animals, geography, science, holidays, and more. Perfect for classrooms and events.</p>
            </div>
            <div className="type-card">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <h3>Mixed Difficulty</h3>
              <p>Combine easy, normal, hard, and bonus puzzles in a single book. Progressive challenge keeps solvers engaged.</p>
            </div>
            <div className="type-card">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3>Custom Word Books</h3>
              <p>Upload your own word list or type directly. Perfect for spelling lists, vocabulary practice, or themed events.</p>
            </div>
            <div className="type-card">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              <h3>Bonus Round Books</h3>
              <p>Include circular grid puzzles as bonus content. Unique puzzle shapes add variety and surprise to any book.</p>
            </div>
          </div>
        </section>

        <div className="examples-bottom-cta">
          <h3>Start creating your own puzzle book in minutes</h3>
          <div className="hero-buttons" style={{ justifyContent: "center" }}>
            <Link to="/create" className="btn btn-primary btn-lg">
              Create Your First Book
            </Link>
            <Link to="/play" className="btn btn-outline btn-lg">
              Play Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examples;
