import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${menuOpen ? "expanded" : ""}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src={logo} alt="BOOP logo" className="logo-image" />
              <div className="logo-text-block">
                <h1 className="logo-text">BOOP Web</h1>
                <span className="tagline">Word Search Generator</span>
              </div>
            </Link>
          </div>

          {/* Hamburger menu button - visible only on mobile */}
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={`menu-icon ${menuOpen ? "open" : ""}`}></span>
          </button>

          {/* Desktop navigation - always visible on desktop, toggled on mobile */}
          <nav className={`nav ${menuOpen ? "visible" : ""}`}>
            <ul className="main-nav-list">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" onClick={() => setMenuOpen(false)}>
                  Create Puzzle
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
              </li>
            </ul>

            {/* Footer links - only visible on mobile when menu is expanded */}
            <div className="footer-links">
              <ul>
                <li>
                  <a
                    href="https://github.com/muneer320/boop-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setMenuOpen(false)}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setMenuOpen(false)}>
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
