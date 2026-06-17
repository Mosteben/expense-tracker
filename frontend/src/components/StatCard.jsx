import { GREEN } from "../constants/theme";
import styles from "../styles/dashboardStyles";

export function StatCard({ label, value, sub, subColor, highlighted }) {
  return (
    <div style={{ ...styles.statCard, ...(highlighted ? styles.statCardHL : {}) }}>
      <p style={{ ...styles.statLabel, ...(highlighted ? { color: "rgba(255,255,255,0.75)" } : {}) }}>{label}</p>
      <p style={{ ...styles.statValue, ...(highlighted ? { color: "#fff" } : {}) }}>{value}</p>
      <p style={{ fontSize: 11, color: highlighted ? "rgba(255,255,255,0.8)" : subColor || "#78716c" }}>{sub}</p>
    </div>
  );
}

export function LegDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#78716c" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </div>
  );
}

export function EmptyState({ icon, title, sub, onAdd, btnLabel, green }) {
  return (
    <div style={styles.emptyState}>
      <div style={{ ...styles.emptyIcon, ...(green ? { background: "rgba(151,196,89,0.12)", border: "0.5px solid rgba(151,196,89,0.2)" } : {}) }}>
        {icon}
      </div>
      <p style={styles.emptyTitle}>{title}</p>
      <p style={styles.emptySub}>{sub}</p>
      <button style={{ ...styles.emptyBtn, ...(green ? { background: GREEN } : {}) }} onClick={onAdd}>
        + {btnLabel}
      </button>
    </div>
  );
}
