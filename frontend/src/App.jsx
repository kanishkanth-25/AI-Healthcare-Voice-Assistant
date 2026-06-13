import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./components/InputField";
import SocialLogin from "./components/SocialLogin";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    setErrorMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("user_id", data.user_id);
      console.log("Login successful:", data);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Log in to Healthcare Portal</h2>
      <SocialLogin />
      <div className="separator">
        <span>or</span>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <InputField
          type="email"
          placeholder="Email address"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <p className="error-message" style={{ color: "#e63946", fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "1rem" }}>
            ❌ {errorMessage}
          </p>
        )}
        <a href="#" className="forgot-password-link">Forgot password?</a>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account? <span className="signup-link" style={{ cursor: "pointer", color: "var(--primary)", fontWeight: "600" }} onClick={() => navigate("/signup")}>Sign up now</span>
      </p>
    </div>
  );
};

export default App;
