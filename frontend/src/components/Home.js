import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const features = [
  {
    icon: "book",
    title: "Preset Topics",
    desc: "Choose from a library of curated word lists covering animals, geography, science, and more.",
  },
  {
    icon: "grid",
    title: "6 Difficulty Levels",
    desc: "Easy through Nightmare, plus Bonus circular grids. Play online or add to your book.",
  },
  {
    icon: "pencil",
    title: "Custom Words",
    desc: "Add your own words, upload a file, or type directly to build a bespoke puzzle.",
  },
  {
    icon: "download",
    title: "PDF Export",
    desc: "Download a print-ready PDF with puzzles, solutions, table of contents, and cover.",
  },
  {
    icon: "play",
    title: "Play Online",
    desc: "Solve puzzles directly in your browser with timer, hints, touch support, and shareable results.",
  },
];

const HERO_GRIDS = [
  {
    words: ["CAT", "DOG", "FISH", "BEAR", "FROG", "BIRD"],
    grid: [
      ["C","A","T","X","B","Y"],
      ["D","O","G","W","I","R"],
      ["F","I","S","H","R","D"],
      ["B","E","A","R","F","C"],
      ["F","R","O","G","G","O"],
      ["Z","X","Y","V","W","U"],
    ],
    label: "Animal Word Search",
  },
  {
    words: ["RIVER", "OCEAN", "FOREST", "DESERT", "VALLEY", "PEAK"],
    grid: [
      ["R","I","V","E","R","X"],
      ["O","C","E","A","N","Y"],
      ["F","O","R","E","S","T"],
      ["D","E","S","E","R","T"],
      ["V","A","L","L","E","Y"],
      ["P","E","A","K","Z","W"],
    ],
    label: "Geography Word Search",
  },
  {
    words: ["WORD", "SEARCH", "FIND", "HUNT", "SOLVE", "BOOK"],
    grid: [
      ["W","O","R","D","X","Y"],
      ["S","E","A","R","C","H"],
      ["F","I","N","D","Z","W"],
      ["H","U","N","T","U","V"],
      ["S","O","L","V","E","T"],
      ["B","O","O","K","R","Q"],
    ],
    label: "Puzzle Word Search",
  },
  {
    words: ["ATOM", "CELL", "GENE", "PROTON", "STATE", "ORBIT"],
    grid: [
      ["A","T","O","M","X","Y"],
      ["C","E","L","L","Z","W"],
      ["G","E","N","E","U","V"],
      ["P","R","O","T","O","N"],
      ["S","T","A","T","E","U"],
      ["O","R","B","I","T","W"],
    ],
    label: "Science Word Search",
  },
  {
    words: ["STAR", "MOON", "MARS", "VENUS", "ORBIT", "COMET"],
    grid: [
      ["S","T","A","R","X","Y"],
      ["M","O","O","N","Z","W"],
      ["M","A","R","S","X","Y"],
      ["V","E","N","U","S","Z"],
      ["O","R","B","I","T","W"],
      ["C","O","M","E","T","V"],
    ],
    label: "Space Word Search",
  },
  {
    words: ["BLUE", "RED", "GREEN", "GOLD", "PINK", "BROWN"],
    grid: [
      ["B","L","U","E","X","Y"],
      ["R","E","D","Z","W","V"],
      ["G","R","E","E","N","F"],
      ["G","O","L","D","Z","Y"],
      ["P","I","N","K","X","W"],
      ["B","R","O","W","N","U"],
    ],
    label: "Colors Word Search",
  },
  {
    words: ["DOVE", "HAWK", "SWAN", "OWL", "WREN", "JAY"],
    grid: [
      ["D","O","V","E","X","J"],
      ["H","A","W","K","Y","A"],
      ["S","W","A","N","Z","Y"],
      ["O","W","L","U","V","W"],
      ["W","R","E","N","T","S"],
      ["J","A","Y","Z","X","W"],
    ],
    label: "Birds Word Search",
  },
  {
    words: ["SUNNY", "RAIN", "SNOW", "WIND", "HAIL", "FOG"],
    grid: [
      ["S","U","N","N","Y","X"],
      ["R","A","I","N","Z","W"],
      ["S","N","O","W","Y","V"],
      ["W","I","N","D","U","T"],
      ["H","A","I","L","Z","S"],
      ["F","O","G","X","W","V"],
    ],
    label: "Weather Word Search",
  },
];

