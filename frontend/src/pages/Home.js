import { useEffect, useState } from "react";

function Home({ currentSong, setCurrentSong }) {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://127.0.0.1:5000/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((s) => s.id)))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [userId]);

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

  const toggleFavorite = async (song) => {
    if (!userId) {
      showMessage("Please log in to add favorites.");
      return;
    }
    const isFav = favorites.includes(song.id);
    if (isFav) {
      await fetch("http://127.0.0.1:5000/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, song_id: song.id }),
      });
      setFavorites(favorites.filter((id) => id !== song.id));
      showMessage(`"${song.title}" removed from favorites.`);
    } else {
      await fetch("http://127.0.0.1:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, song_id: song.id }),
      });
      setFavorites([...favorites, song.id]);
      showMessage(`"${song.title}" added to favorites!`);
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh",
    }}>
      <h1>Home 🎵</h1>

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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px 16px",
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

      {filteredSongs.length === 0 ? (
        <p style={{ color: "#aaa" }}>No songs found.</p>
      ) : (
        filteredSongs.map((song) => {
          const isFav = favorites.includes(song.id);
          const isPlaying = currentSong?.id === song.id;

          return (
            <div key={song.id} style={{
              marginBottom: "12px",
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
                <button onClick={() => playSong(song)} style={btnStyle("#1DB954", "#000")}>
                  {isPlaying ? "Playing ▶" : "Play ▶"}
                </button>
                <button onClick={() => addToLibrary(song)} style={btnStyle("#282828", "#fff", "#555")}>
                  + Library
                </button>
                <button
                  onClick={() => toggleFavorite(song)}
                  style={btnStyle(isFav ? "#1DB954" : "#282828", isFav ? "#000" : "#fff", isFav ? "none" : "#555")}
                >
                  {isFav ? "★ Saved" : "☆ Favorite"}
                </button>
              </div>
            </div>
          );
        })
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

export default Home;