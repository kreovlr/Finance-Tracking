/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoredAccounts() {
  const storedAccounts = window.localStorage.getItem("fintrack-accounts");
  return storedAccounts ? JSON.parse(storedAccounts) : [];
}

function readStoredUser() {
  const storedUser = window.localStorage.getItem("fintrack-user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 6) {
      return "Enter a valid email and a password with at least 6 characters.";
    }

    const account = readStoredAccounts().find((item) => item.email === normalizedEmail);
    if (!account || account.password !== password) {
      return "No matching account found. Register first or check your details.";
    }

    const nextUser = { name: account.name, email: account.email };
    window.localStorage.setItem("fintrack-user", JSON.stringify(nextUser));
    setUser(nextUser);
    return null;
  }

  function register(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedName || !normalizedEmail || password.length < 6) {
      return "Complete all fields. Passwords must be at least 6 characters.";
    }

    const accounts = readStoredAccounts();
    if (accounts.some((item) => item.email === normalizedEmail)) {
      return "An account with this email already exists. Log in instead.";
    }

    const account = { name: trimmedName, email: normalizedEmail, password };
    window.localStorage.setItem("fintrack-accounts", JSON.stringify([...accounts, account]));
    const nextUser = { name: account.name, email: account.email };
    window.localStorage.setItem("fintrack-user", JSON.stringify(nextUser));
    setUser(nextUser);
    return null;
  }

  function logout() {
    window.localStorage.removeItem("fintrack-user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}