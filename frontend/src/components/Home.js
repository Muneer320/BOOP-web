import React from "react";
import { Link } from "react-router-dom";
import HeroLetterGrid from "./HeroLetterGrid";
import "./Home.css";

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

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <HeroLetterGrid />
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
