import React from "react";
import { categoryOptions } from "../../utils/CategoryOptions";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import moment from "moment";

const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

const Analytics = ({ transactions }) => {
  const availableMonths = React.useMemo(() => {
    const months = new Set(transactions.map((t) => moment(t.date).format("YYYY-MM")));
    months.add(moment().format("YYYY-MM")); // Ensure current month is always an option
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = React.useState(moment().format("YYYY-MM"));

  const filteredTransactions = React.useMemo(() => {
    if (selectedMonth === "all") return transactions;
    return transactions.filter(
      (t) => moment(t.date).format("YYYY-MM") === selectedMonth
    );
  }, [transactions, selectedMonth]);

  const TotalTransactions = filteredTransactions.length;
  const totalIncomeTransactions = filteredTransactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = filteredTransactions.filter(
    (item) => item.transactionType === "expense"
  );

  const totalIncomePercent =
    TotalTransactions === 0 ? 0 : (totalIncomeTransactions.length / TotalTransactions) * 100;
  const totalExpensePercent =
    TotalTransactions === 0 ? 0 : (totalExpenseTransactions.length / TotalTransactions) * 100;

  const totalTurnOver = filteredTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = totalIncomeTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverExpense = totalExpenseTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const TurnOverIncomePercent =
    totalTurnOver === 0 ? 0 : (totalTurnOverIncome / totalTurnOver) * 100;
  const TurnOverExpensePercent =
    totalTurnOver === 0 ? 0 : (totalTurnOverExpense / totalTurnOver) * 100;

  const categories = categoryOptions.flatMap((group) =>
    group.options.map((opt) => opt.value)
  );

  const palette = [
    "#00ffb2",
    "#7c3aed",
    "#38bdf8",
    "#ff4d6d",
    "#facc15",
    "#22d3ee",
    "#a78bfa",
    "#34d399",
    "#fb7185",
    "#60a5fa",
    "#c084fc",
    "#f472b6",
  ];

  const colors = {};
  categories.forEach((cat, index) => {
    colors[cat] = palette[index % palette.length];
  });

  const expenseData = categories
    .map((category) => {
      const amount = filteredTransactions
        .filter((t) => t.transactionType === "expense" && t.category === category)
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: category, value: amount, color: colors[category] };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const topCategory = expenseData.length > 0 ? expenseData[0] : null;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold">Analytics Overview</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white text-xs sm:text-sm rounded-lg focus:ring-[#00ffb2] focus:border-[#00ffb2] block p-2 outline-none cursor-pointer w-full sm:w-auto"
        >
          {availableMonths.map((month) => (
            <option key={month} value={month} className="bg-[#0f172a]">
              {moment(month).format("MMMM YYYY")}
            </option>
          ))}
          <option value="all" className="bg-[#0f172a]">All Time</option>
        </select>
      </div>
      {topCategory && (
        <div className="glass-panel premium-card overflow-hidden flex flex-col p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-2.5 w-2.5 rounded-[9999px] bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary-glow)]" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Top Spending:{" "}
              <span className="text-[var(--color-error)]">{topCategory.name}</span>
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
            <div className="w-full md:w-1/2 h-[240px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={700}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => money(value)}
                    contentStyle={{
                      backgroundColor: "rgba(11,15,25,0.82)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(0,255,178,0.18)",
                      borderRadius: "16px",
                      color: "white",
                      boxShadow: "0 0 24px rgba(0,255,178,0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="insight-terminal w-full md:w-1/2 text-left p-4 sm:p-6 rounded-[20px]">
              <h4 className="text-base sm:text-lg font-bold text-[var(--color-primary)] mb-3">
                Insight Signal
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-white list-disc pl-5 text-sm sm:text-base">
                <li>
                  You spent the most on{" "}
                  <strong className="text-[var(--color-error)]">{topCategory.name}</strong>{" "}
                  this period: <span className="metric-number">{money(topCategory.value)}</span>.
                </li>
                {expenseData.length > 1 && (
                  <li>
                    Your second highest expense was <strong>{expenseData[1].name}</strong>{" "}
                    at <span className="metric-number">{money(expenseData[1].value)}</span>.
                  </li>
                )}
                <li>
                  Total expenses are distributed across{" "}
                  <strong className="text-white">{expenseData.length}</strong> categories.
                </li>
                {totalIncomePercent < totalExpensePercent && (
                  <li className="text-[var(--color-error)]">
                    Warning: Your expenses represent a higher percentage of transactions than
                    your income.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel premium-card overflow-hidden flex flex-col h-full">
          <div className="bg-[rgba(255,255,255,0.045)] p-4 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-bold text-white">Total Transactions:</span>{" "}
            <span className="metric-number text-[var(--color-primary)] font-bold">
              {TotalTransactions}
            </span>
          </div>
          <div className="p-6 flex-grow flex flex-col items-center">
            <div className="w-full flex justify-between mb-6">
              <h5 className="text-[var(--color-primary)] font-semibold flex items-center gap-1 text-sm">
                <ArrowDropUpIcon /> Income: {totalIncomeTransactions.length}
              </h5>
              <h5 className="text-[var(--color-error)] font-semibold flex items-center gap-1 text-sm">
                <ArrowDropDownIcon /> Expense: {totalExpenseTransactions.length}
              </h5>
            </div>
            <div className="flex gap-4 justify-center mt-2 w-full">
              <div className="flex flex-col items-center gap-2 w-1/2">
                <CircularProgressBar
                  percentage={totalIncomePercent.toFixed(0)}
                  color="#00ffb2"
                />
              </div>
              <div className="flex flex-col items-center gap-2 w-1/2">
                <CircularProgressBar
                  percentage={totalExpensePercent.toFixed(0)}
                  color="#ff4d6d"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel premium-card overflow-hidden flex flex-col h-full">
          <div className="bg-[rgba(255,255,255,0.045)] p-4 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-bold text-white">Total Turnover:</span>{" "}
            <span className="metric-number text-[var(--color-primary)] font-bold">
              {totalTurnOver}
            </span>
          </div>
          <div className="p-6 flex-grow flex flex-col items-center">
            <div className="w-full flex justify-between mb-6">
              <h5 className="metric-number text-[var(--color-primary)] font-semibold flex items-center gap-1 text-sm">
                <ArrowDropUpIcon /> {totalTurnOverIncome}
              </h5>
              <h5 className="metric-number text-[var(--color-error)] font-semibold flex items-center gap-1 text-sm">
                <ArrowDropDownIcon /> {totalTurnOverExpense}
              </h5>
            </div>
            <div className="flex gap-4 justify-center mt-2 w-full">
              <div className="flex flex-col items-center gap-2 w-1/2">
                <CircularProgressBar
                  percentage={TurnOverIncomePercent.toFixed(0)}
                  color="#00ffb2"
                />
              </div>
              <div className="flex flex-col items-center gap-2 w-1/2">
                <CircularProgressBar
                  percentage={TurnOverExpensePercent.toFixed(0)}
                  color="#ff4d6d"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel premium-card overflow-hidden flex flex-col h-full">
          <div className="bg-[rgba(255,255,255,0.045)] p-4 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-bold text-white">Categorywise Income</span>
          </div>
          <div className="p-6 flex-grow overflow-y-auto max-h-[300px]">
            {categories.map((category) => {
              const income = filteredTransactions
                .filter(
                  (transaction) =>
                    transaction.transactionType === "credit" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);
              const incomePercent = totalTurnOver === 0 ? 0 : (income / totalTurnOver) * 100;
              return income > 0 ? (
                <div key={category} className="mb-4">
                  <LineProgressBar
                    label={category}
                    percentage={incomePercent.toFixed(0)}
                    lineColor={colors[category]}
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="glass-panel premium-card overflow-hidden flex flex-col h-full">
          <div className="bg-[rgba(255,255,255,0.045)] p-4 border-b border-[rgba(255,255,255,0.08)]">
            <span className="font-bold text-white">Categorywise Expense</span>
          </div>
          <div className="p-6 flex-grow overflow-y-auto max-h-[300px]">
            {categories.map((category) => {
              const expenses = filteredTransactions
                .filter(
                  (transaction) =>
                    transaction.transactionType === "expense" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);
              const expensePercent =
                totalTurnOver === 0 ? 0 : (expenses / totalTurnOver) * 100;
              return expenses > 0 ? (
                <div key={category} className="mb-4">
                  <LineProgressBar
                    label={category}
                    percentage={expensePercent.toFixed(0)}
                    lineColor={colors[category]}
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
