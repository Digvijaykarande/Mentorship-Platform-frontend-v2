"use client";

import {
  Activity,
  BookOpen,
  ClipboardCheck,
  FolderKanban,
  ListTodo,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MentorStatCard from "../MentorStatCard";
import { Reveal } from "../MentorMotion";
import { MentorPagination, usePagination } from "../MentorPagination";
import {
  MentorProgressBar,
  MentorStatusBadge,
  EmptyState,
  MentorSection as SectionCard,
} from "../MentorCommon";
import MentorOverviewBanner from "./overview/MentorOverviewBanner";
import MentorAttentionCard from "./overview/MentorAttentionCard";

export default function MentorOverview({
  snapshot,
  onCreateProject,
  onCreateTask,
}) {
  const activeInterns = snapshot.interns.filter((user) => user.status === "Active").length;
  const attentionTasks = snapshot.tasks
    .filter((task) => task.overdue || task.status === "In progress")
    .slice(0, 4);
  const pendingSubmissions = snapshot.submissions
    .filter((s) => s.status === "Pending" || s.status === "Under Review")
    .slice(0, 3);
  const latestActivity = snapshot.activity?.slice(0, 4) || [];
  const projectPager = usePagination(snapshot.projects);

  return (
    <div className="space-y-4">
      <MentorOverviewBanner
        snapshot={snapshot}
        onCreateProject={onCreateProject}
        onCreateTask={onCreateTask}
      />

      {/* KPI Stats */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5 [&>*:last-child]:col-span-2 xl:[&>*:last-child]:col-span-1">
        <MentorStatCard
          index={1}
          icon={Users}
          label="Active interns"
          value={activeInterns}
          tone="indigo"
          trend="+2"
          trendLabel="this cohort"
        />
        <MentorStatCard
          index={2}
          icon={FolderKanban}
          label="Assigned projects"
          value={snapshot.projects.length}
          tone="blue"
          trendLabel="workspaces"
        />
        <MentorStatCard
          index={3}
          icon={ListTodo}
          label="Open tasks"
          value={snapshot.tasks.filter((t) => t.status !== "Done").length}
          tone="violet"
          trendLabel={`${snapshot.overdue} overdue`}
          trendDirection={snapshot.overdue ? "down" : "up"}
        />
        <MentorStatCard
          index={4}
          icon={ClipboardCheck}
          label="Pending reviews"
          value={snapshot.pendingReviews}
          tone="amber"
          trendLabel={snapshot.pendingReviews ? "needs attention" : "queue clear"}
          trendDirection={snapshot.pendingReviews ? "down" : "up"}
        />
        <MentorStatCard
          index={5}
          icon={BookOpen}
          label="Program resources"
          value={snapshot.resources.length}
          tone="emerald"
          trendLabel="shared references"
        />
      </section>

      {/* Cohort Health & Attention Queues */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-3">
          <SectionCard
            icon={Target}
            title="Cohort Delivery Health"
            description="Live completion rates across all assigned project workstreams"
            iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
            revealIndex={6}
          >
            <div className="space-y-2.5">
              {projectPager.pageItems.map((project, i) => (
                <Reveal
                  key={project.id}
                  index={i}
                  delay={150}
                  className="rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                          {project.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">
                          {project.assignees?.join(", ") || "No assignee"} · {project.due}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <MentorStatusBadge status={project.status} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {project.progress || 0}%
                      </span>
                    </div>
                  </div>
                  <MentorProgressBar
                    value={project.progress}
                    delay={350 + i * 45}
                    tone={
                      project.progress > 80
                        ? "bg-emerald-500"
                        : project.progress < 50
                        ? "bg-rose-500"
                        : "bg-primary-500"
                    }
                  />
                </Reveal>
              ))}
              {!snapshot.projects.length && (
                <EmptyState
                  icon={FolderKanban}
                  title="No projects created yet"
                  description="Assign the first project to get started."
                />
              )}
            </div>
            <MentorPagination pagination={projectPager} label="projects" />
          </SectionCard>

          {/* Live Activity Timeline */}
          <SectionCard
            icon={Activity}
            title="Recent Workspace Activity"
            description="Unified audit trail across assignments, submissions, and feedback responses"
            iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            revealIndex={7}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {(latestActivity.length
                ? latestActivity
                : [
                    {
                      id: "init",
                      title: "Workspace Active",
                      detail: "System ready for assignments and reviews",
                      date: "Today",
                    },
                  ]
              ).map((event, i) => (
                <Reveal
                  key={event.id}
                  index={i}
                  delay={600}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0 dark:bg-primary-500/10 dark:text-primary-400">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                      {event.title}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                      {event.detail || event.date}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </SectionCard>
        </div>

        <MentorAttentionCard
          pendingSubmissions={pendingSubmissions}
          attentionTasks={attentionTasks}
        />
      </div>

      {/* Synchronized Notice Banner */}
      <Reveal index={9} className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 p-3 text-xs text-primary-900 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-200">
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
        <span className="flex-1">
          <strong>Interactive synchronization active:</strong> Any task or project you create here
          immediately appears in the intern portal (<code>/dashboard</code>). When interns submit deliverables,
          they arrive in your Review Queue. Approving deliverables unlocks the next sequential step.
        </span>
        <Button variant="unstyled"
          onClick={onCreateTask}
          className="font-bold underline underline-offset-2 hover:text-primary-700 dark:hover:text-white"
        >
          Assign a task
        </Button>
      </Reveal>
    </div>
  );
}
