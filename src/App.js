import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landingpage";  // your main landing page
import AuthPage from "./components/AuthPage";        // the login/register page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ngo/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
