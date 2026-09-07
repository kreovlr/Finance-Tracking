import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const categories = ["Food", "Transport", "Bills", "Shopping", "Health", "Other"];

export default function Budgets() {
  const { budgets, transactions, addBudget, deleteBudget, formatCurrency } = useFinance();
  const [form, setForm] = useState({ category: "Food", amount: "" });
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (Number(form.amount) <= 0) {
      setError("Enter a positive monthly limit.");
      return;
    }
    addBudget(form);
    setForm({ ...form, amount: "" });
    setError("");
  }

  return <div><div className="mb-6"><h1 className="text-3xl font-bold">Monthly budgets</h1><p className="mt-1 text-slate-500 dark:text-slate-400">Set a limit and keep spending visible.</p></div>
    <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_auto] dark:border-slate-800 dark:bg-slate-900"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800">{categories.map((category) => <option key={category}>{category}</option>)}</select><input aria-label="Monthly budget amount" type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Monthly limit" className="rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800" /><button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Add budget</button>{error && <p className="text-sm text-rose-600 md:col-span-3">{error}</p>}</form>
    <div className="grid gap-4 md:grid-cols-2">{budgets.map((budget) => { const spent = transactions.filter((item) => item.type === "expense" && item.category === budget.category).reduce((total, item) => total + Number(item.amount), 0); const percent = Math.min((spent / budget.amount) * 100, 100); return <div key={budget.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><div><h2 className="font-semibold">{budget.category}</h2><p className="text-sm text-slate-500">{formatCurrency(spent)} of {formatCurrency(budget.amount)}</p></div><button aria-label={`Delete ${budget.category} budget`} onClick={() => deleteBudget(budget.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={17} /></button></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${spent > budget.amount ? "bg-rose-500" : "bg-indigo-500"}`} style={{ width: `${percent}%` }} /></div><p className="mt-2 text-right text-xs text-slate-500">{Math.round((spent / budget.amount) * 100)}% used</p></div> })}</div>
  </div>;
}
