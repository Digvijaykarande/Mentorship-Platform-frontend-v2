import Link from "next/link";
import { Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OverviewBanner({
  userName,
  internship,
  hasEnd,
  overallProgress,
  weeksLeft,
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#101426] px-6 py-7 text-white shadow-[0_18px_55px_-24px_rgba(15,23,42,0.55)] sm:px-8 sm:py-9 lg:px-10">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[28%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium text-primary-100">
            <Sparkles className="h-3 w-3" /> Week {internship.currentWeek}
            {hasEnd ? ` of ${internship.totalWeeks}` : ""}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            Welcome back, {userName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
            You&apos;re {overallProgress}% through your assigned work —{" "}
            {weeksLeft > 0
              ? `${weeksLeft} weeks left until ${internship.endDate}.`
              : hasEnd
                ? "final week, finish strong!"
                : "keep going!"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Next milestone
            </p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {weeksLeft > 0
                ? `${weeksLeft} weeks remaining`
                : hasEnd
                  ? "Finish strong"
                  : "Keep going"}
            </p>
          </div>
          <Link href="/dashboard/submit-work">
            <Button
              size="lg"
              className="h-11 gap-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100"
            >
              <Upload className="h-4 w-4 text-slate-900" />
              Submit new work
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
