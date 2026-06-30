import React, { useMemo, useState, useRef, useEffect } from "react";
import moment from "moment";
import "./home.css";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const getDateKey = (date) => moment(date).format("YYYY-MM-DD");

const ExpenseHeatmap = ({ transactions }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const scrollRef = useRef(null);

  const availableYears = useMemo(() => {
    const years = transactions
      .filter((t) => t.transactionType === "expense")
      .map((t) => moment(t.date).year());
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    if (uniqueYears.length === 0) return [moment().year()];
    if (!uniqueYears.includes(moment().year())) uniqueYears.push(moment().year());
    return uniqueYears.sort((a, b) => b - a);
  }, [transactions]);

  const [selectedYear, setSelectedYear] = useState(moment().year());

  const { weeksData, groupedExpenses, maxAmount, totalExpense, activeDays } = useMemo(() => {
    const expensesByDate = transactions
      .filter((transaction) => transaction.transactionType === "expense")
      .reduce((acc, transaction) => {
        const key = getDateKey(transaction.date);
        if (!acc[key]) {
          acc[key] = { amount: 0, count: 0, items: [] };
        }
        acc[key].amount += Number(transaction.amount) || 0;
        acc[key].count += 1;
        acc[key].items.push(transaction);
        return acc;
      }, {});

    const amountsInYear = [];
    const weeksDataArray = [];

    const gridStart = moment().year(selectedYear).startOf("year").startOf("week");
    const gridEnd = moment().year(selectedYear).endOf("year").endOf("week");

    let currentWeek = [];

    for (let day = moment(gridStart); day.isSameOrBefore(gridEnd, "day"); day.add(1, "day")) {
      const key = day.format("YYYY-MM-DD");
      const isCurrentYear = day.year() === selectedYear;
      
      const amount = expensesByDate[key]?.amount || 0;
      const count = expensesByDate[key]?.count || 0;

      if (isCurrentYear && amount > 0) {
          amountsInYear.push(amount);
      }

      currentWeek.push({
        key,
        day: day.date(),
        label: day.format("MMM D, YYYY"),
        weekday: day.day(),
        isCurrentYear,
        amount: isCurrentYear ? amount : 0,
        count: isCurrentYear ? count : 0,
      });

      if (currentWeek.length === 7) {
        const monthStartDay = currentWeek.find(d => d.day === 1 && d.isCurrentYear);
        let monthLabel = null;
        if (monthStartDay) {
            monthLabel = moment(monthStartDay.key).format("MMM");
        } else if (weeksDataArray.length === 0) {
            monthLabel = "Jan";
        }
        weeksDataArray.push({ days: currentWeek, monthLabel });
        currentWeek = [];
      }
    }

    const maxAmt = amountsInYear.length ? Math.max(...amountsInYear) : 0;
    const totalExp = amountsInYear.reduce((sum, amt) => sum + amt, 0);
    const activeD = amountsInYear.length;

    return {
      weeksData: weeksDataArray,
      groupedExpenses: expensesByDate,
      maxAmount: maxAmt,
      totalExpense: totalExp,
      activeDays: activeD,
    };
  }, [transactions, selectedYear]);

  // Auto-scroll to the current month or end of year
  useEffect(() => {
    if (scrollRef.current) {
      if (selectedYear === moment().year()) {
        const currentWeekEl = scrollRef.current.querySelector('#current-week');
        if (currentWeekEl) {
          // Scroll so the current week is neatly positioned on the right side
          scrollRef.current.scrollLeft = currentWeekEl.offsetLeft - scrollRef.current.clientWidth + 60;
        } else {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      } else {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }
  }, [weeksData, selectedYear]);

  const selectedItems = selectedDate ? groupedExpenses[selectedDate]?.items || [] : [];
  const selectedTotal = selectedDate ? groupedExpenses[selectedDate]?.amount || 0 : 0;

  const getLevel = (amount) => {
    if (amount <= 0 || maxAmount <= 0) return 0;
    const ratio = amount / maxAmount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  return (
    <div className="expense-date-view grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-6">
      <section className="glass-panel premium-card p-4 sm:p-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">
              Expenses by date
            </p>
            <div className="flex items-center gap-3">
              <h2 className="text-white text-xl sm:text-2xl font-bold">Daily spending heatmap</h2>
              <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white text-sm rounded-lg focus:ring-[#00ffb2] focus:border-[#00ffb2] block p-1.5 outline-none cursor-pointer"
              >
                  {availableYears.map(year => (
                      <option key={year} value={year} className="bg-[#0f172a]">{year}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-right sm:text-left shrink-0">
            <div className="heatmap-stat">
              <span>Total ({selectedYear})</span>
              <strong>{money(totalExpense)}</strong>
            </div>
            <div className="heatmap-stat">
              <span>Spent days</span>
              <strong>{activeDays}</strong>
            </div>
          </div>
        </div>

        <div className="flex w-full overflow-hidden">
          {/* Weekday labels */}
          <div className="flex flex-col gap-[5px] sm:gap-[6px] text-[10px] text-[var(--color-text-muted)] font-medium text-right shrink-0 mr-2 sm:mr-3 mt-[21px] sm:mt-[24px]">
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Sun</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Mon</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Tue</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Wed</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Thu</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Fri</span>
            <span className="h-[16px] sm:h-[18px] flex items-center justify-end">Sat</span>
          </div>

          <div 
            ref={scrollRef}
            className="heatmap-scroll overflow-x-auto pb-4 w-full min-w-0"
          >
            <div className="flex gap-[5px] sm:gap-[6px] min-w-max">
              {weeksData.map((week, index) => {
                const isCurrentWeek = week.days.some(d => d.key === moment().format("YYYY-MM-DD"));
                return (
                <div 
                  key={index} 
                  id={isCurrentWeek ? "current-week" : undefined}
                  className="flex flex-col gap-[5px] sm:gap-[6px]"
                >
                  <span className="text-[var(--color-text-muted)] text-[10px] sm:text-xs font-semibold h-[16px] sm:h-[18px] flex items-end overflow-visible whitespace-nowrap">
                    {week.monthLabel || ''}
                  </span>
                  {week.days.map((day) => {
                    if (!day.isCurrentYear) {
                      return <button type="button" key={day.key} className="heatmap-cell opacity-0 pointer-events-none" aria-hidden="true" />;
                    }

                    const level = getLevel(day.amount);
                    const isSelected = selectedDate === day.key;

                    return (
                      <button
                        type="button"
                        key={day.key}
                        className={`heatmap-cell level-${level} ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedDate(isSelected ? null : day.key)}
                        title={`${day.label}: ${day.amount > 0 ? money(day.amount) : "No expenses"}`}
                        aria-label={`${day.label}, ${day.count} expense transactions, ${money(day.amount)}`}
                      />
                    );
                  })}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="heatmap-legend mt-5">
          <span>Less</span>
          <i className="level-0" />
          <i className="level-1" />
          <i className="level-2" />
          <i className="level-3" />
          <i className="level-4" />
          <span>More</span>
        </div>
      </section>

      <section className="glass-panel premium-card p-4 sm:p-6">
        <div className="mb-5">
          <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">
            Selected date
          </p>
          <h3 className="text-white text-xl font-bold">
            {selectedDate ? moment(selectedDate).format("MMMM D, YYYY") : "Pick a day"}
          </h3>
          <p className="text-[var(--color-text-muted)] mt-1">
            {selectedDate
              ? `${selectedItems.length} transaction${selectedItems.length === 1 ? "" : "s"} - ${money(selectedTotal)}`
              : "Click any colored square to view expenses for that date."}
          </p>
        </div>

        <div className="date-expense-list">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <div className="date-expense-row" key={item._id}>
                <div>
                  <strong>{item.category}</strong>
                   <span>{item.title ?? ""} - {item.description}</span>
                </div>
                <b>{money(item.amount)}</b>
              </div>
            ))
          ) : (
            <div className="empty-date-state">
              {selectedDate ? "No expenses recorded on this date." : "Your daily expense details will appear here."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExpenseHeatmap;
