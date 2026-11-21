import { ArrowRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { MentorAvatar, MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";
import { avatarTone, progressTone } from "./internUtils";

export default function InternCard({ user, index, onOpen }) {
  const tone = avatarTone(user.id);
  return (
    <Reveal
      as="article"
      index={index}
      delay={120}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs outline-none transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 focus-visible:ring-4 focus-visible:ring-primary-500/15 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-500/30"
    >
      {/* Banner */}
      <div className={cn("relative h-16 opacity-90", tone)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="absolute right-3 top-3">
          <MentorStatusBadge status={user.status} className="bg-white/90 shadow-xs backdrop-blur dark:bg-slate-900/80" />
        </div>
      </div>

      <div className="px-4 pb-4">
        <MentorAvatar
          name={user.name}
          tone={tone}
          className="-mt-7 h-14 w-14 text-sm shadow-lg ring-4 ring-white dark:ring-slate-900"
        />

        <div className="mt-2.5 min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
          <p className="truncate text-[11px] text-slate-400">{user.email}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Briefcase className="h-3 w-3 text-slate-400" />
            {user.team}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Completion</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{user.progress}%</span>
          </div>
          <MentorProgressBar value={user.progress} delay={350 + index * 45} tone={progressTone(user.progress)} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-2">
            <MentorAvatar
              name={user.mentor}
              tone="bg-linear-to-br from-violet-500 to-primary-600"
              className="h-6 w-6 text-[9px]"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mentor</p>
              <p className="truncate text-[11px] font-semibold text-slate-700 dark:text-slate-200">{user.mentor}</p>
            </div>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-800">
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}
