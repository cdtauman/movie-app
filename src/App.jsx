import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white">
        <nav className="bg-gray-900 p-4 flex gap-6 justify-center text-cinema-gold text-lg font-semibold shadow">
          <Link to="/">🏠 Home</Link>
          <Link to="/search">🔍 Search</Link>
          <Link to="/profile">🎬 Profile</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
