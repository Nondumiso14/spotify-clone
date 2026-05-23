import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:5000/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFavoriteSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <p style={{ color: "#aaa" }}>Loading your favorites...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={pageStyle}>
        <h1>Favorites ⭐</h1>
        <p style={{ color: "#aaa" }}>
          Please <Link to="/login" style={{ color: "#1DB954" }}>log in</Link> to
          see your favorites.
        </p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>Favorites ⭐</h1>

      {favoriteSongs.length === 0 ? (
        <p style={{ color: "#aaa" }}>
          No favorite songs yet. Go to{" "}
          <Link to="/" style={{ color: "#1DB954" }}>Home</Link> and star some
          songs!
        </p>
      ) : (
        favoriteSongs.map((song) => (
          <div key={song.id} style={{
            marginBottom: "12px",
            padding: "16px 20px",
            backgroundColor: "#181818",
            borderRadius: "8px",
            border: "1px solid #282828",
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
            <span style={{ color: "#1DB954", fontSize: "20px" }}>★</span>
          </div>
        ))
      )}
    </div>
  );
}

const pageStyle = {
  padding: "20px",
  backgroundColor: "#121212",
  color: "white",
  minHeight: "100vh",
};

export default Favorites;