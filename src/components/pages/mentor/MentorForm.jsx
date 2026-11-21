"use client";

import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Reveal } from "./MentorMotion";

export { RatingInput } from "./form/RatingInput";
export { SegmentedControl } from "./form/SegmentedControl";
export { ListEditor } from "./form/ListEditor";

/* ------------------------------------------------------------------ */
/* Shared control styling                                              */
/* ------------------------------------------------------------------ */
const CONTROL =
  "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-primary-400 dark:focus:ring-primary-400/15";

/* ------------------------------------------------------------------ */
/* Field wrapper + error                                               */
/* ------------------------------------------------------------------ */
export function Field({ label, hint, required, error, children, className }) {
  return (
    <Reveal className={cn("space-y-1.5", className)}>
      {(label || hint) && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {label}
            {required && <span className="ml-0.5 text-rose-500">*</span>}
          </span>
          {hint && (
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
      {error && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </Reveal>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      key={String(children)}
      className="admin-shake flex animate-in fade-in slide-in-from-top-1 duration-300 items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium leading-relaxed text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */
export function FormInput({ icon: Icon, className, invalid, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      <Input
        {...props}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          "h-11 px-3.5",
          Icon && "pl-10",
          invalid && "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10",
          className
        )}
      />
    </div>
  );
}

export function FormTextarea({ className, rows = 4, mono, ...props }) {
  return (
    <Textarea
      rows={rows}
      {...props}
      className={cn(
        CONTROL,
        "field-sizing-fixed min-h-24 resize-none px-3.5 py-3 leading-relaxed",
        mono && "font-mono text-[13px]",
        className
      )}
    />
  );
}

export function FormSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option",
  icon: Icon,
  className,
}) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const current = normalized.find((o) => o.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "w-full! data-[size=default]:h-11! rounded-xl! border-slate-200! bg-white! px-3.5! text-sm! shadow-xs hover:border-slate-300! focus-visible:border-primary-400! focus-visible:ring-4! focus-visible:ring-primary-500/10! dark:border-slate-700! dark:bg-slate-900/60!",
          className
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <SelectValue placeholder={placeholder}>{current?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="rounded-xl p-1">
        {normalized.map((o) => (
          <SelectItem key={o.value} value={o.value} className="rounded-lg py-2 text-[13px]">
            <span>{o.label}</span>
            {o.meta && <span className="text-slate-400">· {o.meta}</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ------------------------------------------------------------------ */
/* Section + toggle card                                               */
/* ------------------------------------------------------------------ */
export function FormSection({ icon: Icon, title, description, children, className }) {
  return (
    <Reveal
      as="section"
      className={cn(
        "space-y-4 border-b border-slate-100 py-5 first:pt-0 last:border-b-0 last:pb-0 dark:border-slate-800",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          <div>
            <h3 className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </Reveal>
  );
}

export function ToggleCard({ icon: Icon, title, description, checked, onCheckedChange, children }) {
  return (
    <Reveal
      className={cn(
        "rounded-2xl border p-4 transition",
        checked
          ? "border-primary-200 bg-primary-50/50 dark:border-primary-500/30 dark:bg-primary-500/5"
          : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40"
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-900 dark:text-white">{title}</p>
          {description && <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
      </div>
      {checked && children && <div className="mt-4 space-y-4">{children}</div>}
    </Reveal>
  );
}
