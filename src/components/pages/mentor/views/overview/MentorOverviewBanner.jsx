import Link from "next/link";
import { ArrowRight, ListTodo, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../../MentorMotion";

export default function MentorOverviewBanner({
  snapshot,
  onCreateProject,
  onCreateTask,
}) {
  return (
    <Reveal className="relative overflow-hidden rounded-[1.5rem] border border-primary-900/80 bg-[linear-gradient(120deg,#0f172a_0%,#172554_58%,#312e81_100%)] px-5 py-5 text-white shadow-[0_24px_60px_-32px_rgba(49,46,129,0.8)] sm:px-6">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-primary-200 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" /> Mentor Program Command Center
          </span>
          <h1 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Keep every intern moving forward.
          </h1>
          <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
            <strong className="text-white">{snapshot.avgProgress}%</strong> average task completion
            across the active workspace.{" "}
            <strong className="text-secondary-300">{snapshot.pendingReviews}</strong> deliverables are
            waiting for your review and approval.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            size="default"
            onClick={onCreateProject}
            className="h-10 gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-slate-950 shadow-lg shadow-black/10 hover:bg-primary-50"
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
          <Button
            size="default"
            onClick={onCreateTask}
            variant="outline"
            className="h-10 gap-2 rounded-xl border-white/15 bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/20"
          >
            <ListTodo className="h-4 w-4" /> Assign Task
          </Button>
          <Link href="/mentor/submissions">
            <Button
              size="default"
              variant="outline"
              className="h-10 gap-2 rounded-xl border-primary-300/20 bg-primary-400/15 px-4 text-xs font-semibold text-primary-100 hover:bg-primary-400/25"
            >
              Review Queue <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
