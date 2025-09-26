import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes like /auth, /dashboard, etc. */}
      </Routes>
    </div>
  );
}

export default App;
