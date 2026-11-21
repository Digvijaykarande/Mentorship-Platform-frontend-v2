"use client";

import { ListChecks, MessageCircle } from "lucide-react";

export default function SubmissionBanners({ context, mode, base }) {
  return (
    <>
      {context && mode === "create" && (
        <div className="flex gap-3 rounded-xl border border-primary-200 bg-primary-50 px-3.5 py-3 dark:border-primary-500/25 dark:bg-primary-500/10">
          <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-700 dark:text-primary-300">
              Step {context.stepNumber} of {context.total}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">
              {context.stepText}. Your mentor reviews this submission to unlock the next step.
            </p>
          </div>
        </div>
      )}

      {mode === "revise" && base?.feedback && (
        <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 dark:border-rose-500/25 dark:bg-rose-500/10">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">
              Mentor feedback
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">
              {base.feedback}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
