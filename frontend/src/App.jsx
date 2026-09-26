import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import WeeklyCheckinPage from './pages/WeeklyCheckinPage';
import DashboardPage from './pages/DashboardPage';
import EvaluationPage from './pages/EvaluationPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ExperimentPage from './pages/ExperimentPage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/checkin" element={<WeeklyCheckinPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/experiment" element={<ExperimentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
