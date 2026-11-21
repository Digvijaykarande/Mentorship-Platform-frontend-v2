"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, FolderSearch, Infinity as InfinityIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVEL_META, SOURCE_META } from "@/components/common/StorageUsageCard";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";

const LEVEL_BAR = { ok: "bg-primary-500", warning: "bg-amber-500", critical: "bg-rose-500", full: "bg-rose-600" };
const ROLE_LABEL = { intern: "Intern", mentor: "Mentor", admin: "Admin" };

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ name }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-primary-600 text-[11px] font-bold text-white">
      {initials(name)}
    </span>
  );
}

export function PersonCell({ p }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={p.name} />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{p.name}</p>
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="font-semibold uppercase tracking-wide">{ROLE_LABEL[p.role] ?? p.role}</span>
          {p.isCustomQuota && (
            <span className="rounded-full bg-violet-50 px-1.5 text-[9px] font-bold uppercase text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              Custom limit
            </span>
          )}
        </p>
        {p.email && <p className="truncate text-[11px] text-slate-400">{p.email}</p>}
      </div>
    </div>
  );
}

export function UsageCell({ p }) {
  const unlimited = p.quotaBytes === null;
  return (
    <div className="min-w-[150px] space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-[11px]">
        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
          {formatBytes(p.bytes)}
          <span className="font-normal text-slate-400">{unlimited ? "" : ` / ${p.quotaReadable}`}</span>
        </span>
        {unlimited ? (
          <InfinityIcon className="h-3.5 w-3.5 text-primary-500" aria-label="No limit" />
        ) : (
          <span className="font-semibold tabular-nums text-slate-500 dark:text-slate-400">{Math.round(p.percent)}%</span>
        )}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-label={`${p.name} storage used`}
        aria-valuenow={unlimited ? 0 : Math.round(p.percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {!unlimited && (
          <div
            className={cn("h-full rounded-full transition-all duration-700", LEVEL_BAR[p.level] ?? LEVEL_BAR.ok)}
            style={{ width: `${Math.min(100, p.percent)}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function SourceSplit({ p }) {
  const parts = Object.entries(p.breakdown ?? {}).filter(([, v]) => v.bytes > 0);
  if (!parts.length || !p.bytes)
    return <span className="text-[11px] text-slate-300 dark:text-slate-600">No files</span>;
  return (
    <div
      className="flex h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      role="img"
      aria-label={parts.map(([k, v]) => `${SOURCE_META[k]?.label ?? k}: ${formatBytes(v.bytes)}`).join(", ")}
    >
      {parts.map(([k, v]) => (
        <div
          key={k}
          className={cn("h-full", SOURCE_META[k]?.bar ?? "bg-primary-500")}
          style={{ width: `${(v.bytes / p.bytes) * 100}%` }}
          title={`${SOURCE_META[k]?.label ?? k}: ${formatBytes(v.bytes)}`}
        />
      ))}
    </div>
  );
}

export function StatusChip({ level = "ok" }) {
  const meta = LEVEL_META[level] ?? LEVEL_META.ok;
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset", meta.chip)}>
      {meta.label}
    </span>
  );
}

export function Actions({ p, onFiles, onEdit }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-lg text-xs"
        onClick={() => onFiles(p)}
        aria-label={`Open ${p.name}'s files`}
      >
        <FolderSearch className="h-3.5 w-3.5" /> Files
      </Button>
      {onEdit && p.role !== "admin" && (
        <Button
          type="button"
          size="sm"
          className="h-8 gap-1.5 rounded-lg text-xs"
          onClick={() => onEdit(p)}
          aria-label={`Change ${p.name}'s limit`}
        >
          <Pencil className="h-3.5 w-3.5" /> Limit
        </Button>
      )}
    </div>
  );
}

export function SortHead({ id, sort, onSort, children, className }) {
  const active = sort.key === id;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-4 py-2.5 text-left", className)}
    >
      <button
        type="button"
        onClick={() => onSort(id)}
        className={cn(
          "inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
          active ? "text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        )}
      >
        {children} <Icon className={cn("h-3 w-3", !active && "opacity-60")} />
      </button>
    </th>
  );
}
