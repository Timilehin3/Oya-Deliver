import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { isEmail, required } from "../../utils/validate";
import { supabaseConfigured } from "../../supabase/client";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/products";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!isEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!required(form.password)) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error?.code === "auth/user-not-found" ||
        error?.code === "auth/wrong-password"
          ? "Email or password is incorrect."
          : error?.message ?? "Unable to sign in.";
      setErrors({ form: message });
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!supabaseConfigured && (
        <div className="rounded-lg border border-oya-amber/30 bg-oya-amber/10 p-4 text-sm text-oya-teal">
          Backend is not configured. Copy <code className="rounded px-1 bg-slate-100">.env.example</code> to <code className="rounded px-1 bg-slate-100">.env</code> and set your Supabase keys.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-oya-teal"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={!supabaseConfigured || loading}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
            placeholder="hello@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-oya-teal"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              disabled={!supabaseConfigured || loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-oya-teal"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-rose-600">{errors.password}</p>
          )}
        </div>

        {errors.form && (
          <p className="rounded-lg border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-700">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={!supabaseConfigured || loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-oya-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-oya-green disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-oya-green hover:text-oya-teal"
        >
          Register now
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
