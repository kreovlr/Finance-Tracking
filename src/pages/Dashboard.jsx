import { useMemo, useState } from "react";
import { AlertTriangle, Repeat2 } from "lucide-react";
import Card from "../components/Card";
import Chart from "../components/Chart";
import { useFinance } from "../context/FinanceContext";

function Dashboard() {
  const { income, expenses, transactions, budgets, formatCurrency } = useFinance();
  const [range, setRange] = useState({ start: "", end: "" });
  const recurring = transactions.filter((item) => item.recurring);
  const overspending = useMemo(() => budgets.map((budget) => {
    const spent = transactions.filter((item) => item.type === "expense" && item.category === budget.category).reduce((total, item) => total + Number(item.amount), 0);
    return { ...budget, spent };
  }).filter((budget) => budget.spent > budget.amount), [budgets, transactions]);

  return (
    <div>
      <div className="mb-6"><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-1 text-slate-500 dark:text-slate-400">Your financial picture at a glance.</p></div>
      {overspending.length > 0 && <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"><AlertTriangle size={20} className="mt-0.5" /><div><p className="font-semibold">Budget alert</p><p className="text-sm">{overspending.map((item) => `${item.category} is over by ${formatCurrency(item.spent - item.amount)}`).join("; ")}.</p></div></div>}
      <div className="grid gap-6 md:grid-cols-2"><Card title="Income" amount={income} formatCurrency={formatCurrency} /><Card title="Expenses" amount={expenses} formatCurrency={formatCurrency} /></div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Spending trend</h2><p className="text-sm text-slate-500">Filter the chart by date range.</p></div><div className="flex gap-2"><input aria-label="Chart start date" type="date" value={range.start} onChange={(e) => setRange({ ...range, start: e.target.value })} className="rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-800" /><input aria-label="Chart end date" type="date" value={range.end} onChange={(e) => setRange({ ...range, end: e.target.value })} className="rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-800" /></div></div><Chart startDate={range.start} endDate={range.end} /></div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-2"><Repeat2 size={19} className="text-indigo-500" /><h2 className="font-semibold">Recurring activity</h2></div><p className="mt-2 text-sm text-slate-500">{recurring.length ? `${recurring.length} recurring item${recurring.length === 1 ? "" : "s"} tracked.` : "No recurring income or expenses yet."}</p></div>
    </div>
  );
}

export default Dashboard;
