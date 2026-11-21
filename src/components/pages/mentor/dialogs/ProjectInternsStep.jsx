import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "../MentorMotion";
import { MentorAvatar } from "../MentorCommon";
import { cn } from "@/lib/utils";

export default function ProjectInternsStep({
  query,
  setQuery,
  filtered,
  assignees,
  allFilteredSelected,
  toggleAllFiltered,
  toggleAssignee,
}) {
  return (
    <div className="space-y-2.5">
      <Reveal className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search interns or team…"
          className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-900"
        />
      </Reveal>

      <Reveal className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Table header */}
        <div className="grid grid-cols-[28px_1fr_120px_90px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
          <Button
            variant="unstyled"
            type="button"
            onClick={toggleAllFiltered}
            aria-label={allFilteredSelected ? "Clear all" : "Select all"}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border transition",
              allFilteredSelected
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-slate-300 bg-white dark:border-slate-600 dark:bg-transparent"
            )}
          >
            {allFilteredSelected && <Check className="h-3 w-3" />}
          </Button>
          <span>Intern</span>
          <span className="hidden sm:block">Team</span>
          <span className="hidden sm:block">Status</span>
        </div>

        {/* Rows */}
        <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-slate-400">
              No interns match &ldquo;{query}&rdquo;.
            </p>
          )}
          {filtered.map((user) => {
            const checked = assignees.includes(user.name);
            return (
              <Button
                variant="unstyled"
                type="button"
                key={user.id}
                onClick={() => toggleAssignee(user.name)}
                aria-pressed={checked}
                className={cn(
                  "grid w-full grid-cols-[28px_1fr_120px_90px] items-center gap-3 px-3 py-1.5 text-left transition",
                  checked
                    ? "bg-primary-50/60 dark:bg-primary-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition",
                    checked
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <MentorAvatar name={user.name} className="h-7 w-7 text-[10px]" />
                  <span className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </span>
                </span>
                <span className="hidden truncate text-xs text-slate-500 sm:block">
                  {user.team}
                </span>
                <span className="hidden truncate text-xs text-slate-400 sm:block">
                  {user.status}
                </span>
              </Button>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
