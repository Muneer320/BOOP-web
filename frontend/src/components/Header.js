import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
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
          <nav className="nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create Puzzle</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
