import { GREEN } from "../constants/theme";
import { INCOME_SOURCES } from "../constants/categories";
import { Icons } from "../constants/icons";
import styles from "../styles/dashboardStyles";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const activeSourceStyle = {
  background: "rgba(151,196,89,0.15)",
  borderColor: "rgba(151,196,89,0.5)",
  color: "#3B6D11",
};

export default function IncomeModal({ data, onChange, onSave, onClose, isEditing }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>

        <div style={{ ...styles.modalHeader, borderBottomColor: "rgba(151,196,89,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ ...styles.modalIcon, background: "rgba(151,196,89,0.12)", border: "0.5px solid rgba(151,196,89,0.3)" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={GREEN} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div>
              <div style={styles.modalTitle}>{isEditing ? "Edit income" : "Add income"}</div>
              <div style={styles.modalSub}>{isEditing ? "Update this income entry" : "Record a new income entry"}</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>

        <div style={styles.modalBody}>
          <div>
            <div style={styles.fieldLabel}>Title</div>
            <input style={styles.fieldInput} placeholder="e.g. Monthly salary"
              value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={styles.fieldLabel}>Amount</div>
              <div style={{ position: "relative" }}>
                <span style={{ ...styles.amountSymbol, color: GREEN }}>EGP</span>
                <input style={{ ...styles.fieldInput, paddingLeft: 40 }} type="number" placeholder="0.00"
                  value={data.amount} onChange={e => onChange({ ...data, amount: e.target.value })} />
              </div>
            </div>
            <div>
              <div style={styles.fieldLabel}>Date</div>
              <input style={styles.fieldInput} type="date"
                value={data.date} onChange={e => onChange({ ...data, date: e.target.value })} />
            </div>
          </div>

          <div>
            <div style={styles.fieldLabel}>Source</div>
            <div style={styles.catGrid}>
              {INCOME_SOURCES.map(src => (
                <div key={src}
                  style={{ ...styles.catChip, ...(data.source === src ? activeSourceStyle : {}) }}
                  onClick={() => onChange({ ...data, source: src })}>
                  <span style={{ color: data.source === src ? "#3B6D11" : "#a8a29e", display: "flex" }}>
                    {Icons[src] || Icons["Other"]}
                  </span>
                  {src}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={styles.fieldLabel}>
              Description <span style={{ color: "#a8a29e", fontWeight: 400, textTransform: "none" }}>(optional)</span>
            </div>
            <textarea style={{ ...styles.fieldInput, height: 66, resize: "none" }}
              placeholder="Add any additional notes…"
              value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} />
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button style={{ ...styles.btnSave, background: GREEN }} onClick={onSave}><CheckIcon /> {isEditing ? "Update income" : "Save income"}</button>
        </div>

      </div>
    </div>
  );
}