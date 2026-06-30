import React, { useEffect, useState } from "react";
import Select from "react-select";
import { categoryOptions, customSelectStyles } from "../../utils/CategoryOptions";
import { Container, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from '@mui/icons-material/Close';
import InboxIcon from '@mui/icons-material/Inbox';
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { toast } from "react-toastify";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const openEditModal = (itemKey) => {
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      
      if (editTran.length > 0) {
        const item = editTran[0];
        setValues({
          title: item.title || "Cash",
          amount: item.amount || "",
          description: item.description || "",
          category: item.category || "",
          date: item.date ? moment(item.date).format("YYYY-MM-DD") : "",
          transactionType: item.transactionType || "",
        });
      }

      handleShow();
    }
  };

  const handleEditClick = (itemKey) => {
    setConfirmAction({
      type: "edit",
      title: "Edit transaction?",
      message: "This will open the transaction form so you can update the saved details.",
      actionLabel: "Edit",
      itemKey,
    });
  };

  const handleEditSubmit = async (e) => {
    // e.preventDefault();

    const {data} = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });

    if(data.success === true){
      toast.success(data.message || "Transaction updated successfully", toastOptions);
      await handleClose();
      await setRefresh(!refresh);
      setTimeout(() => window.location.reload(), 900);
    }
    else{
      toast.error(data.message || "Unable to update transaction", toastOptions);
    }

  }

  const handleDeleteClick = async (itemKey) => {
    setConfirmAction({
      type: "delete",
      title: "Delete transaction?",
      message: "This action will permanently remove the transaction from your records.",
      actionLabel: "Delete",
      itemKey,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "edit") {
      setConfirmAction(null);
      openEditModal(confirmAction.itemKey);
      return;
    }

    const {data} = await axios.post(`${deleteTransactions}/${confirmAction.itemKey}`,{
      userId: props.user._id,
    });

    if(data.success === true){
      setConfirmAction(null);
      toast.success(data.message || "Transaction deleted successfully", toastOptions);
      await setRefresh(!refresh);
      setTimeout(() => window.location.reload(), 900);
    }
    else{
      toast.error(data.message || "Unable to delete transaction", toastOptions);
    }
  };

  const [values, setValues] = useState({
    title: "Cash",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container fluid className="px-0">
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {props.data && props.data.length > 0 ? (
              props.data.map((item, index) => (
                <tr key={index}>
                  <td data-label="Date">{moment(item.date).format("YYYY-MM-DD")}</td>
                <td data-label="Payment Method">{item.title ?? ""}</td>
                <td data-label="Amount" className={item.transactionType === 'credit' ? 'text-[var(--color-primary)] font-bold metric-number' : 'text-[var(--color-error)] font-bold metric-number'}>
                  {item.transactionType === 'credit' ? '+' : '-'}
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)}
                </td>
                <td data-label="Type" className="capitalize">{item.transactionType}</td>
                <td data-label="Category">{item.category}</td>
                <td data-label="Action">
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-[var(--color-text-muted)] italic">
                  <div className="flex flex-col items-center justify-center gap-3 opacity-60">
                    <InboxIcon sx={{ fontSize: 48 }} />
                    <span className="font-medium">No transactions found. Add a new transaction to get started!</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      {/* Tailwind Modal for Editing */}
      {show && editingTransaction && editingTransaction.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 py-4">
          <div className="glass-panel w-full max-w-lg max-h-[92vh] p-0 overflow-y-auto shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.45)] backdrop-blur-md">
              <h3 className="text-xl font-bold text-white">Update Transaction Details</h3>
              <button onClick={handleClose} className="h-10 w-10 rounded-[9999px] flex items-center justify-center text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                <CloseIcon fontSize="small" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }} className="p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Payment Method</label>
                <select name="title" value={values.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none cursor-pointer" required>

                  {values.title && !["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer"].includes(values.title) && (
                    <option className="bg-[var(--color-background)]" value={values.title}>{values.title}</option>
                  )}
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
                  <input type="number" name="amount" placeholder={editingTransaction[0].amount} value={values.amount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none" required />
                </div>
                <div className="flex flex-col">
                  <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Date</label>
                  <input type="date" name="date" value={values.date} onChange={handleChange} max={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text-muted)] focus:text-white focus:border-[var(--color-primary)] outline-none [color-scheme:dark]" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Transaction Type</label>
                  <select name="transactionType" value={values.transactionType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none cursor-pointer" required>
                    <option className="bg-[var(--color-background)]" value="">Choose...</option>
                    <option className="bg-[var(--color-background)]" value="credit">Credit</option>
                    <option className="bg-[var(--color-background)]" value="expense">Expense</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Category</label>
                  <Select
                    options={categoryOptions}
                    styles={customSelectStyles}
                    placeholder="Search category..."
                    value={categoryOptions.flatMap(g => g.options).find(opt => opt.value === values.category) || (values.category ? { label: values.category, value: values.category } : null)}
                    onChange={(selectedOption) => setValues({...values, category: selectedOption ? selectedOption.value : ""})}
                    isClearable
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[var(--color-text-muted)] text-sm mb-1 font-medium">Description</label>
                <input type="text" name="description" placeholder={editingTransaction[0].description} value={values.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] text-white focus:border-[var(--color-primary)] outline-none" required />
              </div>

              <div className="grid grid-cols-2 sm:flex sm:justify-end gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-lg font-medium bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                  Close
                </button>
                <button type="submit" className="btn-primary-custom px-6 py-2.5 rounded-lg font-bold">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-4 py-4">
          <div className="glass-panel w-full max-w-md p-0 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.35)]">
              <h3 className="text-lg sm:text-xl font-bold text-white">{confirmAction.title}</h3>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="h-10 w-10 rounded-[9999px] flex items-center justify-center text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-6">
                {confirmAction.message}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="px-5 py-2.5 rounded-lg font-medium bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-5 py-2.5 rounded-lg font-bold transition-colors ${
                    confirmAction.type === "delete"
                      ? "bg-[var(--color-error)] text-white hover:opacity-90"
                      : "btn-primary-custom"
                  }`}
                >
                  {confirmAction.actionLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableData;
