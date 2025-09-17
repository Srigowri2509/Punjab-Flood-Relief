// src/App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/landingpage";   // public landing
import AuthPage from "./components/AuthPage";         // login/register
import Dashboard from "./components/dashboard";       // villages dashboard
import HelpForm from "./components/Helpform";         // help pledge form
import Portal from "./components/portal";             // post-login shell

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing stays outside the shell */}
        <Route path="/" element={<LandingPage />} />

        {/* Post-login area uses the Portal shell */}
        <Route
          path="/ngo/login"
          element={
            <Portal>
              <AuthPage />
            </Portal>
          }
        />
        <Route
          path="/ngo/dashboard"
          element={
            <Portal>
              <Dashboard />
            </Portal>
          }
        />
        <Route
          path="/ngo/help/:id"
          element={
            <Portal>
              <HelpForm />
            </Portal>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
