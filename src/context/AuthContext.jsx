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
    const recoveryCode = new URLSearchParams(window.location.search).get("code");
    const restoreSession = async () => {
      try {
        if (recoveryCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(recoveryCode);
          if (!error) window.history.replaceState({}, document.title, window.location.pathname);
        }

        const { data } = await supabase.auth.getSession();
        if (mounted) setUser(getUserFromSession(data.session));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    restoreSession();

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
      if (error.message === "Invalid login credentials") {
        return "We couldn't find an account with those details. Check your email and password, or create an account first.";
      }
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return "Confirm your email address first, then try logging in again.";
      }
      return error.message;
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
    let { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      const recoveryCode = new URLSearchParams(window.location.search).get("code");
      if (recoveryCode) {
        const { error } = await supabase.auth.exchangeCodeForSession(recoveryCode);
        if (error) return "This password-reset link is expired or has already been used. Request a new reset email.";
        ({ data: sessionData } = await supabase.auth.getSession());
      }
    }

    if (!sessionData.session) {
      return "This password-reset link is expired or has already been used. Request a new reset email.";
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      await supabase.auth.signOut();
      return null;
    }

    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("same") || errorMessage.includes("different") || errorMessage.includes("old password")) {
      return "Use a different password. This password was already used for this account.";
    }

    return error.message;
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