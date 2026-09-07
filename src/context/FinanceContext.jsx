/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const FinanceContext = createContext(null);

const defaultTransactions = [
  { id: 1, name: "Salary", category: "Salary", amount: 35000, type: "income", date: "2026-09-01", recurring: true },
  { id: 2, name: "Food", category: "Food", amount: 2500, type: "expense", date: "2026-09-04", recurring: false }
];

const defaultBudgets = [
  { id: 1, category: "Food", amount: 8000 },
  { id: 2, category: "Transport", amount: 4000 },
  { id: 3, category: "Bills", amount: 6500 }
];

function readStorage(key, fallback) {
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function FinanceProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState(() => isSupabaseConfigured ? [] : readStorage("fintrack-transactions", defaultTransactions));
  const [budgets, setBudgets] = useState(() => isSupabaseConfigured ? [] : readStorage("fintrack-budgets", defaultBudgets));
  const [currency, setCurrency] = useState(() => window.localStorage.getItem("fintrack-currency") || "PHP");
  const [loadedUserId, setLoadedUserId] = useState(null);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!isSupabaseConfigured || !user) {
      return undefined;
    }

    let mounted = true;
    Promise.all([
      supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
      supabase.from("budgets").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("profiles").select("currency").eq("id", user.id).maybeSingle()
    ]).then(([transactionResult, budgetResult, profileResult]) => {
      if (!mounted) return;
      if (!transactionResult.error) setTransactions(transactionResult.data || []);
      if (!budgetResult.error) setBudgets(budgetResult.data || []);
      if (!profileResult.error && profileResult.data?.currency) setCurrency(profileResult.data.currency);
      setLoadedUserId(user.id);
    });

    return () => { mounted = false; };
  }, [authLoading, user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      window.localStorage.setItem("fintrack-transactions", JSON.stringify(transactions));
      window.localStorage.setItem("fintrack-budgets", JSON.stringify(budgets));
      window.localStorage.setItem("fintrack-currency", currency);
    }
  }, [transactions, budgets, currency, user]);

  async function addTransaction(data) {
    const transaction = { ...data, amount: Number(data.amount) };
    if (isSupabaseConfigured && user) {
      const { data: saved, error } = await supabase.from("transactions").insert({ ...transaction, user_id: user.id }).select().single();
      if (!error) setTransactions((current) => [...current, saved]);
      return;
    }
    setTransactions((current) => [...current, { ...transaction, id: Date.now() }]);
  }

  async function updateTransaction(id, data) {
    const transaction = { ...data, amount: Number(data.amount) };
    if (isSupabaseConfigured && user) {
      const { data: updated, error } = await supabase.from("transactions").update(transaction).eq("id", id).eq("user_id", user.id).select().single();
      if (!error) setTransactions((current) => current.map((item) => item.id === id ? updated : item));
      return;
    }
    setTransactions((current) => current.map((item) => item.id === id ? { ...item, ...transaction } : item));
  }

  async function deleteTransaction(id) {
    if (isSupabaseConfigured && user) await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  async function addBudget(data) {
    const budget = { ...data, amount: Number(data.amount) };
    if (isSupabaseConfigured && user) {
      const { data: saved, error } = await supabase.from("budgets").insert({ ...budget, user_id: user.id }).select().single();
      if (!error) setBudgets((current) => [...current, saved]);
      return;
    }
    setBudgets((current) => [...current, { ...budget, id: Date.now() }]);
  }

  async function deleteBudget(id) {
    if (isSupabaseConfigured && user) await supabase.from("budgets").delete().eq("id", id).eq("user_id", user.id);
    setBudgets((current) => current.filter((item) => item.id !== id));
  }

  function restoreBackup(data) {
    if (Array.isArray(data.transactions)) setTransactions(data.transactions);
    if (Array.isArray(data.budgets)) setBudgets(data.budgets);
    if (data.currency) setCurrency(data.currency);
  }

  useEffect(() => {
    if (isSupabaseConfigured && user && loadedUserId === user.id) {
      supabase.from("profiles").upsert({ id: user.id, currency }).then();
    }
  }, [currency, loadedUserId, user]);

  const income = useMemo(() => transactions.filter((item) => item.type === "income").reduce((total, item) => total + Number(item.amount), 0), [transactions]);
  const expenses = useMemo(() => transactions.filter((item) => item.type === "expense").reduce((total, item) => total + Number(item.amount), 0), [transactions]);
  const balance = income - expenses;

  function formatCurrency(amount) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  }

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction,
      budgets, addBudget, deleteBudget, restoreBackup,
      currency, setCurrency, income, expenses, balance, formatCurrency
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
