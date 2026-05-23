import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Library() {
  const [librarySongs, setLibrarySongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [message, setMessage] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("library")) || [];
    setLibrarySongs(saved);
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const removeSong = (songId) => {
    const updated = librarySongs.filter((s) => s.id !== songId);
    setLibrarySongs(updated);
    localStorage.setItem("library", JSON.stringify(updated));
    showMessage("Song removed from library.");
  };

  return (
    <div style={{
      padding: "20px",
      paddingBottom: "160px",
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh",
    }}>
      <h1>Your Library 📚</h1>

      {/* Toast message */}
      {message && (
        <div style={{
          background: "#1DB954",
          color: "#000",
          padding: "10px 20px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontWeight: "500",
          fontSize: "14px",
        }}>
          {message}
        </div>
      )}

      {librarySongs.length === 0 ? (
        <div style={{ color: "#aaa", marginTop: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "16px" }}>Your library is empty.</p>
          <p style={{ fontSize: "14px" }}>
            Go to <Link to="/" style={{ color: "#1DB954" }}>Home</Link> and
            add songs using the "+ Library" button.
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
            {librarySongs.length} song{librarySongs.length !== 1 ? "s" : ""} saved
          </p>

          {librarySongs.map((song) => {
            const isPlaying = currentSong?.id === song.id;
            return (
              <div key={song.id} style={{
                marginBottom: "10px",
                padding: "16px 20px",
                borderRadius: "8px",
                backgroundColor: isPlaying ? "#1a3a2a" : "#181818",
                border: isPlaying ? "1px solid #1DB954" : "1px solid #282828",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>
                    {song.title}
                  </h3>
                  <p style={{ margin: 0, color: "#aaa", fontSize: "13px" }}>
                    {song.artist}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => playSong(song)}
                    style={btnStyle("#1DB954", "#000")}
                  >
                    {isPlaying ? "Playing ▶" : "Play ▶"}
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    style={btnStyle("#282828", "#ff4444", "#ff4444")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Player bar */}
      {currentSong && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: "240px",
          right: 0,
          backgroundColor: "#181818",
          borderTop: "1px solid #1DB954",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}>
          <div style={{ minWidth: "180px" }}>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
              {currentSong.title}
            </p>
            <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>
              {currentSong.artist}
            </p>
          </div>
          <audio
            controls
            autoPlay
            key={currentSong.id}
            style={{ flex: 1, height: "36px" }}
          >
            <source
              src={`http://localhost:3000/${currentSong.file_path}`}
              type="audio/mpeg"
            />
          </audio>
        </div>
      )}
    </div>
  );
}

const btnStyle = (bg, color, border = "none") => ({
  backgroundColor: bg,
  color: color,
  border: `1px solid ${border}`,
  padding: "8px 14px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
});

export default Library;