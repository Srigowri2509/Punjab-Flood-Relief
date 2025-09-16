// src/App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/landingpage";  // your main landing page
import AuthPage from "./components/AuthPage";        // the login/register page
import Dashboard from "./components/dashboard";      // the dashboard page
import HelpForm from "./components/Helpform";        // the help form page

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default: Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login / Register */}
        <Route path="/ngo/login" element={<AuthPage />} />

        {/* NGO Dashboard */}
        <Route path="/ngo/dashboard" element={<Dashboard />} />

        {/* Help form with village pre-selection */}
        <Route path="/ngo/help/:id" element={<HelpForm />} />

        {/* Fallback: any unknown route → Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

