import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header word-grid-bg">
          <h1>About BOOP</h1>
          <p className="lead">The story behind our word search puzzle generator</p>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h2>What is BOOP?</h2>
            <p>
              BOOP (Book Of Organized Puzzles) is a word search puzzle generator originally developed as a command-line tool. 
              It allows users to create custom word search puzzles with different difficulty levels, 
              topics, and configurations. Now available as a web application, BOOP makes puzzle 
              creation accessible to everyone without requiring technical knowledge.
            </p>
          </div>
          
          <div className="about-section">
            <h2>How It Works</h2>
            <p>
              BOOP uses sophisticated algorithms to place words in a grid in various directions. Words can be 
              placed horizontally, vertically, diagonally, and even backwards (in harder difficulty levels). 
              The remaining spaces are filled with random letters to complete the puzzle.
            </p>
            <p>
              You can customize your puzzle book by:
            </p>
            <ul>
              <li>Selecting topics or providing your own words</li>
              <li>Choosing difficulty levels (Normal or Hard)</li>
              <li>Setting the number of puzzles for each difficulty</li>
              <li>Adding bonus puzzles</li>
              <li>Customizing the appearance with your own images</li>
            </ul>
          </div>
          
          <div className="about-section">
            <h2>From CLI to Web</h2>
            <p>
              BOOP was originally developed as a command-line interface (CLI) tool, which made it 
              primarily accessible to technically-minded users. Recognizing that word puzzles should be 
              available to everyone, we've developed this web-based version to make puzzle creation as 
              simple as a few clicks.
            </p>
          </div>
          
          <div className="about-section">
            <h2>Technology</h2>
            <p>
              The BOOP web application consists of:
            </p>
            <ul>
              <li>A Python backend using FastAPI</li>
              <li>A React frontend for the user interface</li>
              <li>PDF generation for puzzle books</li>
              <li>SVG rendering for clean, scalable puzzles</li>
            </ul>
          </div>
        </div>
        
        <div className="cta-container">
          <h3>Ready to create your own word search puzzles?</h3>
          <Link to="/create" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
