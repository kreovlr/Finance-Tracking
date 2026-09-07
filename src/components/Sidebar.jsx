import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Menu, Settings, Wallet, X, PiggyBank, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/dashboard/transactions", label: "Transactions", icon: Wallet },
  { to: "/dashboard/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/dashboard/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigation = <><div className="mb-10 flex items-center justify-between"><h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FinTrack</h1><button onClick={() => setOpen(false)} className="md:hidden"><X size={21} /></button></div><nav className="space-y-2">{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl p-3 transition ${location.pathname === to ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-neutral-400"}`}><Icon size={20} />{label}</Link>)}</nav><button onClick={logout} className="mt-auto flex items-center gap-3 p-3 text-slate-500 hover:text-rose-600 dark:text-neutral-400"><LogOut size={20} />Sign out</button></>;
  return <><button aria-label="Open navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-30 rounded-xl border border-slate-200 bg-white p-2 md:hidden dark:border-slate-700 dark:bg-slate-900"><Menu size={20} /></button>{open && <button aria-label="Close navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden" /> }<aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white p-6 transition-transform dark:border-white/5 dark:bg-slate-950 md:static md:min-h-screen md:w-64 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>{navigation}</aside></>;
}
