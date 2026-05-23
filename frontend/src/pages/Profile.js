import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const userEmail = localStorage.getItem("userEmail") || "Unknown";
  const displayName = localStorage.getItem("display_name") || "Guest User";

  const handleLogout = () => {
    // Clear everything saved during login
    localStorage.removeItem("user_id");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("display_name");
    navigate("/login");
  };

  if (!userId) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>Profile 👤</h1>
          <p style={{ color: "#aaa", marginTop: "16px" }}>
            You are not logged in.
          </p>
          <Link to="/login">
            <button style={greenBtn}>Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* Avatar circle */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#1DB954",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          fontWeight: "bold",
          color: "#000",
          margin: "0 auto 20px",
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>

        <h1 style={{ margin: "0 0 6px" }}>{displayName}</h1>
        <p style={{ color: "#aaa", fontSize: "14px", margin: "0 0 24px" }}>
          {userEmail}
        </p>

        {/* Stats row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          marginBottom: "28px",
          padding: "16px",
          backgroundColor: "#121212",
          borderRadius: "10px",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}>
              {JSON.parse(localStorage.getItem("library") || "[]").length}
            </p>
            <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>
              Library
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}>
              {JSON.parse(localStorage.getItem("recentlyPlayed") || "[]").length}
            </p>
            <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>
              Recently Played
            </p>
          </div>
        </div>

        <p style={{
          color: "#555",
          fontSize: "12px",
          marginBottom: "20px",
        }}>
          Account type: Standard User
        </p>

        <button onClick={handleLogout} style={greenBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "40px 20px",
  backgroundColor: "#121212",
  color: "white",
  minHeight: "100vh",
};

const cardStyle = {
  backgroundColor: "#181818",
  padding: "40px 30px",
  borderRadius: "16px",
  maxWidth: "420px",
  margin: "0 auto",
  textAlign: "center",
  border: "1px solid #282828",
};

const greenBtn = {
  padding: "12px 32px",
  backgroundColor: "#1DB954",
  color: "#000",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};

export default Profile;