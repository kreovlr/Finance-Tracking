/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

function getUserFromSession(session) {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
    email: session.user.email
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(getUserFromSession(data.session));
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(getUserFromSession(session));
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    if (!isSupabaseConfigured) {
      return "Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.";
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 6) {
      return "Enter a valid email and a password with at least 6 characters.";
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });
    if (error) {
      return error.message === "Invalid login credentials"
        ? "No matching account found. Register first or check your details."
        : error.message;
    }
    return null;
  }

  async function register(name, email, password) {
    if (!isSupabaseConfigured) {
      return "Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.";
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedName || !normalizedEmail || password.length < 6) {
      return "Complete all fields. Passwords must be at least 6 characters.";
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { name: trimmedName } }
    });
    if (error) {
      return error.message;
    }

    if (!data.session) {
      return "Account created. Check your email to confirm your account, then log in.";
    }
    return null;
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
  }

  async function resetPassword(email) {
    if (!isSupabaseConfigured) {
      return "Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.";
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return "Enter your email first and we will send reset instructions.";

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/update-password`
    });
    return error?.message || null;
  }

  async function updatePassword(password) {
    if (!supabase) return "Supabase is not configured yet.";
    const { error } = await supabase.auth.updateUser({ password });
    return error?.message || null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}