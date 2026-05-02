import { useEffect, useState } from "react";

function Library() {
  const [librarySongs, setLibrarySongs] = useState([]);

  // Load saved songs from localStorage
  useEffect(() => {
    const savedSongs =
      JSON.parse(localStorage.getItem("library")) || [];

    setLibrarySongs(savedSongs);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Library 📚</h1>

      {librarySongs.length === 0 ? (
        <p>No songs in your library yet.</p>
      ) : (
        librarySongs.map((song, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              borderBottom: "1px solid #333",
            }}
          >
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Library;