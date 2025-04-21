import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { apiService } from './services/api';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PuzzleCreator from './components/PuzzleCreator';
import About from './components/About';
import GenerationStatus from './components/GenerationStatus';

// Context
import { GenerationProvider } from './context/GenerationContext';

function App() {
  useEffect(() => {
    apiService.checkStatus().catch(err => console.error('Wake-up API failed:', err));
  }, []);

  return (
    <GenerationProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<PuzzleCreator />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <GenerationStatus />
        </div>
      </Router>
    </GenerationProvider>
  );
}

export default App;
