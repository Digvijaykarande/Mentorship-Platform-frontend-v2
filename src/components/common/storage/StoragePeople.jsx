"use client";

import { useMemo, useState } from "react";
import { FolderSearch, Pencil, Search, Users } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEVEL_META, StorageBar } from "@/components/common/StorageUsageCard";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import StorageFiles from "./StorageFiles";

const PAGE_SIZE = 8;
const BAR = { ok: "bg-primary-500", warning: "bg-amber-500", critical: "bg-rose-500", full: "bg-rose-600" };
const initials = (name = "") => name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export function UsageMeter({ person }) {
  const unlimited = person.quotaBytes === null;
  return (
    <div className="min-w-[140px] space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-[11px]">
        <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">{formatBytes(person.bytes)}</span>
        <span className="text-slate-400">{unlimited ? "Unlimited" : `of ${person.quotaReadable}`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-valuenow={Math.round(person.percent)} aria-valuemin={0} aria-valuemax={100} aria-label={`${person.name} storage used`}>
        {!unlimited && <div className={cn("h-full rounded-full transition-all duration-700", BAR[person.level] ?? BAR.ok)} style={{ width: `${Math.min(100, person.percent)}%` }} />}
      </div>
    </div>
  );
}

export function PersonDialog({ person, onClose }) {
  return (
    <Dialog open={Boolean(person)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {person && (
          <>
            <DialogHeader>
              <DialogTitle>{person.name}</DialogTitle>
              <DialogDescription>
                {person.role === "mentor" ? "Mentor" : "Intern"} · {formatBytes(person.bytes)} {person.quotaBytes === null ? "used" : `of ${person.quotaReadable} used`} · {person.files} file{person.files === 1 ? "" : "s"}
              </DialogDescription>
            </DialogHeader>
            {person.quotaBytes !== null && <StorageBar me={person} />}
            <StorageFiles key={person.id} userId={person.id} bare />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * People and how much space each uses. Mentors see their interns; admins see everyone and can change limits.
 * `onEdit(person)` only when the viewer may change limits.
 */
export default function StoragePeople({ people, title = "People", description, roleFilter = false, onEdit, className }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("used");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = people.filter((p) => (role === "all" || p.role === role) && (!q || p.name.toLowerCase().includes(q) || (p.email || "").toLowerCase().includes(q)));
    const by = { used: (a, b) => b.bytes - a.bytes, percent: (a, b) => b.percent - a.percent, name: (a, b) => a.name.localeCompare(b.name) }[sort];
    return [...list].sort(by);
  }, [people, search, role, sort]);

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = (fn) => (v) => {
    fn(v);
    setPage(1);
  };

  return (
    <SectionCard icon={Users} title={title} description={description} className={className} iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" contentClassName="space-y-4 p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => reset(setSearch)(e.target.value)} placeholder="Search by name or email..." aria-label="Search people" className="h-9 pl-9 text-xs" />
        </div>
        {roleFilter && (
          <select value={role} onChange={(e) => reset(setRole)(e.target.value)} aria-label="Filter by role" className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <option value="all">All roles</option>
            <option value="mentor">Mentors</option>
            <option value="intern">Interns</option>
          </select>
        )}
        <select value={sort} onChange={(e) => reset(setSort)(e.target.value)} aria-label="Sort people" className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <option value="used">Most used</option>
          <option value="percent">Fullest</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">No one matches.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 dark:divide-slate-800 dark:border-slate-800">
          {rows.map((p) => {
            const level = LEVEL_META[p.level ?? "ok"];
            return (
              <li key={p.id} className="grid items-center gap-3 px-3.5 py-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_auto]">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-primary-600 text-[11px] font-bold text-white">{initials(p.name)}</span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                      <span className="truncate">{p.name}</span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">{p.role}</span>
                      {p.isCustomQuota && <span className="shrink-0 rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">Custom</span>}
                    </p>
                    {p.email && <p className="truncate text-[11px] text-slate-400">{p.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UsageMeter person={p} />
                  {p.level !== "ok" && <span className={cn("hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset md:inline", level.chip)}>{level.label}</span>}
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5 rounded-lg text-xs" onClick={() => setViewing(p)}>
                    <FolderSearch className="h-3.5 w-3.5" /> Files
                  </Button>
                  {onEdit && p.role !== "admin" && (
                    <Button type="button" size="sm" className="h-8 gap-1.5 rounded-lg text-xs" onClick={() => onEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" /> Limit
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Pagination page={current} totalPages={totalPages} onPageChange={setPage} />
      <PersonDialog person={viewing} onClose={() => setViewing(null)} />
    </SectionCard>
  );
}
