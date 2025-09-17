// src/App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/landingpage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/dashboard";
import HelpForm from "./components/Helpform";

// NEW: the layout that holds top bar + sidebar
import PortalShell from "./components/portal";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages (no sidebar) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ngo/login" element={<AuthPage />} />

        {/* Private area with sidebar AFTER login */}
        <Route element={<PortalShell />}>
          <Route path="/ngo/dashboard" element={<Dashboard />} />
          <Route path="/ngo/dashboard/:section" element={<Dashboard />} />
          <Route path="/ngo/help/:id" element={<HelpForm />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
