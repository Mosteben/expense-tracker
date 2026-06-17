import { ACCENT } from "../constants/theme";
import { CATEGORIES } from "../constants/categories";
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

export default function ExpenseModal({ data, onChange, onSave, onClose, isEditing }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>

        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.modalIcon}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={ACCENT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <div style={styles.modalTitle}>{isEditing ? "Edit expense" : "Add expense"}</div>
              <div style={styles.modalSub}>{isEditing ? "Update this transaction" : "Track a new transaction"}</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>

        <div style={styles.modalBody}>
          <div>
            <div style={styles.fieldLabel}>Title</div>
            <input style={styles.fieldInput} placeholder="e.g. Coffee with client"
              value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={styles.fieldLabel}>Amount</div>
              <div style={{ position: "relative" }}>
                <span style={styles.amountSymbol}>EGP</span>
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
            <div style={styles.fieldLabel}>Category</div>
            <div style={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <div key={cat}
                  style={{ ...styles.catChip, ...(data.category === cat ? styles.catChipActive : {}) }}
                  onClick={() => onChange({ ...data, category: cat })}>
                  <span style={{ color: data.category === cat ? ACCENT : "#a8a29e", display: "flex" }}>
                    {Icons[cat]}
                  </span>
                  {cat}
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
          <button style={styles.btnSave} onClick={onSave}><CheckIcon /> {isEditing ? "Update expense" : "Save expense"}</button>
        </div>

      </div>
    </div>
  );
}