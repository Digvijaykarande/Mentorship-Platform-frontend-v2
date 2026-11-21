"use client";

import { AlertTriangle, CheckCircle2, FileStack, HardDrive, Infinity as InfinityIcon, XCircle } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/attachments";
import { useStorage } from "@/lib/storage";

/** One colour per place a file can live; used by the bar, the legend and the dots. */
export const SOURCE_META = {
  submissions: { label: "Submitted work", bar: "bg-indigo-500", dot: "bg-indigo-500" },
  resources: { label: "Project resources", bar: "bg-sky-500", dot: "bg-sky-500" },
  documentation: { label: "Shared documentation", bar: "bg-emerald-500", dot: "bg-emerald-500" },
  taskReferences: { label: "Task references", bar: "bg-violet-500", dot: "bg-violet-500" },
};

export const LEVEL_META = {
  ok: {
    label: "Healthy",
    icon: CheckCircle2,
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300",
    text: "text-slate-900 dark:text-white",
    note: null,
  },
  warning: {
    label: "Running low",
    icon: AlertTriangle,
    chip: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-300",
    note: "You have used over 80% of your storage. Remove files you no longer need before uploading more.",
  },
  critical: {
    label: "Almost full",
    icon: AlertTriangle,
    chip: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-300",
    note: "Storage is almost full. New uploads may be rejected until you free up some space.",
  },
  full: {
    label: "Storage full",
    icon: XCircle,
    chip: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-300",
    note: "Your storage is full, so file uploads are blocked. Delete some files or ask your admin for more space. Links still work.",
  },
};

/** Segmented usage bar: each source gets its own coloured slice of the quota. */
export function StorageBar({ me, className }) {
  const total = me.quotaBytes ?? Math.max(me.bytes, 1);
  const slices = Object.entries(me.breakdown).filter(([, v]) => v.bytes > 0);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(me.percent)}
      aria-label="Storage used"
      className={cn("flex h-3 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10", className)}
    >
      {slices.map(([key, v]) => (
        <div
          key={key}
          title={`${SOURCE_META[key]?.label}: ${formatBytes(v.bytes)}`}
          className={cn("h-full transition-[width] duration-700 first:rounded-l-full", SOURCE_META[key]?.bar ?? "bg-primary-500")}
          style={{ width: `${(v.bytes / total) * 100}%` }}
        />
      ))}
    </div>
  );
}

/** The signed-in user's own storage: used vs limit, warnings, and where the space went. */
export default function StorageUsageCard({ className }) {
  const { status, me, unlimited } = useStorage();
  const level = LEVEL_META[me?.level ?? "ok"];
  const LevelIcon = level.icon;
  const rows = me ? Object.entries(me.breakdown).filter(([, v]) => v.bytes > 0) : [];

  return (
    <SectionCard
      icon={HardDrive}
      title="Storage"
      description="Space used by the files you have uploaded"
      iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
      className={className}
      contentClassName="space-y-5 p-5"
    >
      {status === "loading" && !me && <div className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />}
      {status === "error" && !me && <p className="text-xs text-slate-400">Storage usage could not be loaded right now.</p>}

      {me && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={cn("text-3xl font-bold tracking-tight tabular-nums", level.text)}>
                {formatBytes(me.bytes)}
                <span className="ml-1.5 text-sm font-medium text-slate-400 dark:text-slate-500">
                  {unlimited ? "used · unlimited" : `of ${me.quotaReadable} used`}
                </span>
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                {unlimited ? "Your account has no storage limit" : `${me.remainingReadable} free · ${me.percent}% used`}
              </p>
            </div>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", level.chip)}>
              {unlimited ? <InfinityIcon className="h-3.5 w-3.5" /> : <LevelIcon className="h-3.5 w-3.5" />}
              {unlimited ? "Unlimited" : level.label}
            </span>
          </div>

          {!unlimited && <StorageBar me={me} />}

          {level.note && (
            <p role="status" className={cn("rounded-xl px-3.5 py-2.5 text-xs font-medium leading-relaxed", level.chip)}>
              {level.note}
            </p>
          )}

          {rows.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {rows.map(([key, v]) => (
                <li
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/30"
                >
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", SOURCE_META[key]?.dot)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {SOURCE_META[key]?.label ?? key}
                    </span>
                    <span className="block text-[10.5px] text-slate-400">
                      {v.files} file{v.files === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-100">{formatBytes(v.bytes)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800">
              <FileStack className="h-4 w-4" /> You haven&apos;t uploaded any files yet.
            </p>
          )}
        </>
      )}
    </SectionCard>
  );
}
