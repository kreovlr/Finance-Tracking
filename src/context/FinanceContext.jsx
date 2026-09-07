/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  return stored ? JSON.parse(stored) : fallback;
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => readStorage("fintrack-transactions", defaultTransactions));
  const [budgets, setBudgets] = useState(() => readStorage("fintrack-budgets", defaultBudgets));
  const [currency, setCurrency] = useState(() => window.localStorage.getItem("fintrack-currency") || "PHP");

  useEffect(() => window.localStorage.setItem("fintrack-transactions", JSON.stringify(transactions)), [transactions]);
  useEffect(() => window.localStorage.setItem("fintrack-budgets", JSON.stringify(budgets)), [budgets]);
  useEffect(() => window.localStorage.setItem("fintrack-currency", currency), [currency]);

  function addTransaction(data) {
    setTransactions((current) => [...current, { ...data, id: Date.now(), amount: Number(data.amount) }]);
  }

  function updateTransaction(id, data) {
    setTransactions((current) => current.map((item) => item.id === id ? { ...item, ...data, amount: Number(data.amount) } : item));
  }

  function deleteTransaction(id) {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  function addBudget(data) {
    setBudgets((current) => [...current, { ...data, id: Date.now(), amount: Number(data.amount) }]);
  }

  function deleteBudget(id) {
    setBudgets((current) => current.filter((item) => item.id !== id));
  }

  function restoreBackup(data) {
    if (Array.isArray(data.transactions)) setTransactions(data.transactions);
    if (Array.isArray(data.budgets)) setBudgets(data.budgets);
    if (data.currency) setCurrency(data.currency);
  }

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
