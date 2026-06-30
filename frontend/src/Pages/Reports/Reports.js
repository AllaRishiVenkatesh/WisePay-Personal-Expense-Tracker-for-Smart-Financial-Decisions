import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import { getTransactions } from "../../utils/ApiRequest";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import "../Home/home.css";
import "./reports.css";

const palette = [
  "#00ffb2",
  "#38bdf8",
  "#ff4d6d",
  "#facc15",
  "#a78bfa",
  "#34d399",
  "#fb7185",
  "#60a5fa",
  "#f472b6",
  "#22d3ee",
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const pdfMoney = (amount) =>
  `Rs. ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount || 0)}`;

const compactMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(amount || 0);

const downloadBlob = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const Reports = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("365");

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReports = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      try {
        setLoading(true);
        const user = JSON.parse(storedUser);
        const { data } = await axios.post(getTransactions, {
          userId: user._id,
          frequency: range,
          startDate: null,
          endDate: null,
          type: "all",
        });
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [range]);

  const report = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const monthlyMap = {};
    const categoryMap = {};

    sorted.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;
      const monthKey = moment(transaction.date).format("MMM YYYY");

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, income: 0, expense: 0, balance: 0 };
      }

      if (transaction.transactionType === "credit") {
        monthlyMap[monthKey].income += amount;
      } else {
        monthlyMap[monthKey].expense += amount;
        categoryMap[transaction.category] = (categoryMap[transaction.category] || 0) + amount;
      }
      monthlyMap[monthKey].balance = monthlyMap[monthKey].income - monthlyMap[monthKey].expense;
    });

    const monthlyData = Object.values(monthlyMap);
    const categoryData = Object.entries(categoryMap)
      .map(([name, value], index) => ({ name, value, color: palette[index % palette.length] }))
      .sort((a, b) => b.value - a.value);

    const totalIncome = sorted
      .filter((item) => item.transactionType === "credit")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpense = sorted
      .filter((item) => item.transactionType === "expense")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return {
      sorted,
      monthlyData,
      categoryData,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      averageMonthlyExpense: monthlyData.length ? totalExpense / monthlyData.length : 0,
      topCategory: categoryData[0],
    };
  }, [transactions]);

  const handleDownloadCsv = useCallback(() => {
    const headers = ["Date", "Transaction Type", "Category", "Payment Method", "Description", "Amount (INR)", "Status"];
    const rows = report.sorted.map((item) => [
      moment(item.date).format("YYYY-MM-DD"),
      item.transactionType.toUpperCase(),
      item.category,
      item.title ?? "N/A",
      item.description || "N/A",
      item.amount,
      "Completed"
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    downloadBlob(csv, `WisePay_Data_${moment().format("YYYY-MM-DD")}.csv`, "text/csv;charset=utf-8");
  }, [report.sorted]);

  const handleDownloadPdf = useCallback(() => {
    const doc = new jsPDF();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : { name: "User" };

    doc.setProperties({
      title: "WisePay Financial Report",
      subject: "Financial Summary",
      author: user.name,
      creator: "WisePay"
    });

    const primaryColor = [5, 150, 105]; 
    const darkText = [33, 37, 41];
    const lightText = [108, 117, 125];
    const borderColor = [222, 226, 230];

    // 1. Top Decorative Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 6, "F");

    // 2. Logo (WisePay)
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Wise", 14, 24);
    
    const wiseWidth = doc.getTextWidth("Wise");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text("Pay", 14 + wiseWidth, 24);

    // 3. Report Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text("FINANCIAL REPORT", 196, 24, { align: "right" });

    // 4. Details Section
    doc.setFontSize(10);
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.text(`Generated for:`, 14, 34);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(user.name, 40, 34);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.text(`Date:`, 14, 40);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(moment().format("MMMM Do, YYYY"), 40, 40);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.text(`Period:`, 196, 34, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(`Last ${range} Days`, 196, 40, { align: "right" });

    // Divider Line
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    // 5. Executive Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Executive Summary", 14, 55);

    const drawSummaryBox = (title, amount, x, y, valueColor) => {
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.roundedRect(x, y, 42, 22, 2, 2, "FD");
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(lightText[0], lightText[1], lightText[2]);
      doc.text(title.toUpperCase(), x + 21, y + 7, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
      doc.text(amount, x + 21, y + 15, { align: "center" });
    };

    drawSummaryBox("Total Income", pdfMoney(report.totalIncome), 14, 60, [16, 185, 129]); 
    drawSummaryBox("Total Expense", pdfMoney(report.totalExpense), 60, 60, [239, 68, 68]); 
    
    const balanceColor = report.balance >= 0 ? [16, 185, 129] : [239, 68, 68];
    drawSummaryBox("Net Balance", pdfMoney(report.balance), 106, 60, balanceColor);
    drawSummaryBox("Avg. Expense", pdfMoney(report.averageMonthlyExpense), 152, 60, darkText);

    // 6. Monthly Breakdown
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Monthly Breakdown", 14, 94);

    const monthlyBody = report.monthlyData.map(item => [
      item.month,
      pdfMoney(item.income),
      pdfMoney(item.expense),
      pdfMoney(item.balance)
    ]);

    autoTable(doc, {
      startY: 98,
      head: [["Month", "Income", "Expense", "Balance"]],
      body: monthlyBody,
      theme: 'plain',
      headStyles: { 
        fillColor: [248, 249, 250], 
        textColor: darkText, 
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: borderColor
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 5,
        textColor: darkText,
        lineWidth: 0.1,
        lineColor: borderColor
      },
      columnStyles: {
        1: { halign: 'right', textColor: [16, 185, 129] },
        2: { halign: 'right', textColor: [239, 68, 68] },
        3: { halign: 'right', fontStyle: 'bold' }
      }
    });

    // 7. Recent Transactions
    let currentY = doc.lastAutoTable.finalY + 15;
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Recent Transactions", 14, currentY);

    const txBody = report.sorted.slice(-50).reverse().map(item => [
      moment(item.date).format("MMM DD, YYYY"),
      item.category,
      (item.title || "-").slice(0, 35),
      item.transactionType.charAt(0).toUpperCase() + item.transactionType.slice(1),
      pdfMoney(item.amount)
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Date", "Category", "Description", "Type", "Amount"]],
      body: txBody,
      theme: 'plain',
      headStyles: { 
        fillColor: [248, 249, 250], 
        textColor: darkText, 
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: borderColor
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 4,
        textColor: darkText,
        lineWidth: 0.1,
        lineColor: borderColor
      },
      columnStyles: {
        3: { fontStyle: 'bold' },
        4: { halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw === 'Credit') {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (data.cell.raw === 'Expense') {
            data.cell.styles.textColor = [239, 68, 68];
          }
        }
      }
    });

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(lightText[0], lightText[1], lightText[2]);
      doc.text(`WisePay securely generated report.`, 14, 285);
      doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: "right" });
    }

    doc.save(`WisePay_Financial_Report_${moment().format("YYYY-MM-DD")}.pdf`);
  }, [range, report]);

  const tooltipStyle = {
    backgroundColor: "rgba(11,15,25,0.9)",
    border: "1px solid rgba(0,255,178,0.18)",
    borderRadius: "12px",
    color: "white",
  };

  return (
    <div className="dashboard-shell reports-shell relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <Header />
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <Spinner />
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="glass-panel p-5 sm:p-8 lg:p-10 mb-8">
              <section className="reports-toolbar flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b border-white/10">
                <div>
                <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">
                  Detailed reports
                </p>
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Financial reporting</h1>
              </div>
              <div className="reports-actions">
                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  className="premium-control px-4 py-2.5 rounded-[9999px] text-white outline-none cursor-pointer focus:outline-none"
                >
                  <option className="bg-[var(--color-background)]" value="90">Last 3 Months</option>
                  <option className="bg-[var(--color-background)]" value="180">Last 6 Months</option>
                  <option className="bg-[var(--color-background)]" value="365">Last 12 Months</option>
                </select>
                <button onClick={handleDownloadCsv} className="premium-control report-button focus:outline-none">
                  <DownloadIcon fontSize="small" />
                  CSV
                </button>
                <button onClick={handleDownloadPdf} className="btn-primary-custom report-button focus:outline-none">
                  <PictureAsPdfIcon fontSize="small" />
                  PDF
                </button>
              </div>
            </section>

            <section className="reports-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div className="glass-panel p-6">
                <span>Income</span>
                <strong className="text-[var(--color-primary)]">{money(report.totalIncome)}</strong>
              </div>
              <div className="glass-panel p-6">
                <span>Expense</span>
                <strong className="text-[var(--color-error)]">{money(report.totalExpense)}</strong>
              </div>
              <div className="glass-panel p-6">
                <span>Net balance</span>
                <strong>{money(report.balance)}</strong>
              </div>
              <div className="glass-panel p-6">
                <span>Avg monthly expense</span>
                <strong>{money(report.averageMonthlyExpense)}</strong>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <div className="glass-panel report-chart-card">
                <h2>Monthly trends</h2>
                {report.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={report.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tickFormatter={compactMoney} tick={{ fill: 'rgba(255,255,255,0.6)' }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} itemStyle={{ color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar name="Income" dataKey="income" fill="#00ffb2" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar name="Expense" dataKey="expense" fill="#ff4d6d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar name="Balance" dataKey="balance" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[320px] text-[var(--color-text-muted)]">No data available for this period.</div>
                )}
              </div>

              <div className="glass-panel report-chart-card">
                <h2>Income vs expense</h2>
                {report.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={report.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome3D" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#00b37d" stopOpacity={1}/>
                          <stop offset="30%" stopColor="#00ffb2" stopOpacity={1}/>
                          <stop offset="70%" stopColor="#00ffb2" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#008059" stopOpacity={1}/>
                        </linearGradient>
                        <linearGradient id="colorExpense3D" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#cc0026" stopOpacity={1}/>
                          <stop offset="30%" stopColor="#ff4d6d" stopOpacity={1}/>
                          <stop offset="70%" stopColor="#ff4d6d" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#99001c" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tickFormatter={compactMoney} tick={{ fill: 'rgba(255,255,255,0.6)' }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} itemStyle={{ color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar name="Expense" dataKey="expense" stackId="a" fill="url(#colorExpense3D)" maxBarSize={45} />
                      <Bar name="Income" dataKey="income" stackId="a" fill="url(#colorIncome3D)" radius={[6, 6, 0, 0]} maxBarSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[320px] text-[var(--color-text-muted)]">No data available for this period.</div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-10">
              <div className="glass-panel report-chart-card">
                <h2>Category breakdown</h2>
                {report.categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie data={report.categoryData} dataKey="value" nameKey="name" innerRadius={85} outerRadius={120} paddingAngle={2}>
                        {report.categoryData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[320px] text-[var(--color-text-muted)]">No expenses found for this period.</div>
                )}
              </div>

              <div className="glass-panel report-chart-card">
                <h2>Top expense categories</h2>
                <div className="category-report-list">
                  {report.categoryData.length > 0 ? (
                    report.categoryData.slice(0, 8).map((category) => (
                      <div className="category-report-row" key={category.name}>
                        <div>
                          <i style={{ background: category.color }} />
                          <span>{category.name}</span>
                        </div>
                        <strong>{money(category.value)}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="empty-date-state">No expense categories found for this period.</div>
                  )}
                </div>
              </div>
              </section>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Reports;
