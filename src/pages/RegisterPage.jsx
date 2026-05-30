import { Link } from "react-router-dom";
import RegisterForm from "../components/forms/RegisterForm";

const RegisterPage = () => (
  <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
    <div className="mx-auto w-full max-w-5xl rounded-[2.5rem] bg-white/90 p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 backdrop-blur-sm lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full bg-oya-green/10 px-4 py-2 text-sm font-semibold text-oya-teal">
          Create your Oya Deliver account
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-oya-teal sm:text-5xl">
            Get groceries delivered faster than ever.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Register to save addresses, track orders, and keep your cart synced
            across devices.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-oya-paper p-5 text-sm text-slate-700">
          <p>
            We use Firebase auth for secure login and Firestore for your account
            profile.
          </p>
          <p>Already registered? Kindly sign in instead.</p>
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-oya-teal">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Start shopping with Oya Deliver and save your delivery details.
          </p>
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-oya-green hover:text-oya-teal"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export default RegisterPage;
