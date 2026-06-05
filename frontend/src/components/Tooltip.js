import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const iconRef = useRef(null);

  const updatePos = useCallback(() => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    setPos({
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
    });
  }, []);

  const show = useCallback(() => {
    updatePos();
    setVisible(true);
  }, [updatePos]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onScroll = () => updatePos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [visible, updatePos]);

  return (
    <span className="tooltip-wrapper">
      {children}
      <span className="tooltip-icon" ref={iconRef} tabIndex="0"
        onMouseEnter={show} onMouseLeave={hide}
        onFocus={show} onBlur={hide}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
      {visible && createPortal(
        <div className="tooltip-portal" style={{ left: pos.left, top: pos.top }}>
          <div className="tooltip-text">{text}</div>
        </div>,
        document.body
      )}
    </span>
  );
};

export default Tooltip;
