import {
  Ban,
  ChevronRight,
  Eye,
  MoreVertical,
  Pencil,
  RefreshCcw,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./Status";
import { getPermissions } from "./submissionLogic";

export default function SubmissionHistoryItem({
  submission,
  selected,
  onSelect,
  onEdit,
  onWithdraw,
  onRestore,
  onDelete,
  onSubmitRevision,
  onViewDetails,
}) {
  const perms = getPermissions(submission);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all ${
        selected
          ? "border-primary-200 bg-primary-50/55 shadow-sm ring-1 ring-primary-100 dark:border-primary-500/25 dark:bg-primary-500/10 dark:ring-primary-500/25"
          : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-500/25"
      }`}
    >
      {selected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary-500" />
      )}
      <div className="flex items-center gap-3 px-3.5 py-3">
        <Button
          variant="unstyled"
          type="button"
          onClick={() => onSelect(submission.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[13px] font-bold text-slate-900 dark:text-white">
                {submission.title}
              </h3>
              <span className="hidden shrink-0 font-mono text-[10px] text-slate-400 sm:inline">
                {submission.id}
              </span>
            </div>
            <div className="mt-1 flex min-w-0 items-center gap-2">
              <StatusBadge status={submission.status} />
              <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {submission.type}
              </span>
              <span className="shrink-0 text-[11px] text-slate-400">
                {submission.version}
              </span>
            </div>
          </div>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-300"
                aria-label="Submission actions"
              />
            }
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => onViewDetails(submission.id)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            {perms.canEdit && (
              <DropdownMenuItem onClick={() => onEdit(submission.id)}>
                <Pencil className="h-3.5 w-3.5" /> Edit submission
              </DropdownMenuItem>
            )}
            {perms.canRevise && (
              <DropdownMenuItem onClick={() => onSubmitRevision(submission.id)}>
                <RefreshCcw className="h-3.5 w-3.5" /> Submit revision
              </DropdownMenuItem>
            )}
            {perms.canRestore && (
              <DropdownMenuItem onClick={() => onRestore(submission.id)}>
                <RotateCcw className="h-3.5 w-3.5" /> Restore submission
              </DropdownMenuItem>
            )}
            {(perms.canWithdraw || perms.canDelete) && <DropdownMenuSeparator />}
            {perms.canWithdraw && (
              <DropdownMenuItem onClick={() => onWithdraw(submission.id)}>
                <Ban className="h-3.5 w-3.5" /> Withdraw
              </DropdownMenuItem>
            )}
            {perms.canDelete && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(submission.id)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete submission
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => onSelect(submission.id)}
        className="flex w-full items-center justify-between border-t border-slate-100/80 px-3.5 py-2 text-left text-[11px] text-slate-500 transition-colors hover:bg-white/70 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/70"
      >
        <span>{submission.submittedAt || submission.date}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400">
          View details <ChevronRight className="h-3 w-3" />
        </span>
      </Button>
    </div>
  );
}
