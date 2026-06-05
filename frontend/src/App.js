import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import { apiService } from "./services/api";

import Header from "./components/Header";
import Footer from "./components/Footer";
import GenerationStatus from "./components/GenerationStatus";
import NotFound from "./components/NotFound";

import { GenerationProvider } from "./context/GenerationContext";
import { ThemeProvider } from "./context/ThemeContext";

const Home = lazy(() => import("./components/Home"));
const PuzzleCreator = lazy(() => import("./components/PuzzleCreator"));
const About = lazy(() => import("./components/About"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));
const PlayArea = lazy(() => import("./components/pages/PlayArea"));
const Examples = lazy(() => import("./components/Examples"));

function App() {
  useEffect(() => {
    apiService
      .checkStatus()
      .catch((err) => console.error("Wake-up API failed:", err));
  }, []);

  return (
    <HelmetProvider>
    <ThemeProvider>
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
                <Route path="/play" element={<PlayArea />} />
                <Route path="/examples" element={<Examples />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <GenerationStatus />
        </div>
      </Router>
    </GenerationProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
