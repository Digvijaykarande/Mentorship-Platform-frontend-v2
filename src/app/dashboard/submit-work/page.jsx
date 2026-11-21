"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SubmitWorkHeader from "@/components/pages/dashboard/submit-work/SubmitWorkHeader";
import SubmissionSummary from "@/components/pages/dashboard/submit-work/SubmissionSummary";
import SubmissionToolbar from "@/components/pages/dashboard/submit-work/SubmissionToolbar";
import SubmissionHistory from "@/components/pages/dashboard/submit-work/SubmissionHistory";
import SubmissionDetails from "@/components/pages/dashboard/submit-work/SubmissionDetails";
import VersionHistory from "@/components/pages/dashboard/submit-work/VersionHistory";
import SubmissionReviewSnapshot from "@/components/pages/dashboard/submit-work/SubmissionReviewSnapshot";
import NewSubmissionDialog from "@/components/pages/dashboard/submit-work/NewSubmissionDialog";
import ConfirmDialog from "@/components/pages/dashboard/submit-work/ConfirmDialog";
import SubmitWorkToast from "@/components/pages/dashboard/submit-work/SubmitWorkToast";
import { useSubmitWorkHandlers } from "@/components/pages/dashboard/submit-work/useSubmitWorkHandlers";
import { statusKey } from "@/components/pages/dashboard/submit-work/Status";
import { stepStates } from "@/components/pages/dashboard/tasks/taskData";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";

const SUMMARY_FILTERS = {
  "total-submissions": "All",
  "submitted-work": "pending",
  "under-review": "changes",
  "approved-work": "approved",
};

