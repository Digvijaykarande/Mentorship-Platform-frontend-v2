import { ExternalLink, Link2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTypeMeta } from "./constants";

export default function SubmissionProjectLinks({ submission }) {
  if (!submission.github && !submission.live && !submission.link) {
    return null;
  }

  const openLabel = getTypeMeta(submission.type).openLabel;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/40">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
          <Link2 className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Project links
          </p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
            Open the submitted work in a new tab.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {submission.github && (
          <a
            href={submission.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <FaGithub className="h-3.5 w-3.5" /> Repository
          </a>
        )}
        {submission.link && (
          <a
            href={submission.link}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <Link2 className="h-3.5 w-3.5" /> {openLabel}
          </a>
        )}
        {submission.live && (
          <a
            href={submission.live}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 border-0 font-medium shadow-sm",
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Live preview
          </a>
        )}
      </div>
    </div>
  );
}
