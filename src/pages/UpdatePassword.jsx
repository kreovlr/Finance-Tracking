import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    const updateError = await updatePassword(password);
    setError(updateError || "");
    if (!updateError) setUpdated(true);
  }

  return (
    <div className="auth-shell flex min-h-screen w-screen items-center justify-center px-6 py-10 text-white">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="auth-panel w-full max-w-md rounded-2xl p-8">
        <h1 className="text-center text-4xl font-bold text-purple-200">Set a new password</h1>
        <p className="mb-8 mt-3 text-center text-neutral-400">Choose a new password for Finance Tracking.</p>
        {error && <p className="mb-5 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
        {updated ? (
          <div className="text-center">
            <p className="mb-5 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-300">Password updated successfully.</p>
            <button type="button" onClick={() => navigate("/login")} className="rose-button w-full rounded-xl py-3.5 font-semibold">Return to login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input w-full rounded-xl p-3.5 outline-none" />
            <input type="password" placeholder="Confirm new password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="auth-input w-full rounded-xl p-3.5 outline-none" />
            <button type="submit" className="rose-button w-full rounded-xl py-3.5 font-semibold">Update password</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-neutral-400"><Link to="/login" className="text-purple-300 hover:text-purple-200">Back to login</Link></p>
      </motion.div>
    </div>
  );
}