export default function SubmitWorkPage() {
  const router = useRouter();
  const { submissions, tasks, ready, actions } = useWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const handledLink = useRef(false);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((sub) => {
      const matchSearch =
        !q ||
        [sub.id, sub.title, sub.type, sub.scope, sub.task, sub.milestone, sub.status, sub.version]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(q));
      return (
        matchSearch &&
        (statusFilter === "All" || statusKey(sub.status) === statusFilter) &&
        (typeFilter === "All" || sub.type === typeFilter)
      );
    });
  }, [submissions, search, statusFilter, typeFilter]);

  const selectedSubmission = useMemo(
    () => filteredSubmissions.find((s) => s.id === selectedId) || filteredSubmissions[0] || null,
    [filteredSubmissions, selectedId],
  );

  const handlers = useSubmitWorkHandlers({
    submissions,
    actions,
    router,
    resetFilters,
    setSelectedId,
    dialogSubmission: submissions.find((s) => s.id === handlers?.dialog?.submissionId) || null,
  });

  const dialogSubmission = useMemo(
    () => submissions.find((s) => s.id === handlers.dialog.submissionId) || null,
    [submissions, handlers.dialog.submissionId],
  );

  // Links from other pages:
  useEffect(() => {
    if (!ready || handledLink.current) return;
    handledLink.current = true;
    const params = new URLSearchParams(window.location.search);
    const taskParam = params.get("task");
    const stepParam = params.get("step");
    const submissionParam = params.get("submission");
    if (submissionParam) {
      const target = submissions.find((item) => item.id === submissionParam || item.apiId === submissionParam);
      if (target) {
        setSelectedId(target.id);
        if (params.get("action") === "revise" && statusKey(target.status) === "changes") {
          handlers.setDialog({ open: true, mode: "revise", type: target.type, submissionId: target.id, preset: null, key: Date.now() });
        }
      }
    } else if (taskParam) {
      const task = tasks.find((item) => String(item.id) === taskParam);
      const steps = task?.subtasks || [];
      const index = steps.findIndex((step) => step.id === stepParam);
      if (task && index >= 0 && stepStates(steps)[index] === "current") {
        handlers.setDialog({
          open: true,
          mode: "create",
          type: "Source Code",
          submissionId: null,
          preset: {
            taskId: task.id,
            stepId: steps[index].id,
            title: steps[index].text,
            context: { stepText: steps[index].text, stepNumber: index + 1, total: steps.length },
          },
          key: Date.now(),
        });
      } else if (task && index >= 0 && steps[index].submissionId) {
        setSelectedId(steps[index].submissionId);
      }
    }
    if (taskParam || submissionParam) window.history.replaceState(null, "", window.location.pathname);
  }, [ready, submissions, tasks, handlers]);

  // Tasks the intern can attach work to
  const dialogTasks = useMemo(() => {
    const keepId = handlers.dialog.preset?.taskId ?? dialogSubmission?.taskId;
    return tasks
      .filter((t) => t.status !== "Done" || String(t.id) === String(keepId))
      .map((t) => ({ id: t.id, title: t.title, project: t.project, label: `${t.title} \u00b7 ${t.project}` }));
  }, [tasks, handlers.dialog.preset, dialogSubmission]);

  const handleSummaryCardClick = (card) => {
    if (!card) return;
    setSearch("");
    setStatusFilter(SUMMARY_FILTERS[card.key] || "All");
    setTypeFilter("All");
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f7f8fc] px-4 py-5 font-sans text-slate-800 antialiased sm:px-6 lg:px-8 lg:py-7 dark:bg-background dark:text-slate-200">
      <div className="stagger mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <SubmitWorkHeader
          totalSubmissions={submissions.length}
          onNewSubmission={() => handlers.openNewSubmission("Source Code")}
        />

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">
                Submission workspace
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                Keep every review in one place
              </h2>
            </div>
            <span className="hidden text-xs text-slate-400 sm:block">
              Select a record to inspect its details and versions
            </span>
          </div>
          <SubmissionSummary
            submissions={submissions}
            onCardClick={handleSummaryCardClick}
          />
        </section>

        <section className="space-y-3">
          <div className="px-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              Your submissions
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search your history, then review or revise the selected submission.
            </p>
          </div>
          <SubmissionToolbar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onReset={resetFilters}
          />
        </section>

        <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.45fr)] xl:gap-6">
          <SubmissionHistory
            submissions={filteredSubmissions}
            selectedSubmissionId={selectedSubmission?.id || null}
            onSelect={setSelectedId}
            onEdit={handlers.openEdit}
            onWithdraw={handlers.requestWithdraw}
            onRestore={handlers.handleRestore}
            onDelete={handlers.requestDelete}
            onSubmitRevision={handlers.openRevision}
          />
          <SubmissionDetails
            submission={selectedSubmission}
            onEdit={handlers.openEdit}
            onWithdraw={handlers.requestWithdraw}
            onRestore={handlers.handleRestore}
            onDelete={handlers.requestDelete}
            onSubmitRevision={handlers.openRevision}
          />
        </div>

        {selectedSubmission && (
          <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)] xl:gap-6">
            <VersionHistory
              versions={selectedSubmission.versions}
              submission={selectedSubmission}
            />
            <SubmissionReviewSnapshot submission={selectedSubmission} />
          </div>
        )}
      </div>

      <NewSubmissionDialog
        key={handlers.dialog.key}
        open={handlers.dialog.open}
        mode={handlers.dialog.mode}
        submission={dialogSubmission}
        tasks={dialogTasks}
        presetTaskId={handlers.dialog.preset?.taskId ?? null}
        presetTitle={handlers.dialog.preset?.title ?? ""}
        context={handlers.dialog.preset?.context ?? null}
        initialType={handlers.dialog.type}
        onClose={handlers.closeDialog}
        onSubmit={handlers.handleDialogSubmit}
      />

      <ConfirmDialog
        open={Boolean(handlers.confirm)}
        destructive
        title={
          handlers.confirm?.kind === "delete"
            ? "Delete this submission?"
            : "Withdraw this submission?"
        }
        description={
          handlers.confirm?.kind === "delete"
            ? `"${handlers.confirm?.title}" and its version history will be permanently removed.`
            : `"${handlers.confirm?.title}" will be pulled back from mentor review. You can restore it any time.`
        }
        confirmLabel={handlers.confirm?.kind === "delete" ? "Delete" : "Withdraw"}
        onConfirm={handlers.handleConfirm}
        onCancel={() => handlers.setConfirm(null)}
      />

      <SubmitWorkToast toast={handlers.toast} setToast={handlers.setToast} />
    </div>
  );
}
