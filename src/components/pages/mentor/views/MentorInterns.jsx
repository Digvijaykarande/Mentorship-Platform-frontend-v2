"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Activity,
  AlertTriangle,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import { CountUp, Reveal } from "../MentorMotion";
import { MentorPagination, usePagination } from "../MentorPagination";
import FilterTabs from "@/components/common/FilterTabs";
import { useRetained } from "../MentorModal";
import { Toolbar, EmptyState, MentorSection as SectionCard } from "../MentorCommon";
import InternCard from "./interns/InternCard";
import InternTableView from "./interns/InternTableView";
import InternDetailModal from "./interns/InternDetailModal";
import { STAT_TONES } from "./interns/internUtils";

function StatTile({ icon: Icon, label, value, hint, tone, index = 0 }) {
  return (
    <Reveal index={index} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center gap-3.5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ${STAT_TONES[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            {typeof value === "number" ? <CountUp value={value} delay={index * 45} /> : value}
          </p>
        </div>
      </div>
      {hint && <p className="mt-2 text-[11px] font-medium text-slate-400">{hint}</p>}
    </Reveal>
  );
}

const VIEW_OPTIONS = [
  { value: "list", label: "List", icon: List },
  { value: "grid", label: "Grid", icon: LayoutGrid },
];

function ViewToggle({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Layout"
      className="flex shrink-0 rounded-lg border border-slate-200/80 bg-slate-100/60 p-0.5 dark:border-slate-800 dark:bg-slate-900/60"
    >
      {VIEW_OPTIONS.map(({ value: v, label, icon: Icon }) => (
        <Button variant="unstyled"
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          aria-label={`${label} view`}
          onClick={() => onChange(v)}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[10px] font-bold transition-all",
            value === v
              ? "bg-white text-primary-600 shadow-xs dark:bg-slate-800 dark:text-primary-300"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

export default function MentorInterns({ snapshot, onAssignTask }) {
  const MENTOR_INTERNS = snapshot.interns;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const shownUser = useRetained(selectedUser);

  const internTasks = shownUser
    ? (snapshot?.tasks || []).filter(
        (t) => t.mentee === shownUser.name || (t.assignees || []).includes(shownUser.name)
      )
    : [];

  const filteredUsers = MENTOR_INTERNS.filter((user) => {
    const matchesFilter =
      filter === "all" ||
      user.status.toLowerCase().replace(/\s+/g, "-") === filter;
    const matchesSearch = `${user.name} ${user.email} ${user.team} ${user.mentor}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pager = usePagination(filteredUsers, `${search}|${filter}|${view}`, view === "grid" ? 9 : 10);

  const total = MENTOR_INTERNS.length;
  const activeCount = MENTOR_INTERNS.filter((u) => u.status === "Active").length;
  const atRiskCount = MENTOR_INTERNS.filter((u) => u.status === "At risk").length;
  const avgProgress = total
    ? Math.round(MENTOR_INTERNS.reduce((sum, u) => sum + (u.progress || 0), 0) / total)
    : 0;

  const filterOptions = [
    { value: "all", label: "All Interns", count: MENTOR_INTERNS.length },
    {
      value: "active",
      label: "Active",
      count: MENTOR_INTERNS.filter((u) => u.status === "Active").length,
    },
    {
      value: "at-risk",
      label: "At Risk",
      count: MENTOR_INTERNS.filter((u) => u.status === "At risk").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: MENTOR_INTERNS.filter((u) => u.status === "Completed").length,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero icon={Users} badge="Cohort Directory" title="Know where every intern stands." description="Monitor delivery momentum, track active tracks, and assign work across the cohort.">
        {onAssignTask && (
          <Button onClick={() => onAssignTask()} className={MENTOR_HERO_BTN}>
            <Plus className="h-4 w-4" /> Assign Work
          </Button>
        )}
      </MentorHero>

      {/* Cohort snapshot */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile index={1} icon={Users} tone="indigo" label="Total interns" value={total} hint="Across all tracks" />
        <StatTile index={2} icon={Activity} tone="emerald" label="Active" value={activeCount} hint="Currently delivering" />
        <StatTile index={3} icon={AlertTriangle} tone="rose" label="At risk" value={atRiskCount} hint="Need mentor attention" />
        <StatTile index={4} icon={TrendingUp} tone="sky" label="Avg. completion" value={<CountUp value={avgProgress} suffix="%" delay={180} />} hint="Cohort-wide progress" />
      </div>

      <SectionCard revealIndex={5}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search by intern name, track, or mentor..."
        >
          <div className="flex items-center gap-2">
            <FilterTabs value={filter} onChange={setFilter} options={filterOptions} />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </Toolbar>

        {view === "grid" ? (
          <div className="mt-4">
            {filteredUsers.length > 0 ? (
              <div
                key={`${filter}|${pager.page}`}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {pager.pageItems.map((user, i) => (
                  <InternCard key={user.id} user={user} index={i} onOpen={() => setSelectedUser(user)} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No interns found"
                description="Try adjusting your search query or status filter."
              />
            )}
          </div>
        ) : (
          <>
            <InternTableView pager={pager} setSelectedUser={setSelectedUser} />
            {!filteredUsers.length && (
              <div className="p-4">
                <EmptyState
                  icon={Users}
                  title="No interns found"
                  description="Try adjusting your search query or status filter."
                />
              </div>
            )}
          </>
        )}

        {pager.total <= pager.pageSize ? (
          <p className="mt-3 text-[11px] font-medium text-slate-400">
            Showing {filteredUsers.length} of {total} interns
          </p>
        ) : (
          <MentorPagination pagination={pager} label="interns" />
        )}
      </SectionCard>

      <InternDetailModal
        selectedUser={selectedUser}
        shownUser={shownUser}
        onClose={() => setSelectedUser(null)}
        internTasks={internTasks}
        onAssignTask={onAssignTask}
      />
    </div>
  );
}
