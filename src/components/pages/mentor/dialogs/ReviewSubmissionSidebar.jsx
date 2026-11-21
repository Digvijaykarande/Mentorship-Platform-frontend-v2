import {
  Calendar,
  ExternalLink,
  FileText,
  GitBranch,
  History,
  StickyNote,
} from "lucide-react";
import { MentorStatusBadge } from "../MentorCommon";
import { InfoTile, DetailSection } from "../MentorModal";
import { Reveal } from "../MentorMotion";

export default function ReviewSubmissionSidebar({ submission }) {
  return (
    <div className="space-y-5 lg:border-r lg:border-slate-100 lg:pr-8 lg:dark:border-slate-800">
      {submission.description && (
        <Reveal
          as="p"
          className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
        >
          {submission.description}
        </Reveal>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InfoTile
          icon={Calendar}
          label="Submitted"
          value={submission.submittedAt || submission.date || "Recent"}
        />
        <InfoTile
          icon={GitBranch}
          label="Version"
          value={submission.version || "v1.0.0"}
        />
      </div>

      <DetailSection title="Submitted evidence">
        <div className="space-y-2">
          {submission.files && submission.files.length > 0 ? (
            submission.files.map((file) => (
              <div
                key={file}
                className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                  {file}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
              No attachments uploaded.
            </p>
          )}

          {submission.github && (
            <a
              href={submission.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/60 p-3 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" /> Open PR / repository
              </span>
              <span className="text-[10px] text-primary-500">View code</span>
            </a>
          )}
        </div>
      </DetailSection>

      {submission.notes && (
        <DetailSection title="Intern notes">
          <div className="flex gap-2.5 rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-3.5 text-xs dark:border-secondary-500/20 dark:bg-secondary-500/5">
            <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500" />
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
              {submission.notes}
            </p>
          </div>
        </DetailSection>
      )}

      {submission.reviewHistory && submission.reviewHistory.length > 0 && (
        <DetailSection title="Review history" count={submission.reviewHistory.length}>
          <div className="max-h-44 space-y-2 overflow-y-auto">
            {submission.reviewHistory.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 p-3 text-xs dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <MentorStatusBadge status={rev.status} />
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <History className="h-3 w-3" /> {rev.date}
                  </span>
                </div>
                <p className="mt-1.5 leading-relaxed text-slate-600 dark:text-slate-300">
                  {rev.note}
                </p>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );
}
