import { useEffect, useState } from "react";

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch songs from backend when page loads
  useEffect(() => {
    fetch("http://127.0.0.1:5000/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((error) =>
        console.error("Error fetching songs:", error)
      );
  }, []);

  // Play selected song
  const playSong = (song) => {
  setCurrentSong(song);

  const recentSongs =
    JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

  recentSongs.unshift(song);

  // Keep only latest 10 songs
  localStorage.setItem(
    "recentlyPlayed",
    JSON.stringify(recentSongs.slice(0, 10))
  );
};

  // Add song to library
  const addToLibrary = (song) => {
    const existingLibrary =
      JSON.parse(localStorage.getItem("library")) || [];

    existingLibrary.push(song);

    localStorage.setItem(
      "library",
      JSON.stringify(existingLibrary)
    );

    alert(`${song.title} added to your library!`);
  };

  // Add song to favorites
  const addToFavorites = (song) => {
    const existingFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    existingFavorites.push(song);

    localStorage.setItem(
      "favorites",
      JSON.stringify(existingFavorites)
    );

    alert(`${song.title} added to favorites!`);
  };

  // Search filter
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
  style={{
    padding: "20px",
    paddingBottom: "150px",
    backgroundColor: "#121212",
    color: "white",
    minHeight: "100vh",
  }}
>
      <h1>Home Page 🎵</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "60%",
          marginBottom: "30px",
          fontSize: "16px",
          backgroundColor: "#282828",
          color: "white",
          border: "none",
          borderRadius: "20px"
        }}
      />

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <p>No songs found</p>
      ) : (
        filteredSongs.map((song) => (
          <div
            key={song.id}
            style={{
            marginBottom: "20px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#181818",
            borderBottom: "1px solid #333",
            }}
          >
            <h3>{song.title}</h3>
            <p>{song.artist}</p>

            {/* Play Button */}
            <button onClick={() => playSong(song)}>
              Play ▶️
            </button>

            {/* Add to Library Button */}
            <button
              onClick={() => addToLibrary(song)}
              style={{ marginLeft: "10px" }}
            >
              Add to Library ❤️
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => addToFavorites(song)}
              style={{
              marginLeft: "10px",
              backgroundColor: "#282828",
              color: "white",
              border: "1px solid #555",
              padding: "8px 15px",
              borderRadius: "20px",
              cursor: "pointer",
              }}
            >
              Favorite ⭐
            </button>
          </div>
        ))
      )}

      {/* Bottom Music Player */}
      {currentSong && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "240px",
            right: "0",
            backgroundColor: "#181818",
            padding: "20px",
            borderTop: "1px solid #333",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.5)",
          }}
        >
          <h3>
            Now Playing: {currentSong.title} - {currentSong.artist}
          </h3>

          <audio controls autoPlay style={{ width: "100%" }}>
            <source
              src={`http://localhost:3000${currentSong.file_path}`}
              type="audio/mpeg"
            />
            Your browser does not support audio playback.
          </audio>
        </div>
      )}
    </div>
  );
}

export default Home;