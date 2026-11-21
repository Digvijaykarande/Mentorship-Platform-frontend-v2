import {
  Check,
  Clock3,
  ExternalLink,
  FileText,
  Folder,
  ListTodo,
  PlusCircle,
  UserRound,
} from "lucide-react";
import {
  MentorModal,
  ModalButton,
  InfoTile,
  DetailSection,
  Chip,
} from "../../MentorModal";
import { FormInput } from "../../MentorForm";
import { MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";

function TaskStep({ step, index, list }) {
  const isDone = step.done && step.approved;
  const isSubmitted = step.done && !step.approved;
  const isNeedsChanges = step.changesRequested;
  const isCurrent = !step.done && index === list.findIndex((s) => !s.done);

  return (
    <div key={step.id} className="relative flex gap-3 pb-3 last:pb-0">
      {index < list.length - 1 && (
        <span className="absolute left-3 top-7 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
      )}
      <span
        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-white dark:ring-slate-900 ${
          isDone ? "bg-emerald-500 text-white"
          : isNeedsChanges ? "bg-rose-500 text-white"
          : isSubmitted ? "bg-secondary-500 text-white"
          : isCurrent ? "bg-primary-600 text-white"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
      </span>
      <div
        className={`min-w-0 flex-1 rounded-xl border p-3 text-xs ${
          isDone ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : isNeedsChanges ? "border-rose-200 bg-rose-50/40 dark:border-rose-500/20 dark:bg-rose-500/5"
          : isSubmitted ? "border-secondary-200 bg-secondary-50/40 dark:border-secondary-500/20 dark:bg-secondary-500/5"
          : isCurrent ? "border-primary-200 bg-primary-50/40 dark:border-primary-500/30 dark:bg-primary-500/5"
          : "border-slate-200/80 dark:border-slate-800"
        }`}
      >
        <p className="font-semibold text-slate-800 dark:text-slate-100">{step.text}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          {isDone ? "Approved by mentor"
          : isSubmitted ? "Submitted · awaiting mentor review"
          : isNeedsChanges ? `Changes requested: ${step.reviewNote || "Review required"}`
          : isCurrent ? "Current active step"
          : "Locked until previous step passes review"}
        </p>
      </div>
    </div>
  );
}

export default function TaskDetailModal({
  selectedTask,
  liveSelectedTask,
  onClose,
  newStepText,
  setNewStepText,
  stepError,
  handleAddStep,
}) {
  const selectedStepsTotal = liveSelectedTask?.subtasks?.length || 0;
  const selectedStepsDone = liveSelectedTask?.subtasks
    ? liveSelectedTask.subtasks.filter((s) => s.done && s.approved).length
    : 0;

  return (
    <MentorModal
      open={Boolean(selectedTask)}
      onOpenChange={(open) => !open && onClose()}
      size="xl"
      icon={ListTodo}
      tone={liveSelectedTask?.overdue && liveSelectedTask?.status !== "Done" ? "rose" : "indigo"}
      badges={
        liveSelectedTask && (
          <>
            <MentorStatusBadge status={liveSelectedTask.status} />
            {liveSelectedTask.priority && <Chip>{liveSelectedTask.priority} priority</Chip>}
            {liveSelectedTask.overdue && liveSelectedTask.status !== "Done" && (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                Overdue
              </span>
            )}
          </>
        )
      }
      title={liveSelectedTask?.title}
      description={liveSelectedTask && `${liveSelectedTask.project} · Assigned to ${liveSelectedTask.mentee}`}
      footer={<ModalButton variant="secondary" onClick={onClose}>Close</ModalButton>}
    >
      {liveSelectedTask && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          <div className="space-y-6">
            {liveSelectedTask.instructions && (
              <DetailSection title="Instructions & acceptance criteria">
                <p className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                  {liveSelectedTask.instructions}
                </p>
              </DetailSection>
            )}
            <DetailSection title="Ordered workflow steps" count={liveSelectedTask.subtasks?.length || 0}>
              <div>
                {(liveSelectedTask.subtasks || []).map((step, index, list) => (
                  <TaskStep key={step.id} step={step} index={index} list={list} />
                ))}
                {!(liveSelectedTask.subtasks || []).length && (
                  <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                    No steps yet. Add the first step below.
                  </p>
                )}
              </div>
              {stepError && <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">{stepError}</p>}
              <form onSubmit={handleAddStep} className="flex gap-2 pt-1">
                <div className="flex-1">
                  <FormInput value={newStepText} onChange={(e) => setNewStepText(e.target.value)} placeholder="Add the next sequential step…" className="h-10" />
                </div>
                <ModalButton type="submit" disabled={!newStepText.trim()} className="shrink-0">
                  <PlusCircle className="h-4 w-4" /> Add step
                </ModalButton>
              </form>
            </DetailSection>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <InfoTile icon={UserRound} label="Assigned to" value={liveSelectedTask.mentee} />
              <InfoTile icon={Folder} label="Project" value={liveSelectedTask.project} />
              <InfoTile icon={Clock3} label="Due" value={liveSelectedTask.due} />
            </div>
            <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedStepsTotal ? Math.round((selectedStepsDone / selectedStepsTotal) * 100) : 0}%
                </span>
              </div>
              <div className="mt-3">
                <MentorProgressBar
                  value={selectedStepsTotal ? (selectedStepsDone / selectedStepsTotal) * 100 : 0}
                  tone={liveSelectedTask.status === "Done" ? "bg-emerald-500" : "bg-primary-500"}
                />
              </div>
            </div>
            {liveSelectedTask.resources && liveSelectedTask.resources.length > 0 && (
              <DetailSection title="Attached resources" count={liveSelectedTask.resources.length}>
                <div className="space-y-2">
                  {liveSelectedTask.resources.map((res) => (
                    <a key={res.id} href={res.url || "#"} target={res.url ? "_blank" : undefined} rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-slate-200/80 p-3 text-xs transition hover:border-primary-300 hover:bg-primary-50/40 dark:border-slate-800 dark:hover:border-primary-500/40"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{res.name}</span>
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-300 transition group-hover:text-primary-500" />
                    </a>
                  ))}
                </div>
              </DetailSection>
            )}
          </div>
        </div>
      )}
    </MentorModal>
  );
}
