"use client";

import { useMemo, useState } from "react";
import { Infinity as InfinityIcon, Search, Users } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import Pagination from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import { PersonDialog } from "@/components/common/storage/StoragePeople";
import { STATUS_FILTERS, filterAndSort, summarize } from "./peopleStats";
import {
  PersonCell,
  UsageCell,
  SourceSplit,
  StatusChip,
  Actions,
  SortHead,
} from "./PeopleStorageTable";

const ROLE_BAR = { intern: "bg-primary-500", mentor: "bg-violet-500", admin: "bg-slate-400" };
const ROLE_LABEL = { intern: "Intern", mentor: "Mentor", admin: "Admin" };
const ROLE_TABS = [["all", "Everyone"], ["intern", "Interns"], ["mentor", "Mentors"]];
const PAGE_SIZE = 10;

function OverallUsage({ summary }) {
  const { allocated, usedLimited, free, percent, byRole, unlimitedBytes } = summary;
  const tone =
    percent >= 90
      ? "text-rose-600 dark:text-rose-400"
      : percent >= 70
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";
  const roles = Object.entries(byRole).filter(([, bytes]) => bytes > 0);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Space in use</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
            {formatBytes(usedLimited)}
            <span className="text-sm font-medium text-slate-400">
              {" "}{allocated ? `of ${formatBytes(allocated)} allocated` : "used"}
            </span>
          </p>
        </div>
        {allocated > 0 && (
          <p className="text-right text-xs text-slate-500 dark:text-slate-400">
            <b className={cn("text-base tabular-nums", tone)}>{percent}%</b> full · {formatBytes(free)} free
          </p>
        )}
      </div>

      <div
        className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800"
        role="progressbar"
        aria-label="Storage used across everyone with a limit"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {allocated > 0 &&
          roles.map(([role, bytes]) => (
            <div
              key={role}
              className={cn("h-full transition-[width] duration-700", ROLE_BAR[role] ?? "bg-sky-500")}
              style={{ width: `${(bytes / allocated) * 100}%` }}
              title={`${ROLE_LABEL[role] ?? role}s: ${formatBytes(bytes)}`}
            />
          ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        {roles.map(([role, bytes]) => (
          <li key={role} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", ROLE_BAR[role] ?? "bg-sky-500")} />
            {ROLE_LABEL[role] ?? role}s <b className="tabular-nums text-slate-900 dark:text-white">{formatBytes(bytes)}</b>
          </li>
        ))}
        {allocated > 0 && (
          <li className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            Free <b className="tabular-nums text-slate-900 dark:text-white">{formatBytes(free)}</b>
          </li>
        )}
        {unlimitedBytes > 0 && (
          <li className="flex items-center gap-1.5 text-slate-400">
            <InfinityIcon className="h-3 w-3" /> Admins (no limit){" "}
            <b className="tabular-nums text-slate-600 dark:text-slate-300">{formatBytes(unlimitedBytes)}</b>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function AdminPeopleStorage({ title = "Everyone's storage", description, people, onEdit }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: "used", dir: "desc" });
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const summary = useMemo(() => summarize(people), [people]);
  const shown = useMemo(() => filterAndSort(people, { search, role, status, sort }), [people, search, role, status, sort]);

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = shown.slice(start, start + PAGE_SIZE);

  const reset = (fn) => (v) => { fn(v); setPage(1); };
  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" || key === "role" ? "asc" : "desc" }));
    setPage(1);
  };

  return (
    <SectionCard
      icon={Users}
      title={title}
      description={description}
      iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      contentClassName="space-y-4 p-4 sm:p-5"
    >
      <OverallUsage summary={summary} />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const on = status === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => reset(setStatus)(f.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-colors",
                  on
                    ? "bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                )}
              >
                {f.label}
                <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", on ? "bg-white/20" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
                  {summary.counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => reset(setSearch)(e.target.value)}
              placeholder="Search name or email"
              aria-label="Search people"
              className="h-9 pl-9 text-xs"
            />
          </div>
          <div role="tablist" aria-label="Filter by role" className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {ROLE_TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={role === id}
                onClick={() => reset(setRole)(id)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  role === id
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
          No one matches these filters.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200/80 md:block dark:border-slate-800">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="border-b border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50">
                <tr>
                  <SortHead id="name" sort={sort} onSort={onSort}>Person</SortHead>
                  <SortHead id="percent" sort={sort} onSort={onSort}>Usage</SortHead>
                  <th scope="col" className="hidden px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 xl:table-cell">Used for</th>
                  <SortHead id="files" sort={sort} onSort={onSort}>Files</SortHead>
                  <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th scope="col" className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="max-w-[260px] px-4 py-3"><PersonCell p={p} /></td>
                    <td className="px-4 py-3"><UsageCell p={p} /></td>
                    <td className="hidden px-4 py-3 xl:table-cell"><SourceSplit p={p} /></td>
                    <td className="px-4 py-3 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">{p.files ?? 0}</td>
                    <td className="px-4 py-3"><StatusChip level={p.level} /></td>
                    <td className="px-4 py-3"><Actions p={p} onFiles={setViewing} onEdit={onEdit} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2.5 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="space-y-3 rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <PersonCell p={p} />
                  <StatusChip level={p.level} />
                </div>
                <UsageCell p={p} />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">{p.files ?? 0} file{p.files === 1 ? "" : "s"}</span>
                  <Actions p={p} onFiles={setViewing} onEdit={onEdit} />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-[11px] text-slate-400">
              Showing {start + 1}–{start + rows.length} of {shown.length}
            </p>
            <Pagination page={current} totalPages={totalPages} onPageChange={setPage} className="sm:justify-end" />
          </div>
        </>
      )}

      <PersonDialog person={viewing} onClose={() => setViewing(null)} />
    </SectionCard>
  );
}
