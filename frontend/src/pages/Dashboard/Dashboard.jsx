import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { FiPlus, FiDollarSign, FiDownload, FiTrendingUp } from "react-icons/fi";
import { StatCard, LegDot } from "../../components/StatCard";
import Topbar from "../../components/Topbar";
import { ACCENT, BLUE, GOLD, GREEN } from "../../constants/theme";
import styles from "../../styles/dashboardStyles";
import SettingsPage from "./SettingsPage";
import { exportFinancialReportPDF } from "../../utils/exportReport";

const PIE_COLORS = [ACCENT, BLUE, GOLD, GREEN];

const initialsOf = (title = "") => {
  const words = title.split(/\s+/).filter(w => /^[A-Za-z]/.test(w));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return "—";
};

const shortDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.toLocaleDateString("en-US", { month: "short" })} ${dt.getDate()}`;
};

const buildTxnRows = ({ lastExpense, lastTwoIncomes = [] } = {}) => {
  const rows = [];
  if (lastExpense) {
    rows.push({
      key:      `exp-${lastExpense.ID}`,
      initials: initialsOf(lastExpense.Title),
      name:     lastExpense.Title,
      cat:      `${lastExpense.Category || "Other"} · ${shortDate(lastExpense.Date)}`,
      amt:      `-${Number(lastExpense.Amount).toLocaleString()}`,
      pos:      false,
      date:     lastExpense.Date,
    });
  }
  for (const inc of lastTwoIncomes) {
    rows.push({
      key:      `inc-${inc.ID}`,
      initials: initialsOf(inc.Title),
      name:     inc.Title,
      cat:      `${inc.Source || "Income"} · ${shortDate(inc.Date)}`,
      amt:      `+${Number(inc.Amount).toLocaleString()}`,
      pos:      true,
      date:     inc.Date,
    });
  }
  return rows.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default function DashboardPage({
  dashboard, savingsRate,
  categoryBreakdown = [], monthlyTrend = [], recentTransactions = {},
  expenses = [], incomes = [],
  onAddExpense, onAddIncome, onNavigate,
}) {
  const name = localStorage.getItem("name") || "";
  const [exporting, setExporting] = useState(false);

  const monthlyData  = monthlyTrend;
  const spendingData = categoryBreakdown.map((c, i) => ({
    name: c.category, value: c.total, color: PIE_COLORS[i % PIE_COLORS.length],
  }));
  const txnRows = buildTxnRows(recentTransactions);

  const handleExportReport = async () => {
    console.log("Expenses:", expenses);
    console.log("Incomes:", incomes);
    if (exporting) return;
    setExporting(true);
    try {
      await exportFinancialReportPDF({
        expenses,
        incomes,
        userName: name,
        currency: expenses[0]?.Currency || incomes[0]?.Currency || "EGP",
      });
    } catch (err) {
      console.error("Failed to export report:", err);
      alert("Couldn't generate the report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Topbar
        title="Expensee--MAN--Finance"
        sub={`Welcome back, ${name}`}
        onNavigate={onNavigate}
      />

      <div style={styles.content}>
        <div style={styles.statGrid}>
          <StatCard label="Total Balance"    value={`EGP ${dashboard.balance.toLocaleString()}`}        sub="Net savings"                                                  highlighted />
          <StatCard label="Monthly Income"   value={`EGP ${dashboard.total_income.toLocaleString()}`}   sub="↑ Salary"                             subColor="#3B6D11" />
          <StatCard label="Monthly Expenses" value={`EGP ${dashboard.total_expenses.toLocaleString()}`} sub={`↓ ${(100 - parseFloat(savingsRate)).toFixed(1)}% of income`} subColor="#A32D2D" />
          <StatCard label="Savings Rate"     value={`${savingsRate}%`}                                  sub="↑ Excellent rate"                      subColor="#3B6D11" />
        </div>

        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Earnings overview</span>
              <div style={styles.legend}>
                <LegDot color={ACCENT} label="Expenses"/>
                <LegDot color={BLUE}   label="Income"/>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={50}/>
                <Tooltip contentStyle={styles.tooltip}/>
                <Line type="monotone" dataKey="expenses" stroke={ACCENT} strokeWidth={2} dot={{ r: 3 }}/>
                <Line type="monotone" dataKey="income"   stroke={BLUE}   strokeWidth={2} dot={{ r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Monthly breakdown</span>
              <div style={styles.legend}>
                <LegDot color={ACCENT} label="Expenses"/>
                <LegDot color={BLUE}   label="Income"/>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={50}/>
                <Tooltip contentStyle={styles.tooltip}/>
                <Bar dataKey="expenses" fill={ACCENT} radius={[4, 4, 0, 0]}/>
                <Bar dataKey="income"   fill={BLUE}   radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.bottomCard}>
            <p style={styles.bottomTitle}>Spending breakdown</p>
            {spendingData.length === 0 ? (
              <p style={{ fontSize: 12, color: "#a8a29e" }}>No expenses yet</p>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <PieChart width={110} height={110}>
                  <Pie
                    data={spendingData} cx={50} cy={50}
                    innerRadius={30} outerRadius={50}
                    dataKey="value" paddingAngle={2}
                  >
                    {spendingData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={styles.tooltip}/>
                </PieChart>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {spendingData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#44403c" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }}/>
                      {d.name} — EGP {d.value.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={styles.bottomCard}>
            <p style={styles.bottomTitle}>Quick actions</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Add expense",   icon: <FiPlus />,       action: onAddExpense },
                { label: "Add income",    icon: <FiDollarSign />, action: onAddIncome  },
                {
                  label: exporting ? "Exporting…" : "Export report",
                  icon: <FiDownload />,
                  action: handleExportReport,
                  disabled: exporting,
                },
                { label: "Budget tips",   icon: <FiTrendingUp />, action: () => {}     },
              ].map(a => (
                <button
                  key={a.label}
                  style={{ ...styles.actionBtn, ...(a.disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}) }}
                  onClick={a.action}
                  disabled={a.disabled}
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.bottomCard}>
            <p style={styles.bottomTitle}>Recent transactions</p>
            {txnRows.length === 0 ? (
              <p style={{ fontSize: 12, color: "#a8a29e" }}>No transactions yet</p>
            ) : txnRows.map(t => (
              <div key={t.key} style={styles.txnItem}>
                <div style={{ ...styles.txnAvatar, ...(t.pos ? styles.txnAvatarPos : {}) }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.txnName}>{t.name}</div>
                  <div style={styles.txnCat}>{t.cat}</div>
                </div>
                <div style={{ ...styles.txnAmt, color: t.pos ? "#3B6D11" : "#A32D2D" }}>
                  {t.amt} EGP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}