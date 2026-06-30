import React from "react";
import Header from "../../components/Header";
import "../Home/home.css";
import "./about.css";
import AddCardIcon from "@mui/icons-material/AddCard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";

const capabilityCards = [
  {
    icon: <AddCardIcon />,
    title: "Transaction Management",
    text: "WisePay gives users a structured way to record income and expenses with payment method, amount, category, date, and description. The workflow supports adding, editing, deleting, filtering, and reviewing transactions from one focused dashboard.",
  },
  {
    icon: <AnalyticsIcon />,
    title: "Financial Analytics",
    text: "The dashboard converts transaction history into practical summaries such as income, expense, turnover, category distribution, monthly movement, and daily spending behavior.",
  },
  {
    icon: <AssessmentIcon />,
    title: "Professional Reports",
    text: "The reports area provides longer-range views with export support, trend charts, top categories, monthly comparisons, and downloadable CSV/PDF reports for offline review.",
  },
  {
    icon: <SecurityIcon />,
    title: "Account Security",
    text: "User credentials are stored with password hashing, profile settings are account-specific, and the application keeps personal financial data scoped to the signed-in user.",
  },
];

const workflowItems = [
  "Create an account and personalize the profile with an avatar.",
  "Add every income or expense entry with a category, method, date, and note.",
  "Use filters to review spending by period, transaction type, or custom date range.",
  "Switch between table, chart, and date-based views for different analysis needs.",
  "Open Reports to export financial summaries and study longer-term trends.",
];



const About = () => {
  return (
    <div className="dashboard-shell about-shell relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <section className="about-hero glass-panel premium-card">
            <div className="about-hero__content">
              <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-3">
                About WisePay
              </p>
              <h1>Personal finance management built for clarity, control, and confident decisions.</h1>
              <p>
                WisePay is a full-stack personal finance web application designed to help users track money movement,
                understand spending patterns, and maintain a clear picture of income, expenses, and balance over time.
                It combines day-to-day transaction management with analytical dashboards and professional reporting.
              </p>
            </div>
            <div className="about-hero__panel" aria-label="WisePay application summary">
              <span>Platform Focus</span>
              <strong>Personal finance intelligence</strong>
              <p>
                A secure, visual, and organized workspace for recording transactions, reviewing financial behavior,
                and exporting meaningful reports.
              </p>
            </div>
          </section>

          <section className="about-grid about-section-gap">
            {capabilityCards.map((card) => (
              <article className="glass-panel premium-card about-card" key={card.title}>
                <div className="about-card__icon">{card.icon}</div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </section>

          <section className="about-section-gap grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-6">
            <article className="glass-panel premium-card about-deep-dive">
              <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">
                Application Purpose
              </p>
              <h2>What WisePay solves</h2>
              <p>
                Many people record financial activity inconsistently, making it difficult to understand where money is
                going, how spending changes over time, and whether income is covering regular expenses. WisePay solves
                this by centralizing transaction entry, automated categorization views, date-based filtering, and
                readable analytics in one interface.
              </p>
              <p>
                The application is built around practical personal finance behavior: quick entry, clean review,
                meaningful summaries, and exportable reports. Instead of overwhelming users with raw data, WisePay
                organizes financial information into focused screens that support repeated everyday use.
              </p>
            </article>

            <aside className="glass-panel premium-card about-workflow">
              <h2>How users work with it</h2>
              <ol>
                {workflowItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </aside>
          </section>



          <section className="about-section-gap grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="glass-panel premium-card about-info-block">
              <h2>Dashboard</h2>
              <p>
                The dashboard is the operational center of WisePay. It supports transaction entry, quick filters,
                table review, visual analytics, and daily expense inspection.
              </p>
            </article>
            <article className="glass-panel premium-card about-info-block">
              <h2>Reports</h2>
              <p>
                The reports page provides a broader financial view with monthly trends, income versus expense
                comparison, category concentration, and export-ready summaries.
              </p>
            </article>
            <article className="glass-panel premium-card about-info-block">
              <h2>Profile</h2>
              <p>
                Account tools let users manage their display name, avatar, and password while keeping the experience
                personal and clearly tied to their own financial records.
              </p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default About;
