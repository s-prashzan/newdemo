import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { user, login, register } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (or just logged in): go back where they came from
  if (user) return <Navigate to={from} replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Can't reach the server. Is it running?" : err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 px-6 py-16 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-4">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="text-gray-500 mt-1">
            {isLogin ? "Log in to track your orders." : "Save your details and see your order history."}
          </p>
        </div>

        {!isLogin && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Full name
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Kasun Perera" />
          </label>
        )}

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputClass}
            placeholder={isLogin ? "Your password" : "At least 8 characters"}
          />
        </label>

        {error && <p className="text-sm bg-red-50 text-red-700 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg mt-2"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {isLogin ? "Log in" : "Create account"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          {isLogin ? "New to ShopLite? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"} state={{ from }} className="text-indigo-600 font-semibold">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </form>
    </main>
  );
}

export default AuthPage;