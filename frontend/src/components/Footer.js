import React from "react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {currentYear} BOOP Word Search Generator. All rights reserved.
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/muneer320/boop-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="divider">|</span>
          <a href="/privacy-policy">Privacy Policy</a>
          <span className="divider">|</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
