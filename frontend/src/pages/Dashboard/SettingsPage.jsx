import { useState } from "react";
import { FiLock, FiTrash2, FiEye, FiEyeOff, FiCheck, FiAlertTriangle, FiUser } from "react-icons/fi";
import Topbar from "../../components/Topbar";
import api    from "../../services/api";
import styles from "../../styles/dashboardStyles";

export default function SettingsPage({ onBack }) {
  const [name,  setName]  = useState(localStorage.getItem("name")  || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  // ── Update profile ──
  const [profileStatus,  setProfileStatus]  = useState(null);
  const [profileMsg,     setProfileMsg]     = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const updateProfile = async () => {
    if (!name) {
      setProfileStatus("error"); setProfileMsg("Please fill in at least one field."); return;
    }
    setProfileLoading(true);
    try {
      await api.put("/auth/profile", { name, email });
      localStorage.setItem("name",  name);
      localStorage.setItem("email", email);
      setProfileStatus("success");
      setProfileMsg("Profile updated successfully.");
    } catch (e) {
      setProfileStatus("error");
      setProfileMsg(e.response?.data?.error || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change password ──
  const [pwd,        setPwd]        = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwd,    setShowPwd]    = useState({ current: false, newPwd: false, confirm: false });
  const [pwdStatus,  setPwdStatus]  = useState(null);
  const [pwdMsg,     setPwdMsg]     = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const toggleShow = (field) => setShowPwd(p => ({ ...p, [field]: !p[field] }));

  const changePassword = async () => {
    if (!pwd.current || !pwd.newPwd || !pwd.confirm) {
      setPwdStatus("error"); setPwdMsg("Please fill in all fields."); return;
    }
    if (pwd.newPwd !== pwd.confirm) {
      setPwdStatus("error"); setPwdMsg("New passwords don't match."); return;
    }
    setPwdLoading(true);
    try {
      await api.put("/auth/change-password", {
        current_password: pwd.current,
        new_password:     pwd.newPwd,
      });
      setPwdStatus("success");
      setPwdMsg("Password changed successfully.");
      setPwd({ current: "", newPwd: "", confirm: "" });
    } catch (e) {
      setPwdStatus("error");
      setPwdMsg(e.response?.data?.error || "Failed to change password.");
    } finally {
      setPwdLoading(false);
    }
  };

  // ── Delete account ──
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    if (!window.confirm("This will permanently delete your account. Are you sure?")) return;
    setDeleteLoading(true);
    try {
      await api.delete("/auth/delete-account");
      localStorage.clear();
      window.location.href = "/";
    } catch (e) {
      alert(e.response?.data?.error || "Failed to delete account.");
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Topbar title="Settings" sub="Manage your account" onBack={onBack}/>

      <div style={styles.content}>

        {/* ── Profile info ── */}
        <div style={st.card}>
          <div style={st.cardTitleRow}>
            <FiUser size={15}/>
            <p style={st.cardTitle}>Profile</p>
          </div>
          <div style={st.fields}>
            <div style={st.fieldGroup}>
              <label style={st.label}>Name</label>
              <input
                style={st.input}
                value={name}
                onChange={e => { setName(e.target.value); setProfileStatus(null); }}
                placeholder="Your name"
              />
            </div>
            <div style={st.fieldGroup}>
              <label style={st.label}>Email</label>
              <input
                style={{ ...st.input, background: "#f5f5f4", color: "#a8a29e", cursor: "not-allowed" }}
                value={email}
                readOnly
                placeholder="Your email"
              />
            </div>
          </div>

          {profileStatus && (
            <div style={{ ...st.alert, ...(profileStatus === "success" ? st.alertSuccess : st.alertError) }}>
              {profileStatus === "success" ? <FiCheck size={13}/> : <FiAlertTriangle size={13}/>}
              {profileMsg}
            </div>
          )}

          <button
            style={{ ...st.btn, ...(profileLoading ? st.btnDisabled : {}) }}
            onClick={updateProfile}
            disabled={profileLoading}
          >
            {profileLoading ? "Saving…" : "Save changes"}
          </button>
        </div>

        {/* ── Change password ── */}
        <div style={st.card}>
          <div style={st.cardTitleRow}>
            <FiLock size={15}/>
            <p style={st.cardTitle}>Change password</p>
          </div>

          <div style={st.fields}>
            {[
              { key: "current", label: "Current password"     },
              { key: "newPwd",  label: "New password"         },
              { key: "confirm", label: "Confirm new password" },
            ].map(({ key, label }) => (
              <div key={key} style={st.fieldGroup}>
                <label style={st.label}>{label}</label>
                <div style={st.inputWrap}>
                  <input
                    type={showPwd[key] ? "text" : "password"}
                    style={st.input}
                    placeholder="••••••••"
                    value={pwd[key]}
                    onChange={e => { setPwd(p => ({ ...p, [key]: e.target.value })); setPwdStatus(null); }}
                  />
                  <button style={st.eyeBtn} onClick={() => toggleShow(key)}>
                    {showPwd[key] ? <FiEyeOff size={13}/> : <FiEye size={13}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pwdStatus && (
            <div style={{ ...st.alert, ...(pwdStatus === "success" ? st.alertSuccess : st.alertError) }}>
              {pwdStatus === "success" ? <FiCheck size={13}/> : <FiAlertTriangle size={13}/>}
              {pwdMsg}
            </div>
          )}

          <button
            style={{ ...st.btn, ...(pwdLoading ? st.btnDisabled : {}) }}
            onClick={changePassword}
            disabled={pwdLoading}
          >
            {pwdLoading ? "Saving…" : "Update password"}
          </button>
        </div>

        {/* ── Delete account ── */}
        <div style={{ ...st.card, ...st.dangerCard }}>
          <div style={st.cardTitleRow}>
            <FiTrash2 size={15} color="#A32D2D"/>
            <p style={{ ...st.cardTitle, color: "#A32D2D" }}>Delete account</p>
          </div>
          <p style={st.dangerDesc}>
            This will permanently delete your account and all your data. This action cannot be undone.
          </p>

          <div style={{ ...st.fieldGroup, marginBottom: 14 }}>
            <label style={st.label}>Type <strong>DELETE</strong> to confirm</label>
            <input
              style={{ ...st.input, borderColor: deleteConfirm === "DELETE" ? "#A32D2D" : undefined }}
              placeholder="DELETE"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
            />
          </div>

          <button
            style={{
              ...st.btn, ...st.btnDanger,
              ...(deleteConfirm !== "DELETE" || deleteLoading ? st.btnDisabled : {}),
            }}
            onClick={deleteAccount}
            disabled={deleteConfirm !== "DELETE" || deleteLoading}
          >
            {deleteLoading ? "Deleting…" : "Delete my account"}
          </button>
        </div>

      </div>
    </>
  );
}

const st = {
  card: {
    background: "rgba(255,255,255,0.85)", borderRadius: 16,
    border: "0.5px solid rgba(0,0,0,0.07)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    padding: "24px 28px", marginBottom: 16,
  },
  dangerCard: {
    border: "0.5px solid rgba(163,45,45,0.2)",
    background: "rgba(163,45,45,0.03)",
  },
  cardTitleRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 18 },
  cardTitle:    { fontSize: 14, fontWeight: 600, color: "#1c1917", margin: 0 },
  fields:       { display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 },
  fieldGroup:   { display: "flex", flexDirection: "column", gap: 5 },
  label:        { fontSize: 12, fontWeight: 500, color: "#78716c" },
  inputWrap:    { position: "relative", display: "flex", alignItems: "center" },
  input: {
    width: "100%", padding: "9px 38px 9px 12px", borderRadius: 10, fontSize: 13,
    border: "0.5px solid rgba(0,0,0,0.12)", outline: "none",
    background: "#fff", color: "#1c1917", fontFamily: "inherit", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: 10,
    background: "none", border: "none", cursor: "pointer", color: "#a8a29e", padding: 0,
  },
  alert: {
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 12, borderRadius: 8, padding: "8px 12px", marginBottom: 14,
  },
  alertSuccess: { background: "rgba(151,196,89,0.12)", color: "#3B6D11", border: "0.5px solid rgba(151,196,89,0.3)" },
  alertError:   { background: "rgba(163,45,45,0.08)",  color: "#A32D2D", border: "0.5px solid rgba(163,45,45,0.2)"  },
  btn: {
    padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
    border: "none", cursor: "pointer", fontFamily: "inherit",
    background: "linear-gradient(135deg,#c0622f,#e8834a)", color: "#fff",
  },
  btnDanger:   { background: "linear-gradient(135deg,#A32D2D,#c0622f)" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  dangerDesc:  { fontSize: 12, color: "#78716c", marginBottom: 16, lineHeight: 1.6 },
};