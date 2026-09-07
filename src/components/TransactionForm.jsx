import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Salary", "Other"];
const initialForm = { name: "", category: "Food", amount: "", type: "expense", date: new Date().toISOString().slice(0, 10), recurring: false };

function TransactionForm({ editingTransaction, onCancel }) {
  const { addTransaction, updateTransaction } = useFinance();
  const [form, setForm] = useState(() => editingTransaction ? { ...editingTransaction, amount: String(editingTransaction.amount) } : initialForm);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.category || Number(form.amount) <= 0 || !form.date) {
      setError("Add a name, category, positive amount, and date.");
      return;
    }
    if (editingTransaction) updateTransaction(editingTransaction.id, form);
    else addTransaction(form);
    setForm(initialForm);
    setError("");
    onCancel?.();
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{editingTransaction ? "Edit transaction" : "Add transaction"}</h2>
        {editingTransaction && <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">Cancel</button>}
      </div>
      {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <input aria-label="Transaction name" className={inputClass} name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Transaction name" />
        <select aria-label="Category" className={inputClass} name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
        <input aria-label="Amount" className={inputClass} type="number" min="0.01" step="0.01" name="amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" />
        <input aria-label="Date" className={inputClass} type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <select aria-label="Type" className={inputClass} name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700"><input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> Recurring transaction</label>
      </div>
      <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500">{editingTransaction ? "Save changes" : "Add transaction"}</button>
    </form>
  );
}

export default TransactionForm;
