import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecentlyPlayed({ currentSong, setCurrentSong }) {
  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    setRecentSongs(saved);
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const clearHistory = () => {
    localStorage.removeItem("recentlyPlayed");
    setRecentSongs([]);
  };

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}>
        <h1>Recently Played 🕐</h1>
        {recentSongs.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              backgroundColor: "transparent",
              color: "#aaa",
              border: "1px solid #555",
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Clear history
          </button>
        )}
      </div>

      {recentSongs.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <p style={{ color: "#aaa", fontSize: "16px" }}>
            No recently played songs yet.
          </p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Go to <Link to="/" style={{ color: "#1DB954" }}>Home</Link> and
            play some songs!
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
            {recentSongs.length} song{recentSongs.length !== 1 ? "s" : ""} in history
          </p>

          {recentSongs.map((song, index) => {
            const isPlaying = currentSong?.id === song.id;
            return (
              <div key={index} style={{
                marginBottom: "10px",
                padding: "16px 20px",
                borderRadius: "8px",
                backgroundColor: isPlaying ? "#1a3a2a" : "#181818",
                border: isPlaying ? "1px solid #1DB954" : "1px solid #282828",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ color: "#535353", fontSize: "13px", minWidth: "20px" }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>
                      {song.title}
                    </h3>
                    <p style={{ margin: 0, color: "#aaa", fontSize: "13px" }}>
                      {song.artist}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => playSong(song)}
                  style={{
                    backgroundColor: isPlaying ? "#1DB954" : "#282828",
                    color: isPlaying ? "#000" : "#fff",
                    border: "1px solid #555",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  {isPlaying ? "Playing ▶" : "Play ▶"}
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default RecentlyPlayed;