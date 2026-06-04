import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path ? "active" : "";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${menuOpen ? "expanded" : ""}`} ref={headerRef}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src={logo} alt="BOOP logo" className="logo-image" />
              <div className="logo-text-block">
                <h1 className="logo-text">BOOP</h1>
                <span className="tagline">Puzzle Book Maker</span>
              </div>
            </Link>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}>
            <span className={`menu-icon ${menuOpen ? "open" : ""}`}></span>
          </button>

          <nav className={`nav ${menuOpen ? "visible" : ""}`} aria-label="Main navigation">
            <ul className="main-nav-list">
              <li>
                <Link to="/create" className={isActive("/create")} onClick={() => setMenuOpen(false)}>
                  Create
                </Link>
              </li>
              <li>
                <Link to="/play" className={isActive("/play")} onClick={() => setMenuOpen(false)}>
                  Play
                </Link>
              </li>
              <li>
                <Link to="/templates" className={isActive("/templates")} onClick={() => setMenuOpen(false)}>
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/about" className={isActive("/about")} onClick={() => setMenuOpen(false)}>
                  About
                </Link>
              </li>
            </ul>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
