"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SEG_ACTIVE = {
  indigo: "bg-white text-primary-700 ring-1 ring-primary-200 dark:bg-primary-500/20 dark:text-primary-200 dark:ring-primary-400/30",
  rose: "bg-white text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-400/30",
  amber: "bg-white text-secondary-700 ring-1 ring-secondary-200 dark:bg-secondary-500/20 dark:text-secondary-200 dark:ring-secondary-400/30",
  emerald: "bg-white text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/30",
  slate: "bg-white text-slate-900 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-white dark:ring-slate-600",
};

const SEG_SOLID = {
  indigo: "bg-primary-600 text-white shadow-sm shadow-primary-600/30",
  rose: "bg-rose-600 text-white shadow-sm shadow-rose-600/30",
  amber: "bg-secondary-500 text-white shadow-sm shadow-secondary-500/30",
  emerald: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30",
  slate: "bg-slate-800 text-white shadow-sm",
};

export function SegmentedControl({ value, onChange, options = [], solid = false, className }) {
  const map = solid ? SEG_SOLID : SEG_ACTIVE;
  return (
    <div
      role="radiogroup"
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70",
        className
      )}
    >
      {options.map((o) => {
        const active = value === o.value;
        const Icon = o.icon;
        return (
          <Button
            variant="unstyled"
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all",
              active
                ? map[o.tone || "indigo"]
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}
