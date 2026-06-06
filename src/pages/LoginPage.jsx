import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import { SignInButton } from "@clerk/clerk-react";

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const LoginPage = () => (
  <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
    <div className="mx-auto w-full max-w-5xl rounded-xl bg-white/90 p-8 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-lg bg-oya-green/10 px-4 py-2 text-sm font-semibold text-oya-teal">
          Welcome back to Oya Deliver
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-oya-teal sm:text-5xl">
            Sign in and keep your groceries on schedule.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Access your cart, continue shopping, and track your orders in real
            time. New here? Create an account in a few clicks.
          </p>
        </div>

        <div className="grid gap-4 rounded-lg border border-slate-200 bg-oya-paper p-5 text-sm text-slate-700">
          <p>
            Demo account: <span className="font-semibold">user@test.com</span> /{" "}
            <span className="font-semibold">password123</span>
          </p>
          <p>
            Need an admin login? Use{" "}
            <span className="font-semibold">admin@oya.com</span> /{" "}
            <span className="font-semibold">admin123</span>.
          </p>
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-oya-teal">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your credentials to continue to your grocery delivery
            dashboard.
          </p>
          {clerkConfigured ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Sign in using Clerk (recommended).
              </p>
              <SignInButton>
                <button className="w-full rounded-lg bg-oya-teal text-white py-2">
                  Sign in with Clerk
                </button>
              </SignInButton>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Return to{" "}
          <Link
            to="/"
            className="font-semibold text-oya-green hover:text-oya-teal"
          >
            Home
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export default LoginPage;
