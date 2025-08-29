// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FirstQuestionsPage from "./pages/FirstQuestionsPage.jsx";
import PhotoUploadPage from "./pages/PhotoUploadPage.jsx";
import MatchesPage from "./pages/MatchesPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx"; // messages page import

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User setup */}
        <Route path="/first-questions/:userId" element={<FirstQuestionsPage />} />
        <Route path="/upload-photo/:userId" element={<PhotoUploadPage />} />

        {/* Matches & Messages */}
        <Route path="/matches/:userId" element={<MatchesPage />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />

        {/* Default fallback */}
        <Route path="*" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}
