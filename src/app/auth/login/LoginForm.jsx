import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm transition-shadow placeholder:text-slate-400 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900";
const inputErrorClass =
  "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-500/10";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400";
const labelClass =
  "text-xs font-semibold text-slate-700 dark:text-slate-300";
const errorClass =
  "flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400";
const socialClass =
  "h-10 gap-2 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
const primaryButton =
  "h-10 w-full gap-2 rounded-xl font-semibold shadow-sm transition active:scale-[0.99] disabled:opacity-70";

export default function LoginForm({
  form,
  errors,
  formError,
  loading,
  update,
  handleSubmit,
  handleSocial,
  setForm,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.35)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Social login */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className={socialClass}
          onClick={() => handleSocial("google")}
        >
          <FaGoogle className="h-3.5 w-3.5 text-[#ea4335]" /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className={socialClass}
          onClick={() => handleSocial("github")}
        >
          <FaGithub className="h-4 w-4" /> GitHub
        </Button>
      </div>

      <div className="my-3.5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        or continue with email
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {formError}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="login-email" className={labelClass}>
            Email
          </Label>
          <div className="group relative">
            <Mail className={iconClass} />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={update("email")}
              aria-invalid={Boolean(errors.email)}
              className={cn(
                inputClass,
                "pl-9",
                errors.email && inputErrorClass,
              )}
            />
          </div>
          {errors.email && (
            <p role="alert" className={errorClass}>
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className={labelClass}>
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="group relative">
            <Lock className={iconClass} />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={update("password")}
              aria-invalid={Boolean(errors.password)}
              className={cn(
                inputClass,
                "pl-9 pr-10",
                errors.password && inputErrorClass,
              )}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {errors.password && (
            <p role="alert" className={errorClass}>
              <AlertCircle className="h-3 w-3 shrink-0" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="login-remember"
            checked={form.remember}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, remember: Boolean(checked) }))
            }
          />
          <Label
            htmlFor="login-remember"
            className="cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400"
          >
            Keep me signed in on this device
          </Label>
        </div>

        <Button type="submit" disabled={loading} className={primaryButton}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
