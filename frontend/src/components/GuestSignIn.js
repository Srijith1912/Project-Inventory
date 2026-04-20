import { useState } from "react";
import { useGuest } from "../context/GuestContext";
import "./styles/GuestSignIn.css";

function GuestSignIn({ title, subtitle }) {
  const { signIn } = useGuest();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = signIn(id);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="guest-signin-wrap">
      <div className="guest-signin-card card">
        <h2 className="guest-signin-title">
          {title || "Sign in to continue"}
        </h2>
        <p className="guest-signin-sub">
          {subtitle ||
            "Pick any ID you'll remember — no password needed. Use the same ID on other devices to see your orders."}
        </p>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="guest-signin-form">
          <label className="field">
            <span className="field-label">Your ID</span>
            <input
              className="input"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. user001"
              autoComplete="username"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary guest-signin-btn">
            Continue
          </button>
        </form>
        <p className="guest-signin-note">
          This is a simple guest identifier. Different IDs keep each person's
          orders separate.
        </p>
      </div>
    </div>
  );
}

export default GuestSignIn;
