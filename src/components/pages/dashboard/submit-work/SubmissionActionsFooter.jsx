import { CheckCircle2, Pencil, RefreshCcw, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

export default function SubmissionActionsFooter({
  submission,
  perms,
  onEdit,
  onWithdraw,
  onRestore,
  onDelete,
  onSubmitRevision,
}) {
  return (
    <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-800/40">
      {perms.isLocked ? (
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
          Approved by mentor · locked
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {perms.canRestore
            ? "This submission is withdrawn. Restore it to send it for review again."
            : perms.canRevise
              ? "Update the work and submit a new version."
              : "Your mentor will review this submission. You can still edit it."}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {perms.canRevise && (
          <Button
            size="sm"
            className="gap-1.5 rounded-lg px-4 font-medium"
            onClick={() => onSubmitRevision(submission.id)}
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Submit revision
          </Button>
        )}
        {perms.canRestore && (
          <Button
            size="sm"
            className="gap-1.5 rounded-lg px-4 font-medium"
            onClick={() => onRestore(submission.id)}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restore
          </Button>
        )}
        {perms.canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-lg font-medium"
            onClick={() => onEdit(submission.id)}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
        {perms.canWithdraw && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-rose-200 bg-white font-medium text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-500/30 dark:bg-transparent dark:text-rose-400 dark:hover:bg-rose-500/10"
            onClick={() => onWithdraw(submission.id)}
          >
            Withdraw
          </Button>
        )}
        {perms.canDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-lg font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"
            onClick={() => onDelete(submission.id)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        )}
      </div>
    </CardFooter>
  );
}
