import React from "react";
import "./Tooltip.css";

const Tooltip = ({ text, children }) => {
  return (
    <span className="tooltip-wrapper">
      {children}
      <span className="tooltip-icon" tabIndex="0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className="tooltip-text">{text}</span>
      </span>
    </span>
  );
};

export default Tooltip;
