import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-9 rounded-xl border-slate-200 bg-white text-[13px] shadow-sm transition-shadow placeholder:text-slate-400 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-500/10 dark:border-slate-800 dark:bg-slate-900";
const inputErrorClass =
  "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-500/10";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400";
const labelClass = "text-xs font-semibold text-slate-700 dark:text-slate-300";
const errorClass =
  "flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400";
const eyeButtonClass =
  "h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200";

export default function RegisterNameEmailFields({ form, errors, update }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div className="space-y-1">
        <Label htmlFor="register-name" className={labelClass}>
          Full name
        </Label>
        <div className="group relative">
          <User className={iconClass} />
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            className={cn(inputClass, "pl-9", errors.name && inputErrorClass)}
          />
        </div>
        {errors.name && (
          <p role="alert" className={errorClass}>
            <AlertCircle className="h-3 w-3 shrink-0" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="register-email" className={labelClass}>
          Email
        </Label>
        <div className="group relative">
          <Mail className={iconClass} />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            className={cn(inputClass, "pl-9", errors.email && inputErrorClass)}
          />
        </div>
        {errors.email && (
          <p role="alert" className={errorClass}>
            <AlertCircle className="h-3 w-3 shrink-0" />
            {errors.email}
          </p>
        )}
      </div>
    </div>
  );
}

export function RegisterPasswordFields({ form, errors, update }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <div className="space-y-1">
        <Label htmlFor="register-password" className={labelClass}>
          Password
        </Label>
        <div className="group relative">
          <Lock className={iconClass} />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={form.password}
            onChange={update("password")}
            aria-invalid={Boolean(errors.password)}
            className={cn(inputClass, "pl-9 pr-10", errors.password && inputErrorClass)}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={eyeButtonClass}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

      <div className="space-y-1">
        <Label htmlFor="register-confirm" className={labelClass}>
          Confirm password
        </Label>
        <div className="group relative">
          <Lock className={iconClass} />
          <Input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={update("confirm")}
            aria-invalid={Boolean(errors.confirm)}
            className={cn(inputClass, "pl-9 pr-10", errors.confirm && inputErrorClass)}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className={eyeButtonClass}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {errors.confirm && (
          <p role="alert" className={errorClass}>
            <AlertCircle className="h-3 w-3 shrink-0" />
            {errors.confirm}
          </p>
        )}
      </div>
    </div>
  );
}
