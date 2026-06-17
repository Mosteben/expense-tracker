import { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiArrowLeft, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import styles from "../styles/dashboardStyles";

export default function Topbar({ title, sub, onBack, actionBtn, onNavigate }) {
  const name  = localStorage.getItem("name")  || "";
  const email = localStorage.getItem("email") || "";
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  return (
    <header style={styles.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {onBack && (
          <button style={styles.backBtn} onClick={onBack}>
            <FiArrowLeft size={16}/>
          </button>
        )}
        <div>
          <h1 style={styles.topTitle}>{title}</h1>
          <p style={styles.topSub}>{sub}</p>
        </div>
      </div>

      <div style={styles.topRight}>
        <div style={styles.searchBox}><FiSearch /> Search...</div>
        {!onBack && <div style={styles.bellBtn}><FiBell/></div>}
        {actionBtn}

        <div ref={ref} style={{ position: "relative" }}>
          <div style={styles.avatar} onClick={() => setOpen(o => !o)}>
            {name.slice(0, 2).toUpperCase()}
          </div>

          {open && (
            <div style={st.dropdown}>
              <div style={st.dropHeader}>
                <div style={st.dropAvatar}>{name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div style={st.dropName}>{name}</div>
                  <div style={st.dropEmail}>{email}</div>
                </div>
              </div>

              <div style={st.divider}/>

              <div style={st.dropItem} onClick={() => { setOpen(false); onNavigate?.("settings"); }}>
                <FiSettings size={13}/> Settings
              </div>
              <div style={{ ...st.dropItem, ...st.dropLogout }} onClick={logout}>
                <FiLogOut size={13}/> Log out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const st = {
  dropdown: {
    position: "absolute", top: "calc(100% + 10px)", right: 0,
    background: "#fff", borderRadius: 14,
    border: "0.5px solid rgba(0,0,0,0.08)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    minWidth: 220, zIndex: 999, overflow: "hidden",
  },
  dropHeader: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 16px",
    background: "rgba(192,98,47,0.04)",
  },
  dropAvatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "linear-gradient(135deg,#c0622f,#e8834a)",
    color: "#fff", fontSize: 13, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  dropName:  { fontSize: 13, fontWeight: 600, color: "#1c1917" },
  dropEmail: { fontSize: 11, color: "#78716c", marginTop: 1 },
  divider:   { height: "0.5px", background: "rgba(0,0,0,0.06)", margin: "0 12px" },
  dropItem: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 16px", fontSize: 13, color: "#44403c",
    cursor: "pointer", transition: "background 0.15s",
  },
  dropLogout: { color: "#A32D2D" },
};