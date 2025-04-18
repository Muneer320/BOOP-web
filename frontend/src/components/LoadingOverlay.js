import React, { useState, useEffect } from 'react';
import './LoadingOverlay.css';

const GRID_SIZE = 4;
const QUOTES = [
  "Keep calm and find the word!",
  "Puzzling out loud!",
  "Hang tight, letters are dancing!",
  "This is just a letter party!",
  "Almost there, keep your eyes peeled!"
];

const LoadingOverlay = ({ text }) => {
  const [grid, setGrid] = useState([]);
  const [quote, setQuote] = useState('');

  const genGrid = () => Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );

  useEffect(() => {
    setGrid(genGrid());
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const interval = setInterval(() => {
      setGrid(genGrid());
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="grid-spinner">
          {grid.map((letter, i) => {
            const randomDelay = (Math.random() * 1).toFixed(2);
            const randomDuration = (2 + Math.random() * 1).toFixed(2);
            return (
              <div
                key={i}
                className="grid-cell"
                style={{ animationDelay: `${randomDelay}s`, animationDuration: `${randomDuration}s` }}
              >{letter}</div>
            );
          })}
        </div>
        <p className="loading-text">{text}</p>
        <p className="loading-quote">{quote}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
