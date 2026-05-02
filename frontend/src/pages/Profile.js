function Profile() {
  const userEmail =
    localStorage.getItem("userEmail") || "Guest User";

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    alert("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#181818",
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "500px",
          margin: "auto",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <h1>User Profile 👤</h1>

        <p style={{ fontSize: "18px", marginTop: "20px" }}>
          Email: {userEmail}
        </p>

        <p style={{ marginTop: "10px" }}>
          Account Type: Standard User
        </p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "25px",
            padding: "12px 25px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;