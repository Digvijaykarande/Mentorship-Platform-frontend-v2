"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, File as FileIcon, FileImage, FileStack, FileText, FolderOpen, Search } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import Pagination from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SOURCE_META } from "@/components/common/StorageUsageCard";
import { uploadsApi } from "@/lib/api/uploads";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;
const SORTS = {
  newest: { label: "Newest first", fn: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)) },
  largest: { label: "Largest first", fn: (a, b) => b.size - a.size },
  name: { label: "Name (A-Z)", fn: (a, b) => a.name.localeCompare(b.name) },
};

const iconFor = (f) => (/^image\//.test(f.mimeType) ? FileImage : /pdf|word|text|sheet|presentation/.test(f.mimeType) ? FileText : FileIcon);
const dateOf = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

/**
 * Every file that counts toward someone's storage: search, filter by where it lives, sort, open.
 * Pass `userId` (admin / mentor) to look at another person; leave it out for your own files.
 */
export default function StorageFiles({ userId, title = "Your files", description = "Everything that counts toward your storage", bare = false, className }) {
  const [state, setState] = useState({ status: "loading", files: [] });
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Callers give this component a `key` per person, so state always starts fresh as "loading".
    let cancelled = false;
    uploadsApi
      .files(userId)
      .then((files) => !cancelled && setState({ status: "ready", files }))
      .catch(() => !cancelled && setState({ status: "error", files: [] }));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const counts = useMemo(() => {
    const c = { all: state.files.length };
    state.files.forEach((f) => (c[f.source] = (c[f.source] ?? 0) + 1));
    return c;
  }, [state.files]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.files
      .filter((f) => (source === "all" || f.source === source) && (!q || f.name.toLowerCase().includes(q) || f.context.toLowerCase().includes(q)))
      .sort(SORTS[sort].fn);
  }, [state.files, search, source, sort]);

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = (fn) => (v) => {
    fn(v);
    setPage(1);
  };

  const body = (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => reset(setSearch)(e.target.value)} placeholder="Search files or projects..." aria-label="Search files" className="h-9 pl-9 text-xs" />
        </div>
        <Select value={sort} onValueChange={(v) => reset(setSort)(v)}>
          <SelectTrigger aria-label="Sort files" className="data-[size=default]:h-9 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <SelectValue>{SORTS[sort]?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORTS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by source">
        {[["all", "All"], ...Object.entries(SOURCE_META).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <Button variant="unstyled"
            key={k}
            type="button"
            aria-pressed={source === k}
            disabled={k !== "all" && !counts[k]}
            onClick={() => reset(setSource)(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors disabled:opacity-40",
              source === k
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {label} <span className="opacity-60">{counts[k] ?? 0}</span>
          </Button>
        ))}
      </div>

      {state.status === "loading" && <div className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />}
      {state.status === "error" && <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">Files could not be loaded right now.</p>}
      {state.status === "ready" && shown.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center dark:border-slate-800">
          <FolderOpen className="h-6 w-6 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{state.files.length ? "No files match your search" : "No files yet"}</p>
          <p className="text-[11px] text-slate-400">{state.files.length ? "Try another keyword or filter." : "Files you upload to submissions, projects and tasks show up here."}</p>
        </div>
      )}

      {pageItems.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 dark:divide-slate-800 dark:border-slate-800">
          {pageItems.map((f) => {
            const Icon = iconFor(f);
            return (
              <li key={f.id} className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{f.name}</p>
                  <p className="flex items-center gap-1.5 truncate text-[11px] text-slate-400">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", SOURCE_META[f.source]?.dot)} />
                    <span className="truncate">{f.context || f.sourceLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0">{dateOf(f.createdAt)}</span>
                    {f.provider === "gdrive" && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">Google Drive</span>
                      </>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">{f.readable}</span>
                <a href={f.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${f.name}`} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <Pagination page={current} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );

  if (bare) return body;
  return (
    <SectionCard icon={FileStack} title={title} description={description} className={className} iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" contentClassName="p-5">
      {body}
    </SectionCard>
  );
}