const FeatureIcon = ({ name }) => {
  const icons = {
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    grid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    pencil: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    play: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  };
  return <span className="feature-icon">{icons[name] || icons.book}</span>;
};

const pickGrid = () => {
  const idx = parseInt(sessionStorage.getItem("heroGridIdx") || "0", 10);
  const next = (idx + 1) % HERO_GRIDS.length;
  sessionStorage.setItem("heroGridIdx", String(next));
  return HERO_GRIDS[idx];
};

const getInkColor = () => {
  if (typeof document === "undefined") return "44, 24, 16";
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  return isDark ? "226, 216, 200" : "44, 24, 16";
};

const prefersReduced = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const Home = () => {
  const canvasRef = useRef(null);
  const book = pickGrid();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let rgb = getInkColor();
    const reduced = prefersReduced();

    const observer = new MutationObserver(() => { rgb = getInkColor(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const COLS = 40;
    const ROWS = 18;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        char: letters[Math.floor(Math.random() * 26)],
        opacity: Math.random() * 0.07 + 0.03,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      }))
    );

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cellW = canvas.width / COLS;
      const cellH = canvas.height / ROWS;

      grid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          const flicker = reduced ? 0.05 : (Math.sin(time * cell.speed + cell.phase) * 0.04 + 0.05);
          ctx.fillStyle = `rgba(${rgb}, ${flicker})`;
          ctx.font = `${Math.min(cellW, cellH) * 0.65}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell.char, ci * cellW + cellW / 2, ri * cellH + cellH / 2);
        });
      });

      if (!reduced) animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      <canvas ref={canvasRef} className="page-letter-canvas" aria-hidden="true" />
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Puzzle Book Maker</div>
            <h1>
              <span className="hero-headline">From Word Lists</span>
              <span className="hero-headline-accent">to Beautiful Books.</span>
            </h1>
            <p className="hero-description">
              Turn any word list into a professionally printed puzzle book —
              in minutes, not hours. Choose from preset topics, add your own words,
              and download a print-ready PDF.
            </p>
            <div className="hero-buttons">
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Your First Book
              </Link>
              <Link to="/play" className="btn btn-outline btn-lg">
                Play Online
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="book-mockup">
              <div className="book-spine" />
              <div className="book-cover">
                <div className="book-cover-content">
                  <span className="book-cover-label">PUZZLE BOOK</span>
                  <span className="book-cover-title">{book.label}</span>
                  <span className="book-cover-divider" />
                  <span className="book-cover-subtitle">Word Search</span>
                  <div className="book-cover-grid">
                    {Array.from({ length: 16 }, (_, i) => (
                      <span key={i} className="cover-cell">
                        {LETTERS[Math.floor(Math.random() * 26)]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="book-page page-1">
                <div className="book-page-grid">
                  {book.grid.map((row, ri) =>
                    row.map((cell, ci) => (
                      <span key={`${ri}-${ci}`} className="page-cell">{cell}</span>
                    ))
                  )}
                </div>
                <div className="book-page-words">
                  {book.words.map((w, i) => (
                    <span key={w} className="book-page-word">
                      <span className="bpw-bullet" />
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div className="book-page page-2">
                <div className="book-page-grid">
                  {book.grid.map((row, ri) =>
                    row.map((cell, ci) => (
                      <span key={`${ri}-${ci}`} className="page-cell">{cell}</span>
                    ))
                  )}
                </div>
                <div className="book-page-words">
                  {book.words.map((w, i) => (
                    <span key={w} className="book-page-word">
                      <span className="bpw-bullet" />
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="social-proof">
        <div className="container">
          <p className="social-proof-text">
            Used by teachers, parents, and publishers to create beautiful puzzle books.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-heading">
            <span className="heading-ornament">&#10022;</span>
            Everything You Need
            <span className="heading-ornament">&#10022;</span>
          </h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <FeatureIcon name={f.icon} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
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
              <p>Set your book title, number of puzzles, and difficulty level.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">2</div>
              <h3>Choose Words</h3>
              <p>Pick from preset topics or type your own custom words.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">3</div>
              <h3>Customize</h3>
              <p>Upload a cover and backgrounds to personalise your book.</p>
            </div>
            <div className="step-connector" />
            <div className="step">
              <div className="step-circle">4</div>
              <h3>Download</h3>
              <p>Generate and download your complete puzzle book as a print-ready PDF.</p>
            </div>
          </div>
          <div className="cta-container">
            <Link to="/create" className="btn btn-primary btn-lg">
              Create Your First Book &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
