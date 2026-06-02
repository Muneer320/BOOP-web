import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { apiService } from "./services/api";

import Header from "./components/Header";
import Footer from "./components/Footer";
import GenerationStatus from "./components/GenerationStatus";

import { GenerationProvider } from "./context/GenerationContext";

const Home = lazy(() => import("./components/Home"));
const PuzzleCreator = lazy(() => import("./components/PuzzleCreator"));
const About = lazy(() => import("./components/About"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));

function App() {
  useEffect(() => {
    apiService
      .checkStatus()
      .catch((err) => console.error("Wake-up API failed:", err));
  }, []);

  return (
    <GenerationProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Suspense fallback={
              <div className="loading-indicator">
                <div className="spinner"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<PuzzleCreator />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <GenerationStatus />
        </div>
      </Router>
    </GenerationProvider>
  );
}

export default App;
