import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <Router>
      <div className="app">

        {/* Sidebar */}
        <div className="sidebar">
          <h2>Spotify</h2>

          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/library">Your Library</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          
          
        </div>

        {/* Main Content */}
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        {/* Player */}
        <div className="player">
          <p>Player Controls Here 🎵</p>
        </div>

      </div>
    </Router>
  );
}

export default App;