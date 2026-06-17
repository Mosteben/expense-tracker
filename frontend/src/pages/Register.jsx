import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import loginImg from "../assets/login.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Account Created");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Register Failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative floating cards */}
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

      <div className="auth-card">
        {/* Left: Form */}
        <div className="auth-left">
          <div className="auth-inner">
            <div className="brand-wrap">
              <div className="brand-logo">
                <ion-icon name="wallet-outline" style={{ fontSize: "18px", color: "#c0622f" }}></ion-icon>
              </div>
              <span className="brand">ExpenseTrack</span>
            </div>

            <h1>Create Account</h1>
            <p className="subtitle">Join us to start tracking your expenses today.</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <ion-icon name="person-outline" class="input-icon"></ion-icon>
                  <input
                    type="text"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Register
                <ion-icon name="arrow-forward-outline" style={{ fontSize: "16px" }}></ion-icon>
              </button>
            </form>

            <p className="footer-text">
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right: Image + Overlay */}
        <div className="auth-right">
          <img src={loginImg} alt="expense tracker" className="right-img" />
          <div className="right-overlay">
            <div className="glass-pill">
              <ion-icon name="flash-outline"></ion-icon>
              Smart Finance Platform
            </div>
            <div className="right-text">
              <h2 className="right-title">Start your journey<br />to financial freedom.</h2>
              <p className="right-sub">Create your account and take<br />control of your future.</p>
            </div>
            <div className="glass-features">
              <div className="glass-feat">
                <div className="glass-feat-icon"><ion-icon name="stats-chart-outline"></ion-icon></div>
                <div><p className="glass-feat-title">Live Tracking</p><p className="glass-feat-sub">All transactions synced</p></div>
              </div>
              <div className="glass-feat">
                <div className="glass-feat-icon"><ion-icon name="notifications-outline"></ion-icon></div>
                <div><p className="glass-feat-title">Budget Alerts</p><p className="glass-feat-sub">Never overspend again</p></div>
              </div>
              <div className="glass-feat">
                <div className="glass-feat-icon"><ion-icon name="bar-chart-outline"></ion-icon></div>
                <div><p className="glass-feat-title">Monthly Reports</p><p className="glass-feat-sub">Visual spending insights</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}