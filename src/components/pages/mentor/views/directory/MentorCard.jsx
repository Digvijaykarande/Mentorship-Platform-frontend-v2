import { ArrowUpRight, Clock, Star } from "lucide-react";
import { MentorAvatar, MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";
import {
  MENTOR_AVATAR,
  capacityTone,
  parseCapacity,
} from "./mentorDirectoryUtils";

export default function MentorCard({ mentor, index, onSelect }) {
  const cap = parseCapacity(mentor.capacity);
  const pct = cap.total ? Math.round((cap.used / cap.total) * 100) : 0;

  return (
    <Reveal
      as="button"
      type="button"
      index={index}
      delay={200}
      onClick={onSelect}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/15 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-primary-500/30"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-500 via-primary-500 to-sky-400 opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <MentorAvatar
            name={mentor.name}
            tone={MENTOR_AVATAR}
            className="h-12 w-12 text-sm shadow-md shadow-violet-500/20"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {mentor.name}
            </p>
            <p className="truncate text-xs text-slate-400">{mentor.specialty}</p>
          </div>
        </div>
        <MentorStatusBadge status={mentor.status} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/40">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Interns
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
            {mentor.interns}
          </p>
        </div>
        <div className="border-x border-slate-200/70 text-center dark:border-slate-700">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Rating
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Star className="h-3.5 w-3.5 fill-secondary-400 text-secondary-400" />
            {mentor.rating}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Capacity
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
            {mentor.capacity}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <MentorProgressBar value={pct} delay={400 + index * 45} tone={capacityTone(pct)} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> Active {mentor.lastActive}
        </span>
        <span className="flex items-center gap-0.5 font-semibold text-primary-600 dark:text-primary-400">
          View profile
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Reveal>
  );
}
