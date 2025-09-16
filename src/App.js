import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/landingpage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/dashboard";
import HelpForm from "./components/helpform";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login/Register */}
        <Route path="/ngo/login" element={<AuthPage />} />

        {/* Dashboard */}
        <Route path="/ngo/dashboard" element={<Dashboard />} />

        {/* Help form (village preselected by :id) */}
        <Route path="/ngo/help/:id" element={<HelpForm />} />

        {/* Fallback → Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
