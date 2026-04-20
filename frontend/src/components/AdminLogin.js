import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./styles/AdminLogin.css";

function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(username.trim(), password);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="login-wrap page-container">
      <div className="login-card card">
        <div className="login-header">
          <div className="login-mark">P</div>
          <h2 className="login-title">Admin Sign in</h2>
          <p className="login-subtitle">
            Restricted area. Only administrators can manage inventory.
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Username</span>
            <input
              className="input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary login-submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
