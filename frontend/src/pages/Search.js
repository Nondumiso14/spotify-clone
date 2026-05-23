import { useState } from "react";

function Search({ currentSong, setCurrentSong }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const userId = localStorage.getItem("user_id");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search?q=${value}`
      );
      const data = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    const recent = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    const updated = [song, ...recent.filter((s) => s.id !== song.id)];
    localStorage.setItem("recentlyPlayed", JSON.stringify(updated.slice(0, 10)));
  };

  const addToLibrary = (song) => {
    const library = JSON.parse(localStorage.getItem("library")) || [];
    const alreadyIn = library.some((s) => s.id === song.id);
    if (alreadyIn) {
      showMessage(`"${song.title}" is already in your library.`);
      return;
    }
    localStorage.setItem("library", JSON.stringify([...library, song]));
    showMessage(`"${song.title}" added to your library!`);
  };

  const addToFavorites = async (song) => {
    if (!userId) {
      showMessage("Please log in to add favorites.");
      return;
    }
    try {
      await fetch("http://127.0.0.1:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, song_id: song.id }),
      });
      showMessage(`"${song.title}" added to favorites!`);
    } catch (err) {
      showMessage("Something went wrong.");
    }
  };

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh",
    }}>
      <h1>Search 🔍</h1>

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

      <input
        type="text"
        placeholder="Search songs or artists..."
        value={query}
        onChange={handleSearch}
        autoFocus
        style={{
          padding: "12px 20px",
          width: "60%",
          marginBottom: "30px",
          fontSize: "15px",
          backgroundColor: "#282828",
          color: "white",
          border: "none",
          borderRadius: "20px",
          outline: "none",
        }}
      />

      {hasSearched && results.length === 0 && (
        <p style={{ color: "#aaa" }}>No songs found for "{query}".</p>
      )}

      {!hasSearched && (
        <p style={{ color: "#aaa", fontSize: "14px" }}>
          Start typing to search through all songs and artists.
        </p>
      )}

      {results.map((song) => {
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
                onClick={() => addToLibrary(song)}
                style={btnStyle("#282828", "#fff", "#555")}
              >
                + Library
              </button>
              <button
                onClick={() => addToFavorites(song)}
                style={btnStyle("#282828", "#fff", "#555")}
              >
                ☆ Favorite
              </button>
            </div>
          </div>
        );
      })}
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

export default Search;