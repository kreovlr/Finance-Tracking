import { useMemo, useState } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import TransactionForm from "../components/TransactionForm";
import { useFinance } from "../context/FinanceContext";

function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Transactions() {
  const { transactions, deleteTransaction, formatCurrency } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => [...new Set(transactions.map((item) => item.category))], [transactions]);
  const visibleTransactions = transactions.filter((item) => filter === "all" || item.type === filter).filter((item) => category === "all" || item.category === category);

  function exportCsv() {
    const rows = [["Name", "Category", "Amount", "Type", "Date", "Recurring"], ...visibleTransactions.map((item) => [item.name, item.category, item.amount, item.type, item.date, item.recurring ? "Yes" : "No"])]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
    downloadFile(rows.join("\n"), "fintrack-transactions.csv", "text/csv");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Transactions</h1><p className="mt-1 text-slate-500 dark:text-slate-400">Track every inflow and outflow.</p></div>
        <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"><Download size={17} /> Export CSV</button>
      </div>
      <TransactionForm key={editingTransaction?.id ?? "new"} editingTransaction={editingTransaction} onCancel={() => setEditingTransaction(null)} />
      <div className="mb-4 flex flex-wrap gap-3">
        <select aria-label="Filter by type" value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select>
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="space-y-3">
        {visibleTransactions.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div><h3 className="font-bold">{item.name}</h3><p className="text-sm text-slate-500">{item.category} · {item.date}{item.recurring ? " · Recurring" : ""}</p></div>
            <div className="flex items-center gap-4"><p className={item.type === "income" ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>{item.type === "income" ? "+" : "-"}{formatCurrency(item.amount)}</p><button aria-label={`Edit ${item.name}`} onClick={() => setEditingTransaction(item)} className="text-slate-500 hover:text-indigo-600"><Pencil size={17} /></button><button aria-label={`Delete ${item.name}`} onClick={() => deleteTransaction(item.id)} className="text-slate-500 hover:text-rose-600"><Trash2 size={17} /></button></div>
          </div>
        ))}
        {!visibleTransactions.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No transactions match these filters.</p>}
      </div>
    </div>
  );
}

export default Transactions;
