import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";

function downloadBackup(data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "fintrack-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Settings() {
  const { transactions, budgets, currency, setCurrency, restoreBackup } = useFinance();
  const { user, logout } = useAuth();
  const fileInput = useRef(null);
  const [message, setMessage] = useState("");

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { restoreBackup(JSON.parse(reader.result)); setMessage("Backup restored successfully."); }
      catch { setMessage("That backup file could not be read."); }
    };
    reader.readAsText(file);
  }

  return <div className="max-w-2xl"><h1 className="text-3xl font-bold">Settings</h1><p className="mt-1 text-slate-500 dark:text-slate-400">Manage your preferences and account data.</p>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-semibold">Currency</h2><p className="mt-1 text-sm text-slate-500">Amounts will be formatted using this currency.</p><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-4 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"><option value="PHP">PHP - Philippine Peso</option><option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option><option value="JPY">JPY - Japanese Yen</option></select></section>
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-semibold">Backup and restore</h2><p className="mt-1 text-sm text-slate-500">Download your transactions and budgets or restore them on this device.</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => downloadBackup({ transactions, budgets, currency, exportedAt: new Date().toISOString() })} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white"><Download size={17} /> Download backup</button><button onClick={() => fileInput.current?.click()} className="flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold dark:border-slate-700"><Upload size={17} /> Restore backup</button><input ref={fileInput} type="file" accept="application/json" onChange={importBackup} className="hidden" /></div>{message && <p className="mt-3 text-sm text-slate-500">{message}</p>}</section>
    <section className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><div><h2 className="font-semibold">Account</h2><p className="text-sm text-slate-500">{user?.email}</p></div><button onClick={logout} className="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-600">Sign out</button></section>
  </div>;
}
