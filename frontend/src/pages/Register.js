import { useState } from "react";
import "./Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const response = await fetch("http://127.0.0.1:5000/register", {
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
    alert(data.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register 📝</h2>

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

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;