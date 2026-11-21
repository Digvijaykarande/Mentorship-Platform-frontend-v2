"use client";

import { useState } from "react";
import { CheckCircle2, FileStack, HardDrive, Sparkles } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { LEVEL_META, SOURCE_META, StorageBar } from "@/components/common/StorageUsageCard";
import { useStorage } from "@/lib/storage";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import StorageRing from "./StorageRing";
import RequestSpaceDialog from "./RequestSpaceDialog";

const planLabel = (me, unlimited) =>
  unlimited ? "Unlimited plan" : me.isCustomQuota ? "Custom limit" : `${me.role === "mentor" ? "Mentor" : "Intern"} plan`;

/** The signed-in person's storage at a glance: ring, numbers, plan, split by source and a way to ask for more. */
export default function StorageSummary({ className }) {
  const { status, me, unlimited, defaults } = useStorage();
  const [asking, setAsking] = useState(false);
  const [sent, setSent] = useState(false);

  if (!me) {
    return (
      <SectionCard icon={HardDrive} title="Storage" description="Your space across Loyanox" className={className} contentClassName="p-5">
        {status === "error" ? <p className="text-xs text-slate-400">Storage usage could not be loaded right now.</p> : <div className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />}
      </SectionCard>
    );
  }

  const level = LEVEL_META[me.level ?? "ok"];
  const LevelIcon = level.icon;
  const rows = Object.entries(me.breakdown).filter(([, v]) => v.bytes > 0);

  return (
    <SectionCard
      icon={HardDrive}
      title="Storage"
      description="Space used by the files you have uploaded"
      className={className}
      iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
      contentClassName="space-y-5 p-5"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
        <StorageRing percent={me.percent} level={me.level} unlimited={unlimited}>
          <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{Math.round(me.percent)}%</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">used</span>
        </StorageRing>

        <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-3xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
              {formatBytes(me.bytes)}
              <span className="ml-1.5 text-sm font-medium text-slate-400">{unlimited ? "used · no limit" : `of ${me.quotaReadable}`}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {unlimited ? "Your account has no storage limit." : `${me.remainingReadable} free · ${me.files} file${me.files === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 ring-1 ring-inset ring-primary-600/15 dark:bg-primary-500/10 dark:text-primary-300">
              <Sparkles className="h-3.5 w-3.5" /> {planLabel(me, unlimited)}
            </span>
            {!unlimited && (
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", level.chip)}>
                <LevelIcon className="h-3.5 w-3.5" /> {level.label}
              </span>
            )}
            {!unlimited && (
              <Button type="button" size="sm" variant="outline" disabled={sent} onClick={() => setAsking(true)} className="h-7 rounded-full px-3 text-[11px]">
                {sent ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Request sent</> : "Request more space"}
              </Button>
            )}
          </div>
        </div>
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
            <li key={key} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/30">
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", SOURCE_META[key]?.dot)} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{SOURCE_META[key]?.label ?? key}</span>
                <span className="block text-[10.5px] text-slate-400">{v.files} file{v.files === 1 ? "" : "s"}</span>
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

      {defaults && !unlimited && (
        <p className="text-[11px] text-slate-400">
          Default limits: interns {defaults.intern.readable} · mentors {defaults.mentor.readable} · admins unlimited.
        </p>
      )}

      <RequestSpaceDialog open={asking} onOpenChange={setAsking} onSent={() => setSent(true)} />
    </SectionCard>
  );
}
