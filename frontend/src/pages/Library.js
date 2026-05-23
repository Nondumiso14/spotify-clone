import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Library({ currentSong, setCurrentSong }) {
  const [librarySongs, setLibrarySongs] = useState([]);
  const [message, setMessage] = useState("");

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
    const recent = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    const updated = [song, ...recent.filter((s) => s.id !== song.id)];
    localStorage.setItem("recentlyPlayed", JSON.stringify(updated.slice(0, 10)));
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
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh",
    }}>
      <h1>Your Library 📚</h1>

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