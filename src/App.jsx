import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Bus from "./components/Bus.jsx";
import Weather from "./components/Weather.jsx";
import About from "./components/About.jsx";

function App() {
  return (
    <Router basename="/TapestryBus">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Bus />} />
          <Route path="/bus" element={<Bus />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;