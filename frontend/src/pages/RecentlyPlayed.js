import { useEffect, useState } from "react";

function RecentlyPlayed() {
  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    const savedRecentSongs =
      JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

    setRecentSongs(savedRecentSongs);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Recently Played 🎵</h1>

      {recentSongs.length === 0 ? (
        <p>No recently played songs yet.</p>
      ) : (
        recentSongs.map((song, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#181818",
              borderRadius: "10px",
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

export default RecentlyPlayed;