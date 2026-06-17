import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE", res.data);
      localStorage.setItem("token", res.data.token);
      console.log("SAVED TOKEN", localStorage.getItem("token"));
      localStorage.setItem("email", email);
      localStorage.setItem("name", res.data.name);
      console.log(res.data);
      alert("Login Successful");
      navigate("/dashboard");
    } catch (err) {
     // alert(err.response?.data?.error || "Login Failed");
       alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="auth-page">

      {/* floating stat cards — decorative */}
      <div className="deco-card deco-1">
        <ion-icon name="trending-up-outline"></ion-icon>
        <div>
          <p className="deco-val">£12,430</p>
          <p className="deco-lbl">Total Saved</p>
        </div>
      </div>
      <div className="deco-card deco-2">
        <ion-icon name="pie-chart-outline"></ion-icon>
        <div>
          <p className="deco-val">68%</p>
          <p className="deco-lbl">Budget Used</p>
        </div>
      </div>
      <div className="deco-card deco-3">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <div>
          <p className="deco-val">24 goals</p>
          <p className="deco-lbl">Completed</p>
        </div>
      </div>

      {/* main card */}
      <div className="auth-card">

        {/* ── Left: Form ── */}
        <div className="auth-left">
          <div className="auth-inner">

            <div className="brand-wrap">
              <div className="brand-logo">
                <ion-icon name="wallet-outline" style={{ fontSize: "18px", color: "#c0622f" }}></ion-icon>
              </div>
              <span className="brand">ExpenseTrack</span>
            </div>

            <h1>Welcome back</h1>
            <p className="subtitle">Sign in to track your expenses and manage your budget.</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email address</label>
                <div className="input-wrap">
                  <ion-icon name="mail-outline" class="input-icon"></ion-icon>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrap">
                  <ion-icon name="lock-closed-outline" class="input-icon"></ion-icon>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Sign in
                <ion-icon name="arrow-forward-outline" style={{ fontSize: "16px" }}></ion-icon>
              </button>
            </form>

            <p className="footer-text">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>

          </div>
        </div>

        {/* ── Right: Image + Overlay ── */}
        <div className="auth-right">
          <img src="/src/assets/login.jpg" alt="expense tracker" className="right-img" />
          <div className="right-overlay">

            {/* glass pill top */}
            <div className="glass-pill">
              <ion-icon name="flash-outline"></ion-icon>
              Smart Finance Platform
            </div>

            <div className="right-text">
              <h2 className="right-title">Track every pound,<br />reach every goal.</h2>
              <p className="right-sub">Real-time insights to help you<br />spend wisely and save more.</p>
            </div>

            {/* glass feature cards */}
            <div className="glass-features">
              <div className="glass-feat">
                <div className="glass-feat-icon">
                  <ion-icon name="stats-chart-outline"></ion-icon>
                </div>
                <div>
                  <p className="glass-feat-title">Live Tracking</p>
                  <p className="glass-feat-sub">All transactions synced</p>
                </div>
              </div>
              <div className="glass-feat">
                <div className="glass-feat-icon">
                  <ion-icon name="notifications-outline"></ion-icon>
                </div>
                <div>
                  <p className="glass-feat-title">Budget Alerts</p>
                  <p className="glass-feat-sub">Never overspend again</p>
                </div>
              </div>
              <div className="glass-feat">
                <div className="glass-feat-icon">
                  <ion-icon name="bar-chart-outline"></ion-icon>
                </div>
                <div>
                  <p className="glass-feat-title">Monthly Reports</p>
                  <p className="glass-feat-sub">Visual spending insights</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}