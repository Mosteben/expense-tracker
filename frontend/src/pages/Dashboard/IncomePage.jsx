import { useState, useMemo } from "react";
import { FiCalendar, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Topbar from "../../components/Topbar";
import { EmptyState } from "../../components/StatCard";
import { Icons } from "../../constants/icons";
import { GREEN } from "../../constants/theme";
import styles from "../../styles/dashboardStyles";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const greenCard = { background: "rgba(151,196,89,0.12)", border: "0.5px solid rgba(151,196,89,0.25)" };
const greenIcon  = { background: "rgba(151,196,89,0.12)", border: "0.5px solid rgba(151,196,89,0.25)" };

export default function IncomePage({ incomes, dashboard, onBack, onAddIncome, onEditIncome, onDeleteIncome }) {
  const [search,    setSearch]    = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const filtered = useMemo(() => {
    return incomes
      .filter(inc =>
        !search ||
        inc.Title?.toLowerCase().includes(search.toLowerCase()) ||
        inc.Description?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const diff = new Date(b.Date) - new Date(a.Date);
        return sortOrder === "newest" ? diff : -diff;
      });
  }, [incomes, search, sortOrder]);

  const totalFiltered = filtered.reduce((sum, i) => sum + Number(i.Amount || 0), 0);
  const avgAmount = incomes.length > 0
    ? Math.round(dashboard.total_income / incomes.length).toLocaleString()
    : 0;

  return (
    <>
      <Topbar
        title="Income"
        sub="All your recorded income"
        onBack={onBack}
        actionBtn={
          <button style={{ ...styles.addExpBtn, background: GREEN }} onClick={onAddIncome}>
            <FiPlus size={15}/> Add income
          </button>
        }
      />

      <div style={styles.content}>
        <div style={styles.expSummaryRow}>
          <div style={{ ...styles.expSummaryCard, ...greenCard }}>
            <p style={styles.expSummaryLabel}>Total income</p>
            <p style={{ ...styles.expSummaryValue, color: "#3B6D11" }}>EGP {dashboard.total_income.toLocaleString()}</p>
          </div>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>No. of entries</p>
            <p style={styles.expSummaryValue}>{incomes.length}</p>
          </div>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>Avg per entry</p>
            <p style={styles.expSummaryValue}>EGP {avgAmount}</p>
          </div>
          <div style={{ ...styles.expSummaryCard, ...greenCard }}>
            <p style={styles.expSummaryLabel}>Net balance</p>
            <p style={{ ...styles.expSummaryValue, color: "#3B6D11" }}>EGP {dashboard.balance.toLocaleString()}</p>
          </div>
        </div>

        <div style={st.toolbar}>
          <div style={st.searchWrap}>
            <FiSearch size={14} color="#a8a29e"/>
            <input
              style={st.searchInput}
              placeholder="Search income…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button
            style={st.sortBtn}
            onClick={() => setSortOrder(o => o === "newest" ? "oldest" : "newest")}
          >
            <FiCalendar size={13}/>
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>

          {search && (
            <span style={st.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {filtered.length > 0 && ` · EGP ${totalFiltered.toLocaleString()}`}
            </span>
          )}
        </div>

        <div style={styles.listCard}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FiTrendingUp size={28} color="#a8a29e"/>}
              title={search ? "No results found" : "No income yet"}
              sub={search ? "Try a different search" : "Add your first income entry to start tracking"}
              onAdd={onAddIncome}
              btnLabel="Add income"
              green
            />
          ) : (
            <>
              <div style={styles.tableHead}>
                <span style={{ flex: 2 }}>Title</span>
                <span style={{ flex: 1 }}>Date</span>
                <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
                <span style={{ width: 72 }}></span>
              </div>
              {filtered.map((inc, i) => (
                <div key={inc.ID || i} style={styles.tableRow}>
                  <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ ...styles.rowIcon, ...greenIcon }}>
                      <span style={{ color: GREEN, display: "flex" }}>
                        {Icons["Salary"] || Icons["Other"]}
                      </span>
                    </div>
                    <div>
                      <div style={styles.rowTitle}>{inc.Title}</div>
                      {inc.Description && <div style={styles.rowDesc}>{inc.Description}</div>}
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#78716c" }}>
                    <FiCalendar size={11}/>{fmtDate(inc.Date)}
                  </div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#3B6D11" }}>
                    + {Number(inc.Amount).toLocaleString()} {inc.Currency || "EGP"}
                  </div>
                  <div style={{ width: 72, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    <button style={st.editBtn} onClick={() => onEditIncome(inc)} title="Edit">
                      <FiEdit2 size={13}/>
                    </button>
                    <button style={st.deleteBtn} onClick={() => onDeleteIncome(inc.ID)} title="Delete">
                      <FiTrash2 size={13}/>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const st = {
  toolbar: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(151,196,89,0.25)",
    borderRadius: 10, padding: "8px 14px", flex: 1, minWidth: 200,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1c1917", width: "100%", fontFamily: "inherit" },
  sortBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(151,196,89,0.25)",
    borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#78716c",
    cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
  },
  resultCount: {
    fontSize: 12, color: "#78716c", fontWeight: 500,
    background: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(151,196,89,0.2)",
    borderRadius: 8, padding: "6px 12px",
  },
  editBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: "0.5px solid rgba(151,196,89,0.35)",
    background: "rgba(151,196,89,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#3B6D11", transition: "background 0.15s",
  },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: "0.5px solid rgba(163,45,45,0.2)",
    background: "rgba(163,45,45,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#A32D2D", transition: "background 0.15s",
  },
};