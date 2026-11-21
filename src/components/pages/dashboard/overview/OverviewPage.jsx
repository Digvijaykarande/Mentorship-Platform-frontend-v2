"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  ListTodo,
  MessageSquare,
  Star,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MiniStatCard from "@/components/common/MiniStatCard";
import SectionCard from "@/components/common/SectionCard";
import OverviewBanner from "./OverviewBanner";
import OverviewSidebar from "./OverviewSidebar";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";
import { buildRecentActivity, internshipTimeline } from "@/lib/workspace/adapters";

const ACTIVITY_ICON = {
  task: { icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" },
  project: { icon: FolderKanban, tone: "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-500/10" },
  achievement: { icon: Award, tone: "text-secondary-600 bg-secondary-50 dark:text-secondary-400 dark:bg-secondary-500/10" },
  feedback: { icon: MessageSquare, tone: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10" },
  submission: { icon: Upload, tone: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10" },
};

const TONE_CLASSES = {
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
};

function ActivityFeed({ activity }) {
  return (
    <div className="stagger-list space-y-1 px-1">
      {activity.slice(0, 5).map((item) => {
        const meta = ACTIVITY_ICON[item.type] ?? ACTIVITY_ICON.task;
        const Icon = meta.icon;
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-slate-100 hover:bg-slate-50/80 dark:hover:border-slate-800 dark:hover:bg-slate-800/60"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">{item.description}</p>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuickLinks({ links }) {
  return (
    <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
      {links.map(({ title, description, href, icon: Icon, tone }) => (
        <Link
          key={title}
          href={href}
          className="group flex items-start gap-3.5 rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-500/25"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {title}
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
            </p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const { tasks, feedback, submissions, projects } = useWorkspace();
  const USER_NAME = (user?.name || "").split(" ")[0];
  const INTERNSHIP = internshipTimeline(user, projects);
  const hasEnd = INTERNSHIP.totalWeeks !== null;
  const weeksLeft = hasEnd ? INTERNSHIP.totalWeeks - INTERNSHIP.currentWeek : 0;
  const RECENT_ACTIVITY = buildRecentActivity({ submissions, feedback });

  const totalTasks = tasks.length || 1;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "To do").length;
  const activeTasks = inProgressTasks + pendingTasks;
  const overdueTasks = tasks.filter((t) => t.overdue && t.status !== "Done").length;

  const allSubtasks = tasks.flatMap((t) => t.subtasks || []);
  const allApproved = allSubtasks.filter((s) => s.done && s.approved).length;
  const overallProgress = allSubtasks.length ? Math.round((allApproved / allSubtasks.length) * 100) : 0;

  const rated = feedback.filter((f) => f.rating > 0);
  const avgRating = rated.length
    ? (rated.reduce((sum, f) => sum + f.rating, 0) / rated.length).toFixed(1)
    : "—";

  const latestFeedback = feedback[0];
  const mentorName = latestFeedback?.mentor || "Your mentor";
  const mentorQuote = latestFeedback?.summary || "No feedback yet. It will appear here after your first review.";
  const mentorTime = latestFeedback?.date || "";

  const quickLinks = [
    { title: "Submit new work", description: "Share files or a link with your mentor", href: "/dashboard/submit-work", icon: Upload, tone: "indigo" },
    { title: "View my tasks", description: `${activeTasks} tasks need attention`, href: "/dashboard/tasks", icon: ListTodo, tone: "emerald" },
    { title: "Check my projects", description: "Track sprints and milestones", href: "/dashboard/my-projects", icon: FolderKanban, tone: "violet" },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f7f8fc] px-4 py-5 font-sans text-slate-800 antialiased sm:px-6 lg:px-8 lg:py-7 dark:bg-background dark:text-slate-200">
      <div className="stagger mx-auto flex w-full max-w-[1800px] flex-col gap-6">
        <OverviewBanner userName={USER_NAME} internship={INTERNSHIP} hasEnd={hasEnd} overallProgress={overallProgress} weeksLeft={weeksLeft} />

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">Your momentum</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">A quick view of your internship</h2>
            </div>
            <span className="hidden text-xs text-slate-400 sm:block">Updated from your latest activity</span>
          </div>
          <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MiniStatCard icon={Activity} label="Overall progress" value={`${overallProgress}%`} tone="indigo" trend="+6%" trendLabel="vs. last week" />
            <MiniStatCard icon={ListTodo} label="Active tasks" value={activeTasks} tone="blue" trendLabel={overdueTasks > 0 ? `${overdueTasks} overdue` : "all on track"} trendDirection={overdueTasks > 0 ? "down" : "up"} trend={overdueTasks > 0 ? `${overdueTasks}` : undefined} />
            <MiniStatCard icon={CheckCircle2} label="Tasks completed" value={`${completedTasks}/${totalTasks}`} tone="emerald" trendLabel="on time rate high" />
            <MiniStatCard icon={Star} label="Avg. mentor rating" value={`${avgRating} / 5`} tone="amber" trendLabel="across all feedback" />
          </div>
        </section>

        <div className="stagger grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionCard
              icon={ClipboardList}
              title="Recent activity"
              description="What's happened across your internship lately"
              iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
              action={<Link href="/dashboard/progress"><Button variant="ghost" size="sm" className="gap-1 text-xs">View all</Button></Link>}
            >
              <ActivityFeed activity={RECENT_ACTIVITY} />
            </SectionCard>
          </div>
          <OverviewSidebar
            mentorName={mentorName}
            mentorTime={mentorTime}
            mentorQuote={mentorQuote}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            inProgressTasks={inProgressTasks}
            pendingTasks={pendingTasks}
            overdueTasks={overdueTasks}
          />
        </div>

        <QuickLinks links={quickLinks} />
      </div>
    </div>
  );
}
