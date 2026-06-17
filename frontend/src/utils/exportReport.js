import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const monthKeyOf = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabelOf = (key) => {
  const [y, m] = key.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

const fmtMoney = (n, currency = "EGP") =>
  `${currency} ${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


function buildMonthlyStats(expenses, incomes) {
  const buckets = {}; // key -> { income, expenses }

  for (const inc of incomes) {
    const k = monthKeyOf(inc.Date);
    if (!buckets[k]) buckets[k] = { income: 0, expenses: 0 };
    buckets[k].income += Number(inc.Amount || 0);
  }
  for (const exp of expenses) {
    const k = monthKeyOf(exp.Date);
    if (!buckets[k]) buckets[k] = { income: 0, expenses: 0 };
    buckets[k].expenses += Number(exp.Amount || 0);
  }

  const keys = Object.keys(buckets).sort(); // chronological ascending

  return keys.map((k) => {
    const { income, expenses: exp } = buckets[k];
    const net = income - exp;
    const savingsRate = income > 0 ? (net / income) * 100 : 0;
    return {
      key: k,
      label: monthLabelOf(k),
      income,
      expenses: exp,
      net,
      savingsRate,
    };
  });
}


export async function exportFinancialReportPDF({
  expenses = [],
  incomes = [],
  userName = "",
  currency = "EGP",
} = {}) {
  const { jsPDF } = await loadJsPDF();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // ---------- Aggregate numbers ----------
  const totalIncome = incomes.reduce((s, i) => s + Number(i.Amount || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.Amount || 0), 0);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  const monthlyStats = buildMonthlyStats(expenses, incomes);

  // ---------- Header ----------
  const ACCENT = [201, 80, 60];   // matches app's ACCENT-ish tone
  const DARK = [40, 38, 36];
  const GRAY = [120, 113, 108];

  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageWidth, 70, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Financial Report", margin, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(
    `Generated on ${todayStr}${userName ? `  •  ${userName}` : ""}`,
    margin,
    50
  );

  let y = 95;

  // ---------- Summary cards (drawn as simple boxes) ----------
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Overall Summary", margin, y);
  y += 14;

  const cardW = (pageWidth - margin * 2 - 3 * 10) / 4;
  const cardH = 54;
  const cards = [
    { label: "Total Income", value: fmtMoney(totalIncome, currency), color: [59, 109, 17] },
    { label: "Total Expenses", value: fmtMoney(totalExpenses, currency), color: [163, 45, 45] },
    { label: "Net Income", value: fmtMoney(netIncome, currency), color: netIncome >= 0 ? [59, 109, 17] : [163, 45, 45] },
    { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, color: [40, 38, 36] },
  ];

  cards.forEach((c, idx) => {
    const x = margin + idx * (cardW + 10);
    doc.setDrawColor(225, 220, 215);
    doc.setFillColor(250, 248, 246);
    doc.roundedRect(x, y, cardW, cardH, 4, 4, "FD");

    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(c.label, x + 8, y + 18);

    doc.setTextColor(...c.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text(c.value, x + 8, y + 38, { maxWidth: cardW - 16 });
  });

  y += cardH + 28;

  // ---------- Monthly statistics table ----------
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Monthly Breakdown", margin, y);
  y += 10;

  const monthlyRows = monthlyStats.map((m) => [
    m.label,
    fmtMoney(m.income, currency),
    fmtMoney(m.expenses, currency),
    fmtMoney(m.net, currency),
    `${m.savingsRate.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: y + 6,
    margin: { left: margin, right: margin },
    head: [["Month", "Income", "Expenses", "Net Income", "Savings Rate"]],
    body: monthlyRows.length ? monthlyRows : [["—", "—", "—", "—", "—"]],
    theme: "striped",
    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 6 },
    headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    didParseCell: (data) => {
      // Color net income column red/green
      if (data.section === "body" && data.column.index === 3) {
        const rowStat = monthlyStats[data.row.index];
        if (rowStat) {
          data.cell.styles.textColor = rowStat.net >= 0 ? [59, 109, 17] : [163, 45, 45];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 28;

  // ---------- Expense category breakdown ----------
  const categoryTotals = {};
  for (const e of expenses) {
    const cat = e.Category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.Amount || 0);
  }
  const categoryRows = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => [
      cat,
      fmtMoney(total, currency),
      totalExpenses > 0 ? `${((total / totalExpenses) * 100).toFixed(1)}%` : "0.0%",
    ]);

  if (categoryRows.length) {
    ensureSpace(doc, y, 60);
    y = currentY(doc, y);

    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Expenses by Category", margin, y);

    autoTable(doc, {
      startY: y + 6,
      margin: { left: margin, right: margin },
      head: [["Category", "Total", "% of Expenses"]],
      body: categoryRows,
      theme: "striped",
      styles: { font: "helvetica", fontSize: 9.5, cellPadding: 6 },
      headStyles: { fillColor: [70, 65, 60], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
    });

    y = doc.lastAutoTable.finalY + 28;
  }

  // ---------- Detailed transactions: Income ----------
  if (incomes.length) {
    doc.addPage();
    y = 50;
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Income — Detailed List", margin, y);

    const incomeRows = [...incomes]
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))
      .map((i) => [
        fmtDate(i.Date),
        i.Title || "",
        i.Source || "",
        fmtMoney(i.Amount, i.Currency || currency),
      ]);

    autoTable(doc,{
      startY: y + 10,
      margin: { left: margin, right: margin },
      head: [["Date", "Title", "Source", "Amount"]],
      body: incomeRows,
      theme: "striped",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [59, 109, 17], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 3: { halign: "right" } },
    });
  }

  // ---------- Detailed transactions: Expenses ----------
  if (expenses.length) {
    doc.addPage();
    y = 50;
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Expenses — Detailed List", margin, y);

    const expenseRows = [...expenses]
      .sort((a, b) => new Date(b.Date) - new Date(a.Date))
      .map((e) => [
        fmtDate(e.Date),
        e.Title || "",
        e.Category || "Other",
        fmtMoney(e.Amount, e.Currency || currency),
      ]);

    autoTable(doc, {
      startY: y + 10,
      margin: { left: margin, right: margin },
      head: [["Date", "Title", "Category", "Amount"]],
      body: expenseRows,
      theme: "striped",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [163, 45, 45], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 3: { halign: "right" } },
    });
  }

  // ---------- Footer page numbers ----------
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(
      `Page ${p} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 20,
      { align: "right" }
    );
    doc.text("Generated by ABO_3LAAAA", margin, doc.internal.pageSize.getHeight() - 20);
  }

  const filename = `financial-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ---------- small layout helpers ----------
function currentY(doc, y) {
  return y;
}
function ensureSpace(doc, y, needed) {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + needed > pageH - 40) {
    doc.addPage();
  }
}

// ---------- Lazy-load jsPDF + autotable (works whether or not they're npm deps) ----------
let _jsPDFPromise = null;
function loadJsPDF() {
  if (_jsPDFPromise) return _jsPDFPromise;

  _jsPDFPromise = (async () => {
    // Prefer npm-installed packages if present (recommended path — see notes below).
    try {
      const jsPDFModule = await import("jspdf");
      await import("jspdf-autotable");
      return { jsPDF: jsPDFModule.jsPDF || jsPDFModule.default };
    } catch (err) {
      // Fallback: load from CDN if the packages aren't installed in node_modules.
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"
      );
      return { jsPDF: window.jspdf.jsPDF };
    }
  })();

  return _jsPDFPromise;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}