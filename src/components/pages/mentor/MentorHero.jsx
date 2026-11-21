"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./MentorMotion";

/**
 * Dark hero banner used at the top of every mentor page (matches Overview).
 * Actions go in `children`; style primary buttons with MENTOR_HERO_BTN.
 */
export const MENTOR_HERO_BTN =
  "h-10 gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-slate-950 shadow-lg shadow-black/10 hover:bg-primary-50";

export default function MentorHero({ badge, icon: Icon, title, description, children, className }) {
  return (
    <Reveal
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-primary-900/80 bg-[linear-gradient(120deg,#0f172a_0%,#172554_58%,#312e81_100%)] px-5 py-5 text-white shadow-[0_24px_60px_-32px_rgba(49,46,129,0.8)] sm:px-6",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-primary-200 shadow-sm">
              {Icon && <Icon className="h-3.5 w-3.5" />} {badge}
            </span>
          )}
          <h1 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">{description}</p>
          )}
        </div>
        {children && <div className="flex flex-wrap gap-2.5">{children}</div>}
      </div>
    </Reveal>
  );
}
