import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info so all pages can use it
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("display_name", data.display_name);

        navigate("/"); // Go to Home after login
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Could not connect to server. Is Flask running?");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login 🎧</h2>

        {error && (
          <p style={{ color: "#ff4444", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;