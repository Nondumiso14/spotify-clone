import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import Favorites from "./pages/Favorites";

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  const userId = localStorage.getItem("user_id");
  const displayName = localStorage.getItem("display_name");

  return (
    <Router>
      <div className="app">

        {/* Sidebar */}
        <div className="sidebar">
          <h2>Spotify</h2>

          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/library">Your Library</Link>
          <Link to="/recently-played">Recently Played</Link>
          <Link to="/favorites">Favorites</Link>

          <div className="sidebar-divider"></div>

          {/* Show different links based on login status */}
          {userId ? (
            <>
              <Link to="/profile">👤 {displayName || "Profile"}</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="main">
          <Routes>
            <Route path="/" element={<Home setCurrentSong={setCurrentSong} currentSong={currentSong} />} />
            <Route path="/search" element={<Search setCurrentSong={setCurrentSong} currentSong={currentSong} />} />
            <Route path="/library" element={<Library setCurrentSong={setCurrentSong} currentSong={currentSong} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recently-played" element={<RecentlyPlayed setCurrentSong={setCurrentSong} currentSong={currentSong} />} />
            <Route path="/favorites" element={<Favorites setCurrentSong={setCurrentSong} currentSong={currentSong} />} />
          </Routes>
        </div>

        {/* Persistent Player Bar — always visible */}
        <div className="player">
          {currentSong ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}>
              {/* Song info */}
              <div style={{ minWidth: "200px" }}>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "white" }}>
                  {currentSong.title}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
                  {currentSong.artist}
                </p>
              </div>

              {/* Audio player */}
              <audio
                controls
                autoPlay
                key={currentSong.id}
                style={{ flex: 1, height: "36px" }}
              >
                <source
                  src={`http://localhost:3000${currentSong.file_path}`}
                  type="audio/mpeg"
                />
              </audio>
            </div>
          ) : (
            <p style={{ color: "#535353", fontSize: "14px" }}>
              🎵 No song playing — pick one from Home
            </p>
          )}
        </div>

      </div>
    </Router>
  );
}

export default App;