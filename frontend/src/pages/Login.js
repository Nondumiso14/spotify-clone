import { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  // Save user email if login successful
  if (response.ok) {
    localStorage.setItem("userEmail", email);
  }

  alert(data.message);
};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login 🎧</h2>

        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <p>
          Don’t have an account? <span>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;