"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileText,
  GitBranch,
  Paperclip,
  StickyNote,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./Status";
import { getPermissions } from "./submissionLogic";
import SubmissionActionsFooter from "./SubmissionActionsFooter";
import SubmissionProjectLinks from "./SubmissionProjectLinks";

export default function SubmissionDetails({
  submission,
  onEdit = () => {},
  onWithdraw = () => {},
  onRestore = () => {},
  onDelete = () => {},
  onSubmitRevision = () => {},
}) {
  if (!submission) {
    return (
      <Card className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No submission selected
        </h3>
        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
          Pick a submission from your history to see its details.
        </p>
      </Card>
    );
  }

  const files = Array.isArray(submission.files) ? submission.files : [];
  const perms = getPermissions(submission);

  const metadata = [
    { label: "Milestone", value: submission.milestone || "—" },
    {
      label: "Updated",
      value: submission.submittedAt || submission.date || "—",
      icon: CalendarDays,
    },
    { label: "Version", value: submission.version || "v1", icon: GitBranch, mono: true },
    {
      label: "Attachments",
      value: `${files.length} ${files.length === 1 ? "file" : "files"}`,
      icon: Paperclip,
    },
  ];

  return (
    <div id="submission-details" className="scroll-mt-6">
      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <CardHeader className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-primary-50 via-white to-white px-5 py-5 sm:px-6 dark:border-slate-800 dark:from-primary-500/10 dark:via-slate-900 dark:to-slate-900">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary-200/40 blur-2xl dark:bg-primary-400/10" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-primary-700 dark:border-primary-500/30 dark:bg-slate-900 dark:text-primary-300">
                  {submission.id}
                </span>
                <StatusBadge status={submission.status} />
                {submission.scope && (
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {submission.scope}
                  </span>
                )}
                {submission.taskId != null && (
                  <Link
                    href={`/dashboard/tasks?task=${submission.taskId}`}
                    className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[10px] font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
                  >
                    View task →
                  </Link>
                )}
              </div>
              <CardTitle className="max-w-2xl text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {submission.title}
              </CardTitle>
              {submission.description && (
                <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {submission.description}
                </p>
              )}
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-primary-100 sm:flex dark:bg-slate-800 dark:text-primary-400 dark:ring-primary-500/25">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-5 sm:p-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metadata.map(({ label, value, icon: Icon, mono }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-primary-200 hover:bg-primary-50/60 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-primary-500/30 dark:hover:bg-primary-500/10"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {Icon && (
                    <Icon className="h-3 w-3 text-primary-500 dark:text-primary-400" />
                  )}
                  {label}
                </div>
                <p
                  className={cn(
                    "mt-1.5 truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100",
                    mono && "font-mono",
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <SubmissionProjectLinks submission={submission} />

          {/* Notes */}
          {submission.notes && (
            <div className="flex gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3.5 dark:border-primary-500/25 dark:bg-primary-500/10">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-700 dark:text-primary-300">
                  Submission note
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">
                  {submission.notes}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <SubmissionActionsFooter
          submission={submission}
          perms={perms}
          onEdit={onEdit}
          onWithdraw={onWithdraw}
          onRestore={onRestore}
          onDelete={onDelete}
          onSubmitRevision={onSubmitRevision}
        />
      </Card>
    </div>
  );
}
