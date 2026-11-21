"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { homeFor, useAuth } from "@/lib/auth/AuthProvider";
import LoginBrandPanel from "./LoginBrandPanel";
import LoginForm from "./LoginForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only follow same-site paths from ?next= so the login page cannot be used for open redirects. */
const safeNext = () => {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
};

const VERY_SHORT = "[@media(max-height:620px)]:hidden";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign in | Loyanox Mentor";
  }, []);

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "That email doesn't look right.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFormError("");
    try {
      const user = await login({ email: form.email.trim(), password: form.password, remember: form.remember });
      router.push(safeNext() ?? homeFor(user));
    } catch (error) {
      setFormError(error?.message || "We couldn't sign you in. Check your details and try again.");
      setLoading(false);
    }
  };

  const handleSocial = (provider) => {
    const name = provider === "github" ? "GitHub" : "Google";
    setFormError(`${name} sign-in isn't available yet. Please use your email and password.`);
  };

  return (
    <div className="grid h-[100dvh] overflow-hidden bg-[#f7f8fc] font-sans text-slate-800 antialiased lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] dark:bg-background dark:text-slate-200">
      <LoginBrandPanel />

      {/* Form column */}
      <main className="relative flex min-h-0 flex-col overflow-hidden px-4 py-4 sm:px-8 lg:px-10 xl:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-500/10" />

        {/* Mobile brand mark */}
        <div className="relative lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101426] text-sm font-bold text-white dark:bg-white dark:text-[#101426]">
              L
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Loyanox
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Mentor Platform
              </span>
            </span>
          </Link>
        </div>

        {/* Scrolls only as a last resort on very small screens, without a scrollbar */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto my-auto w-full max-w-xl py-3">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 [@media(max-height:640px)]:hidden">
                  Sign in to pick up where you left off.
                </p>
              </div>

              <LoginForm
                form={form}
                errors={errors}
                formError={formError}
                loading={loading}
                update={update}
                handleSubmit={handleSubmit}
                handleSocial={handleSocial}
                setForm={setForm}
              />

              <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                New to Loyanox?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p
          className={`relative pt-1 text-center text-[11px] text-slate-400 ${VERY_SHORT}`}
        >
          &copy; {new Date().getFullYear()} Loyanox Mentor Platform
        </p>
      </main>
    </div>
  );
}
