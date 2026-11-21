import { BriefcaseBusiness } from "lucide-react";
import { MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";

export default function ProjectGridCard({ project, index, onSelect }) {
  return (
    <Reveal
      index={index}
      delay={200}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/15 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-500/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {project.name}
            </p>
            <p className="text-[11px] text-slate-400">
              {project.cohort} · {(project.assignees || []).length || project.contributors || 0} interns
            </p>
          </div>
        </div>
        <MentorStatusBadge status={project.status} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Mentor: <strong className="text-slate-700 dark:text-slate-300">{project.mentor || project.owner}</strong>
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {project.progress || 0}%
        </span>
      </div>

      <div className="mt-1.5">
        <MentorProgressBar
          value={project.progress}
          delay={400 + index * 45}
          tone={
            project.progress > 80
              ? "bg-emerald-500"
              : project.progress < 50
              ? "bg-rose-500"
              : "bg-primary-500"
          }
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] dark:border-slate-800">
        <span className="truncate text-slate-400">
          {(project.assignees || []).join(", ") || "No intern assigned"}
        </span>
        <span
          className={`font-semibold ${
            project.risk === "On track" ? "text-emerald-600" : "text-secondary-600"
          }`}
        >
          {project.due}
        </span>
      </div>
    </Reveal>
  );
}
