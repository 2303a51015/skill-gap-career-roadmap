import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AnalysisInputPage from './pages/AnalysisInputPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import HistoryPage from './pages/HistoryPage';
import DocumentationPage from './pages/DocumentationPage';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalysisInputPage />} />
            <Route path="/dashboard/:id" element={<DashboardPage />} />
            <Route path="/roadmap/:id" element={<RoadmapPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
