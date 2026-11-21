import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
} from "lucide-react";
import { EmptyState, MentorSection as SectionCard } from "../../MentorCommon";

export default function MentorAttentionCard({
  pendingSubmissions = [],
  attentionTasks = [],
}) {
  return (
    <SectionCard
      icon={AlertTriangle}
      title="Needs Attention"
      description="High priority deliverables and overdue tasks"
      iconClassName="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
      className="xl:col-span-2"
      revealIndex={6}
    >
      <div className="space-y-4">
        {pendingSubmissions.length > 0 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
              Deliverables Awaiting Review
            </span>
            <div className="mt-1.5 space-y-1.5">
              {pendingSubmissions.map((sub) => (
                <Link
                  href="/mentor/submissions"
                  key={sub.id}
                  className="flex items-center gap-3 rounded-xl border border-secondary-200/60 bg-secondary-50/40 p-2.5 transition hover:bg-secondary-50 dark:border-secondary-900/40 dark:bg-secondary-950/20"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {sub.title}
                    </p>
                    <p className="truncate text-[10px] text-slate-500">
                      {sub.scope} · {sub.milestone}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {attentionTasks.length ? (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Overdue / In Progress Tasks
            </span>
            <div className="mt-1.5 space-y-1.5">
              {attentionTasks.map((task) => (
                <Link
                  href="/mentor/tasks"
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    <Clock3 className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {task.title}
                    </p>
                    <p className="truncate text-[10px] text-slate-400">
                      {task.mentee} · due {task.due}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>
              ))}
            </div>
          </div>
        ) : !pendingSubmissions.length ? (
          <EmptyState
            icon={CheckCircle2}
            title="All clear"
            description="No overdue items or pending reviews currently require attention."
          />
        ) : null}
      </div>
    </SectionCard>
  );
}
