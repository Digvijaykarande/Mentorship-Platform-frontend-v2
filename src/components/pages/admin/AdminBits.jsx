"use client";

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneOf } from "./adminData";
import { useAdmin } from "./AdminProvider";

export function StatusPill({ status, className }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold", toneOf(status), className)}>{status}</span>;
}

/** Storage and payments are demo numbers until the backend has those endpoints. */
export function DemoNote() {
  return (
    <p className="rounded-xl border border-dashed border-secondary-300/70 bg-secondary-50/60 px-3 py-2 text-[11px] font-medium text-secondary-800 dark:border-secondary-500/30 dark:bg-secondary-500/10 dark:text-secondary-300">
      Sample figures: plans and invoices are placeholders until a billing API is connected. Accounts and storage are live.
    </p>
  );
}

/** Shows loading / error state; renders children once the accounts have loaded. */
export function Loaded({ children }) {
  const { ready, error } = useAdmin();
  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  }
  return (
    <>
      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      )}
      {children}
    </>
  );
}

export function UsageBar({ percent }) {
  const tone = percent >= 90 ? "bg-rose-500" : percent >= 70 ? "bg-secondary-500" : "bg-emerald-500";
  return (
    <Progress value={Math.min(100, percent)} className="block w-full">
      <ProgressTrack className="h-1.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ProgressIndicator className={cn("rounded-full transition-all duration-700", tone)} />
      </ProgressTrack>
    </Progress>
  );
}
