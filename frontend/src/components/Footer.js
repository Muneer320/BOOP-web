import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">BOOP</h3>
            <p className="footer-tagline">Puzzle Book Maker</p>
            <p className="footer-desc">
              Turn any word list into a beautifully printed puzzle book.
            </p>
          </div>
          <div className="footer-nav">
            <h4 className="footer-heading">Create</h4>
            <Link to="/create" className="footer-link">Puzzle Book</Link>
            <Link to="/play" className="footer-link">Play Online</Link>
            <Link to="/examples" className="footer-link">Examples</Link>
          </div>
          <div className="footer-nav">
            <h4 className="footer-heading">About</h4>
            <Link to="/about" className="footer-link">About BOOP</Link>
            <a href="https://github.com/muneer320/boop-web"
              target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
          </div>
          <div className="footer-nav">
            <h4 className="footer-heading">Legal</h4>
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} BOOP. Open source puzzle book creator.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
