import { useState, useMemo } from "react";
import { FiCalendar, FiDollarSign, FiPlus, FiSearch, FiTrash2, FiFilter, FiEdit2 } from "react-icons/fi";
import Topbar from "../../components/Topbar";
import { EmptyState } from "../../components/StatCard";
import { Icons } from "../../constants/icons";
import { CATEGORIES } from "../../constants/categories";
import { ACCENT } from "../../constants/theme";
import styles from "../../styles/dashboardStyles";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function ExpensesPage({ expenses, dashboard, onBack, onAddExpense, onEditExpense, onDeleteExpense }) {
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const filtered = useMemo(() => {
    return expenses
      .filter(exp => {
        const matchSearch = !search ||
          exp.Title?.toLowerCase().includes(search.toLowerCase()) ||
          exp.Description?.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "All" || exp.Category === category;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        const diff = new Date(b.Date) - new Date(a.Date);
        return sortOrder === "newest" ? diff : -diff;
      });
  }, [expenses, search, category, sortOrder]);

  const totalFiltered = filtered.reduce((sum, e) => sum + Number(e.Amount || 0), 0);
  const avgAmount = expenses.length > 0
    ? Math.round(dashboard.total_expenses / expenses.length).toLocaleString()
    : 0;

  return (
    <>
      <Topbar
        title="Expenses"
        sub="All your recorded expenses"
        onBack={onBack}
        actionBtn={
          <button style={styles.addExpBtn} onClick={onAddExpense}>
            <FiPlus size={15}/> Add expense
          </button>
        }
      />

      <div style={styles.content}>
        <div style={styles.expSummaryRow}>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>Total spent</p>
            <p style={styles.expSummaryValue}>EGP {dashboard.total_expenses.toLocaleString()}</p>
          </div>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>No. of expenses</p>
            <p style={styles.expSummaryValue}>{expenses.length}</p>
          </div>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>Avg per expense</p>
            <p style={styles.expSummaryValue}>EGP {avgAmount}</p>
          </div>
          <div style={styles.expSummaryCard}>
            <p style={styles.expSummaryLabel}>Monthly budget</p>
            <p style={styles.expSummaryValue}>EGP {dashboard.total_income.toLocaleString()}</p>
          </div>
        </div>

        <div style={st.toolbar}>
          <div style={st.searchWrap}>
            <FiSearch size={14} color="#a8a29e"/>
            <input
              style={st.searchInput}
              placeholder="Search expenses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={st.filterWrap}>
            <FiFilter size={14} color="#a8a29e"/>
            <select
              style={st.select}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            style={st.sortBtn}
            onClick={() => setSortOrder(o => o === "newest" ? "oldest" : "newest")}
          >
            <FiCalendar size={13}/>
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>

          {(search || category !== "All") && (
            <span style={st.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {filtered.length > 0 && ` · EGP ${totalFiltered.toLocaleString()}`}
            </span>
          )}
        </div>

        <div style={styles.listCard}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FiDollarSign size={28} color="#a8a29e"/>}
              title={search || category !== "All" ? "No results found" : "No expenses yet"}
              sub={search || category !== "All" ? "Try a different search or filter" : "Add your first expense to start tracking"}
              onAdd={onAddExpense}
              btnLabel="Add expense"
            />
          ) : (
            <>
              <div style={styles.tableHead}>
                <span style={{ flex: 2 }}>Title</span>
                <span style={{ flex: 1 }}>Category</span>
                <span style={{ flex: 1 }}>Date</span>
                <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
                <span style={{ width: 72 }}></span>
              </div>
              {filtered.map((exp, i) => (
                <div key={exp.ID || i} style={{ ...styles.tableRow, ...st.row }}>
                  <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={styles.rowIcon}>
                      <span style={{ color: ACCENT, display: "flex" }}>
                        {Icons[exp.Category] || Icons["Other"]}
                      </span>
                    </div>
                    <div>
                      <div style={styles.rowTitle}>{exp.Title}</div>
                      {exp.Description && <div style={styles.rowDesc}>{exp.Description}</div>}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={styles.badge}>{exp.Category || "Other"}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#78716c" }}>
                    <FiCalendar size={11}/>{fmtDate(exp.Date)}
                  </div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#A32D2D" }}>
                    − {Number(exp.Amount).toLocaleString()} {exp.Currency || "EGP"}
                  </div>
                  <div style={{ width: 72, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    <button style={st.editBtn} onClick={() => onEditExpense(exp)} title="Edit">
                      <FiEdit2 size={13}/>
                    </button>
                    <button style={st.deleteBtn} onClick={() => onDeleteExpense(exp.ID)} title="Delete">
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
    background: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(192,98,47,0.18)",
    borderRadius: 10, padding: "8px 14px", flex: 1, minWidth: 200,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1c1917", width: "100%", fontFamily: "inherit" },
  filterWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(192,98,47,0.18)",
    borderRadius: 10, padding: "8px 14px",
  },
  select: { border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1c1917", cursor: "pointer", fontFamily: "inherit" },
  sortBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(192,98,47,0.18)",
    borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#78716c",
    cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
  },
  resultCount: {
    fontSize: 12, color: "#78716c", fontWeight: 500,
    background: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(192,98,47,0.12)",
    borderRadius: 8, padding: "6px 12px",
  },
  row: { transition: "background 0.15s" },
  editBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: "0.5px solid rgba(192,98,47,0.3)",
    background: "rgba(192,98,47,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: ACCENT, transition: "background 0.15s",
  },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: "0.5px solid rgba(163,45,45,0.2)",
    background: "rgba(163,45,45,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#A32D2D", transition: "background 0.15s",
  },
};