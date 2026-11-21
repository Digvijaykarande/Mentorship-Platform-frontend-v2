"use client";

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/attachments";
import { useStorage } from "@/lib/storage";

const TONE = {
  ok: "bg-primary-500",
  warning: "bg-amber-500",
  critical: "bg-rose-500",
  full: "bg-rose-500",
};

/** One-line quota meter shown under every file picker. `pending` = bytes already chosen but not uploaded. */
export default function StorageHint({ pending = 0, className }) {
  const { me, unlimited } = useStorage();
  if (!me || unlimited) return null;
  const used = me.bytes + pending;
  const percent = Math.min(100, (used / me.quotaBytes) * 100);
  const over = used > me.quotaBytes;
  return (
    <div className={cn("space-y-1", className)}>
      <Progress value={percent} className="block">
        <ProgressTrack className="h-1.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <ProgressIndicator className={cn("rounded-full transition-[width] duration-500", over ? "bg-rose-500" : TONE[me.level])} />
        </ProgressTrack>
      </Progress>
      <p className={cn("text-[10.5px] font-medium", over || me.level === "full" ? "text-rose-600 dark:text-rose-400" : "text-slate-400")}>
        {me.level === "full"
          ? `Storage full (${me.quotaReadable}). Delete files to upload more.`
          : `${formatBytes(used)} of ${me.quotaReadable} after this upload · ${formatBytes(Math.max(0, me.quotaBytes - used))} left`}
      </p>
    </div>
  );
}
