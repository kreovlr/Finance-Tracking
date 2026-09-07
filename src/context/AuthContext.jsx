/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = window.localStorage.getItem("fintrack-user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(email, password) {
    if (!email || password.length < 6) {
      return "Enter a valid email and a password with at least 6 characters.";
    }

    const nextUser = { email };
    window.localStorage.setItem("fintrack-user", JSON.stringify(nextUser));
    setUser(nextUser);
    return null;
  }

  function register(name, email, password) {
    if (!name.trim() || !email || password.length < 6) {
      return "Complete all fields. Passwords must be at least 6 characters.";
    }

    const nextUser = { name: name.trim(), email };
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