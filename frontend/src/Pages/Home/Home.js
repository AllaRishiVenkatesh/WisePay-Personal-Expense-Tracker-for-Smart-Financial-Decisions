import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { categoryOptions, customSelectStyles } from "../../utils/CategoryOptions";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Analytics from "./Analytics";
import ExpenseHeatmap from "./ExpenseHeatmap";
import CloseIcon from '@mui/icons-material/Close';

const initialTransactionValues = {
  title: "Cash",
  amount: "",
  description: "",
  category: "",
  date: "",
  transactionType: "",
};

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("365");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const viewIndex = ["table", "chart", "dates"].indexOf(view);

  // form states
  const [values, setValues] = useState(initialTransactionValues);

  const handleStartChange = (date) => setStartDate(date);
  const handleEndChange = (date) => setEndDate(date);
  const resetTransactionForm = () => setValues(initialTransactionValues);
  const handleClose = () => {
    setShow(false);
    resetTransactionForm();
  };
  const handleShow = () => {
    resetTransactionForm();
    setShow(true);
  };

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };
    avatarFunc();
  }, [navigate]);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const handleChangeFrequency = (e) => setFrequency(e.target.value);
  const handleSetType = (e) => setType(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(addTransaction, {
        title, amount, description, category, date, transactionType, userId: cUser._id,
      });

      if (data.success === true) {
        toast.success(data.message, toastOptions);
        handleClose();
        resetTransactionForm();
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      toast.error("Error adding transaction", toastOptions);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      if(!cUser) return;
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id, frequency, startDate, endDate, type,
        });
        setTransactions(data.transactions);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div className="dashboard-shell relative min-h-screen overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 24, density: { enable: true, value_area: 1100 } },
            color: { value: ["#00ffb2", "#7c3aed", "#38bdf8"] },
            shape: {
              type: "char",
              character: [
                { value: "$", font: "Arial", weight: "bold" },
                { value: "₹", font: "Arial", weight: "bold" },
                { value: "€", font: "Arial", weight: "bold" },
              ],
            },
            opacity: { value: 0.12, random: true },
            size: { value: { min: 4, max: 9 } },
            move: {
              enable: true,
              speed: 0.45,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
            rotate: {
              value: { min: 0, max: 360 },
              direction: "random",
              animation: { enable: true, speed: 5 },
            }
          },
          detectRetina: true,
        }}
      />
      <div className="relative z-10">
        <Header />

        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <Spinner />
          </div>
      ) : (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="glass-panel p-5 sm:p-8 lg:p-10 mb-8">
            {/* Filters Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end pb-6 sm:pb-8 border-b border-[rgba(255,255,255,0.1)] mb-6 sm:mb-8">
            
              <div className="flex flex-row gap-3 items-end w-full">
                <div className="flex flex-col w-1/2">
                  <label className="text-[var(--color-text-muted)] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">Frequency</label>
                  <select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                    className="premium-control w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-[9999px] text-xs sm:text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option className="bg-[var(--color-background)]" value="7">Week</option>
                    <option className="bg-[var(--color-background)]" value="30">Month</option>
                    <option className="bg-[var(--color-background)]" value="365">Year</option>
                    <option className="bg-[var(--color-background)]" value="custom">Custom</option>
                  </select>
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="text-[var(--color-text-muted)] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    name="type"
                    value={type}
                    onChange={handleSetType}
                    className="premium-control w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-[9999px] text-xs sm:text-sm text-white outline-none transition-all cursor-pointer"
                  >
                    <option className="bg-[var(--color-background)]" value="all">All</option>
                    <option className="bg-[var(--color-background)]" value="expense">Exp</option>
                    <option className="bg-[var(--color-background)]" value="credit">Inc</option>
                  </select>
                </div>
              </div>

              {/* Centered View Switch */}
              <div className="flex justify-center items-center h-full w-full">
                <div className="view-switch" style={{ "--active-index": viewIndex }}>
                  <span className="view-switch__indicator" aria-hidden="true" />
                  <div className="relative group flex justify-center">
                    <button 
                      onClick={() => setView("table")}
                      className={`view-switch__button ${view === "table" ? "is-active" : ""}`}
                      aria-label="Show table"
                      aria-pressed={view === "table"}
                    >
                      <FormatListBulletedIcon />
                    </button>
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-[rgba(11,15,25,0.95)] border border-[rgba(255,255,255,0.15)] text-white text-xs font-semibold whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                      List View
                    </div>
                  </div>

                  <div className="relative group flex justify-center">
                    <button 
                      onClick={() => setView("chart")}
                      className={`view-switch__button ${view === "chart" ? "is-active" : ""}`}
                      aria-label="Show analytics"
                      aria-pressed={view === "chart"}
                    >
                      <BarChartIcon />
                    </button>
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-[rgba(11,15,25,0.95)] border border-[rgba(255,255,255,0.15)] text-white text-xs font-semibold whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                      Chart View
                    </div>
                  </div>

                  <div className="relative group flex justify-center">
                    <button 
                      onClick={() => setView("dates")}
                      className={`view-switch__button ${view === "dates" ? "is-active" : ""}`}
                      aria-label="Show expenses by date"
                      aria-pressed={view === "dates"}
                    >
                      <CalendarMonthIcon />
                    </button>
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-[rgba(11,15,25,0.95)] border border-[rgba(255,255,255,0.15)] text-white text-xs font-semibold whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                      Calendar View
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start sm:justify-center lg:justify-end items-center h-full w-full">
                <button onClick={handleShow} className="btn-primary-custom px-5 sm:px-6 py-2.5 rounded-[9999px] font-bold">
                  + Add New
                </button>
              </div>
            </div>



          {/* Custom Date Picker row */}
          {frequency === "custom" && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[rgba(255,255,255,0.1)]">
              <div className="flex flex-col">
                <label className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="premium-control w-full px-4 py-2.5 rounded-[9999px] text-white outline-none cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="premium-control w-full px-4 py-2.5 rounded-[9999px] text-white outline-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Content View */}
          <div className="mb-12">
            {view === "table" ? (
              <TableData data={transactions} user={cUser} />
            ) : view === "chart" ? (
              <Analytics transactions={transactions} user={cUser} />
            ) : (
              <ExpenseHeatmap transactions={transactions} />
            )}
          </div>

          {/* Tailwind Modal */}
          {show && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 py-4">
              <div className="glass-panel w-full max-w-lg max-h-[92vh] p-0 overflow-y-auto shadow-2xl animate-fade-in-up">
                <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.45)] backdrop-blur-md">
                  <h3 className="text-xl font-bold text-white">Add Transaction</h3>
                  <button onClick={handleClose} className="h-10 w-10 rounded-[9999px] flex items-center justify-center text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Payment Method</label>
                    <select name="title" value={values.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none cursor-pointer" required>

                      <option className="bg-[var(--color-background)]" value="Cash">Cash</option>
                      <option className="bg-[var(--color-background)]" value="Credit Card">Credit Card</option>
                      <option className="bg-[var(--color-background)]" value="Debit Card">Debit Card</option>
                      <option className="bg-[var(--color-background)]" value="UPI">UPI / Mobile Wallet</option>
                      <option className="bg-[var(--color-background)]" value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Amount</label>
                      <input type="number" name="amount" placeholder="0.00" value={values.amount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none" required />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Date</label>
                      <input type="date" name="date" value={values.date} onChange={handleChange} max={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text-muted)] focus:text-white focus:border-[var(--color-primary)] outline-none [color-scheme:dark]" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Type</label>
                      <select name="transactionType" value={values.transactionType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none cursor-pointer" required>
                        <option className="bg-[var(--color-background)]" value="">Choose...</option>
                        <option className="bg-[var(--color-background)]" value="credit">Income</option>
                        <option className="bg-[var(--color-background)]" value="expense">Expense</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                    <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Category</label>
                    <Select
                      options={categoryOptions}
                      styles={customSelectStyles}
                      placeholder="Search category..."
                      value={categoryOptions.flatMap(g => g.options).find(opt => opt.value === values.category) || null}
                      onChange={(selectedOption) => setValues({...values, category: selectedOption ? selectedOption.value : ""})}
                      isClearable
                    />
                  </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Description</label>
                    <input type="text" name="description" placeholder="A short note..." value={values.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none" required />
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:justify-end gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg font-medium bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-custom px-6 py-2.5 rounded-lg font-bold">
                      Save Transaction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ToastContainer />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
