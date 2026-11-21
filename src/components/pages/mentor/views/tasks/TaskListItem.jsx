import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Folder,
  ListTodo,
} from "lucide-react";
import { MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";

export default function TaskListItem({ task, index, onSelect }) {
  const stepsCount = task.subtasks?.length || 0;
  const completedCount = task.subtasks
    ? task.subtasks.filter((s) => s.done && s.approved).length
    : 0;
  const progressVal = stepsCount
    ? (completedCount / stepsCount) * 100
    : 0;
  const percent = Math.round(progressVal);
  const isDone = task.status === "Done";
  const isOverdue = Boolean(task.overdue) && !isDone;

  return (
    <Reveal
      index={index}
      delay={200}
      onClick={onSelect}
      className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-3 pl-5 pr-3.5 shadow-xs transition duration-200 hover:-translate-y-px hover:border-primary-200 hover:shadow-md sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary-500/30"
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${
          isDone
            ? "bg-emerald-500"
            : isOverdue
              ? "bg-rose-500"
              : "bg-primary-500"
        }`}
      />

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isDone
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : isOverdue
                ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                : "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : isOverdue ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <ListTodo className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-slate-900 dark:text-slate-100">
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="flex min-w-0 items-center gap-1">
              <Folder className="h-3 w-3 shrink-0" />
              <span className="truncate">{task.project}</span>
            </span>
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{task.mentee}</span>
            </span>
            <span
              className={`flex items-center gap-1 font-medium ${
                isOverdue ? "text-rose-500" : ""
              }`}
            >
              <Clock3 className="h-3 w-3 shrink-0" />
              Due {task.due}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:w-72">
        <div
          className="flex-1"
          title={`${completedCount} of ${stepsCount} steps approved`}
        >
          <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Progress</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {percent}%
            </span>
          </div>
          <MentorProgressBar
            value={progressVal}
            delay={400 + index * 45}
            tone={
              isDone
                ? "bg-emerald-500"
                : task.overdue
                  ? "bg-rose-500"
                  : "bg-primary-500"
            }
          />
        </div>
        <MentorStatusBadge status={task.status} />
        <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500 sm:block" />
      </div>
    </Reveal>
  );
}
