import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

import Sidebar       from "../../components/Sidebar";
import ExpenseModal  from "../../components/ExpenseModal";
import IncomeModal   from "../../components/IncomeModal";
import DashboardPage from "./Dashboard";
import ExpensesPage  from "./ExpensesPage";
import IncomePage    from "./IncomePage";
import SettingsPage from "./SettingsPage";

import styles from "../../styles/dashboardStyles";

const toArr = (d) =>
  Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.income ?? d?.expenses ?? [];
const toRFC3339 = (d) => d ? `${d}T00:00:00Z` : null;

const EMPTY_EXPENSE = { title: "", amount: "", category: "", description: "", date: "", currency: "EGP" };
const EMPTY_INCOME  = { title: "", amount: "", source: "",   description: "", date: "", currency: "EGP" };

const lastMonthKeys = (n) => {
  const now = new Date();
  return Array.from({ length: n }, (_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - idx), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
};
const monthKeyOf   = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`; };
const monthLabelOf = (k) => { const [y, m] = k.split("-"); return new Date(+y, +m - 1, 1).toLocaleDateString("en-GB", { month: "short" }); };

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [expenses, setExpenses] = useState([]);
  const [incomes,  setIncomes]  = useState([]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal,  setShowIncomeModal]  = useState(false);

  const [expenseData, setExpenseData] = useState(EMPTY_EXPENSE);
  const [incomeData,  setIncomeData]  = useState(EMPTY_INCOME);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome,  setEditingIncome]  = useState(null);

  const [dashboard, setDashboard] = useState({ total_income: 0, total_expenses: 0, balance: 0 });
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) { window.location.href = "/login"; return; }
    Promise.all([loadDashboard(), loadExpenses(), loadIncome()]).finally(() => setLoading(false));
  }, []);

  const loadDashboard = async () => {
    try { const r = await api.get("/dashboard"); setDashboard(r.data); }
    catch (e) { console.error(e); }
  };
  const loadExpenses = async () => {
    try { const r = await api.get("/expenses"); setExpenses(toArr(r.data)); }
    catch (e) { console.error(e); }
  };
  const loadIncome = async () => {
    try { const r = await api.get("/income"); setIncomes(toArr(r.data)); }
    catch (e) { console.error(e); }
  };

  // ── Expense actions ──
  const openEditExpense = (exp) => {
    setEditingExpense(exp.ID);
    setExpenseData({
      title:       exp.Title,
      amount:      exp.Amount,
      category:    exp.Category || "",
      description: exp.Description || "",
      date:        exp.Date ? exp.Date.slice(0, 10) : "",
      currency:    exp.Currency || "EGP",
    });
    setShowExpenseModal(true);
  };

  const saveExpense = async () => {
    try {
      const payload = {
        title: expenseData.title, amount: Number(expenseData.amount),
        category: expenseData.category, description: expenseData.description,
        date: toRFC3339(expenseData.date), currency: expenseData.currency,
      };
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense}`, payload);
      } else {
        await api.post("/expenses", payload);
      }
      setShowExpenseModal(false);
      setExpenseData(EMPTY_EXPENSE);
      setEditingExpense(null);
      loadDashboard();
      loadExpenses();
    } catch (e) { console.error(e.response?.data); }
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setExpenseData(EMPTY_EXPENSE);
    setEditingExpense(null);
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.ID !== id));
      loadDashboard();
    } catch (e) { console.error(e.response?.data); }
  };

  // ── Income actions ──
  const addIncome = async () => {
    try {
      await api.post("/income", {
        title: incomeData.title, amount: Number(incomeData.amount),
        source: incomeData.source, description: incomeData.description,
        date: toRFC3339(incomeData.date), currency: incomeData.currency,
      });
      setShowIncomeModal(false);
      setIncomeData(EMPTY_INCOME);
      loadDashboard();
      loadIncome();
    } catch (e) { console.error(e.response?.data); }
  };

  const openEditIncome = (inc) => {
    setEditingIncome(inc.ID);
    setIncomeData({
      title:       inc.Title,
      amount:      inc.Amount,
      source:      inc.Source || "",
      description: inc.Description || "",
      date:        inc.Date ? inc.Date.slice(0, 10) : "",
      currency:    inc.Currency || "EGP",
    });
    setShowIncomeModal(true);
  };

  const saveIncome = async () => {
    try {
      if (editingIncome) {
        await api.put(`/income/${editingIncome}`, {
          title: incomeData.title, amount: Number(incomeData.amount),
          source: incomeData.source, description: incomeData.description,
          date: toRFC3339(incomeData.date), currency: incomeData.currency,
        });
      } else {
        await addIncome();
        return;
      }
      setShowIncomeModal(false);
      setIncomeData(EMPTY_INCOME);
      setEditingIncome(null);
      loadDashboard();
      loadIncome();
    } catch (e) { console.error(e.response?.data); }
  };

  const closeIncomeModal = () => {
    setShowIncomeModal(false);
    setIncomeData(EMPTY_INCOME);
    setEditingIncome(null);
  };

  const deleteIncome = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      await api.delete(`/income/${id}`);
      setIncomes(prev => prev.filter(i => i.ID !== id));
      loadDashboard();
    } catch (e) { console.error(e.response?.data); }
  };

  const handleNav = (page) => {
    setActivePage(page);
    if (page === "expenses") loadExpenses();
    if (page === "income")   loadIncome();
  };

  const savingsRate = dashboard.total_income > 0
    ? ((dashboard.balance / dashboard.total_income) * 100).toFixed(1)
    : "0.0";

  const categoryBreakdown = useMemo(() => {
    const totals = {};
    for (const e of expenses) {
      const cat = e.Category || "Other";
      totals[cat] = (totals[cat] || 0) + Number(e.Amount || 0);
    }
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals)
      .map(([category, total]) => ({ category, total, percentage: grand > 0 ? Math.round((total / grand) * 1000) / 10 : 0 }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const monthlyTrend = useMemo(() => {
    const keys = lastMonthKeys(6);
    const buckets = Object.fromEntries(keys.map(k => [k, { month: monthLabelOf(k), income: 0, expenses: 0 }]));
    for (const e of expenses) { const k = monthKeyOf(e.Date); if (buckets[k]) buckets[k].expenses += Number(e.Amount || 0); }
    for (const i of incomes)  { const k = monthKeyOf(i.Date); if (buckets[k]) buckets[k].income  += Number(i.Amount  || 0); }
    return keys.map(k => buckets[k]);
  }, [expenses, incomes]);

  const recentTransactions = useMemo(() => {
    const byDateDesc = (a, b) => new Date(b.Date) - new Date(a.Date);
    return {
      lastExpense:    [...expenses].sort(byDateDesc)[0] || null,
      lastTwoIncomes: [...incomes].sort(byDateDesc).slice(0, 2),
    };
  }, [expenses, incomes]);

  if (loading) return (
    <div style={styles.loadWrap}><div style={styles.loadSpinner}/></div>
  );

  return (
    <div style={styles.dash}>
      <Sidebar activePage={activePage} onNavigate={handleNav}/>
      <div style={styles.main}>
        {activePage === "dashboard" && (
          <DashboardPage
            dashboard={dashboard}
            savingsRate={savingsRate}
            categoryBreakdown={categoryBreakdown}
            monthlyTrend={monthlyTrend}
            recentTransactions={recentTransactions}
            expenses={expenses}
            incomes={incomes}

            onAddExpense={() => { setEditingExpense(null); setShowExpenseModal(true); }}
            onAddIncome={() => { setEditingIncome(null); setShowIncomeModal(true); }}
          />
        )}
        {activePage === "expenses" && (
          <ExpensesPage
            expenses={expenses} dashboard={dashboard}
            onBack={() => setActivePage("dashboard")}
            onAddExpense={() => { setEditingExpense(null); setShowExpenseModal(true); }}
            onEditExpense={openEditExpense}
            onDeleteExpense={deleteExpense}
          />
        )}
        {activePage === "income" && (
          <IncomePage
            incomes={incomes} dashboard={dashboard}
            onBack={() => setActivePage("dashboard")}
            onAddIncome={() => { setEditingIncome(null); setShowIncomeModal(true); }}
            onEditIncome={openEditIncome}
            onDeleteIncome={deleteIncome}
          />
        )}
        {activePage === "settings" && (
  <SettingsPage onBack={() => setActivePage("dashboard")}/>
)}
      </div>

      {showExpenseModal && (
        <ExpenseModal
          data={expenseData} onChange={setExpenseData}
          onSave={saveExpense} onClose={closeExpenseModal}
          isEditing={!!editingExpense}
        />
      )}
      {showIncomeModal && (
        <IncomeModal
          data={incomeData} onChange={setIncomeData}
          onSave={saveIncome} onClose={closeIncomeModal}
          isEditing={!!editingIncome}
        />
      )}
    </div>
  );
}