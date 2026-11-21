"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ClipboardCheck,
  ThumbsUp,
  Target,
  UserCheck,
} from "lucide-react";
import { useMentorActions } from "../MentorProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { MentorStatusBadge } from "../MentorCommon";
import {
  Field,
  FormError,
  FormInput,
  FormSelect,
  FormTextarea,
  ListEditor,
  RatingInput,
  SegmentedControl,
  ToggleCard,
} from "../MentorForm";
import { MentorModal, ModalButton } from "../MentorModal";
import ReviewSubmissionSidebar from "./ReviewSubmissionSidebar";

const DECISIONS = [
  { value: "approve", label: "Approve", icon: CheckCircle2, tone: "emerald" },
  { value: "changes", label: "Request changes", icon: AlertCircle, tone: "rose" },
];

const splitLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

export default function ReviewSubmissionDialog({
  submission,
  open,
  onOpenChange,
  onReviewed,
}) {
  const [decision, setDecision] = useState("approve");
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);
  const { user } = useAuth();
  const mentorActions = useMentorActions();
  const [reviewer, setReviewer] = useState(user?.name || "");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState("");

  const [queueNextTask, setQueueNextTask] = useState(false);
  const [nextTaskTitle, setNextTaskTitle] = useState("");
  const [nextTaskSteps, setNextTaskSteps] = useState("");
  const [nextTaskDue, setNextTaskDue] = useState("");

  const [prevTarget, setPrevTarget] = useState(submission);

  if (submission !== prevTarget) {
    setPrevTarget(submission);
    if (submission) {
      setDecision("approve");
      setNote(submission.feedback || "");
      setRating(submission.rating || 5);
      setStrengths("");
      setImprovements("");
      setError("");
      setQueueNextTask(false);
      setNextTaskTitle("");
      setNextTaskSteps("");
      setNextTaskDue("");
    }
  }

  if (!submission) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (decision === "changes" && !note.trim()) {
      setError("Please explain what changes are required so the intern can revise their work.");
      return;
    }

    const body = {
      decision: decision === "approve" ? "approve" : "changes",
      note: note.trim(),
      rating: Number(rating),
      strengths: splitLines(strengths),
      improvements: splitLines(improvements),
    };
    if (decision === "approve" && queueNextTask && nextTaskTitle.trim()) {
      body.nextTask = {
        title: nextTaskTitle.trim(),
        steps: splitLines(nextTaskSteps),
        dueDate: nextTaskDue || null,
        instructions: `Assigned following approval of ${submission.title}.`,
      };
    }

    try {
      await mentorActions.reviewSubmission(submission.id, body);
      if (onReviewed) onReviewed(submission, decision);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Could not update submission. Please try again.");
    }
  };

  return (
    <MentorModal
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      icon={ClipboardCheck}
      tone={decision === "approve" ? "emerald" : "rose"}
      badges={
        <>
          <MentorStatusBadge status={submission.status} />
          <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            {submission.id}
          </span>
        </>
      }
      title={submission.title}
      description={`${submission.scope || "Deliverable"} · ${submission.milestone || "Milestone review"}`}
      onSubmit={handleSubmit}
      footer={
        <>
          <ModalButton type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </ModalButton>
          <ModalButton type="submit" tone={decision === "approve" ? "emerald" : "rose"}>
            {decision === "approve" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {decision === "approve" ? "Approve & unlock step" : "Send changes request"}
          </ModalButton>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <ReviewSubmissionSidebar submission={submission} />

        {/* ---------------- Review form ---------------- */}
        <div className="space-y-5">
          <FormError>{error}</FormError>

          <Field label="Decision">
            <SegmentedControl
              solid
              value={decision}
              onChange={(v) => {
                setDecision(v);
                setError("");
              }}
              options={DECISIONS}
              className="[&>button]:h-10"
            />
          </Field>

          <div className="space-y-4">
            <Field label="Mentor reviewer">
              <FormSelect
                icon={UserCheck}
                value={reviewer}
                onValueChange={setReviewer}
                options={[user?.name || ""]}
                placeholder="Select mentor"
              />
            </Field>
            <Field label="Rating">
              <RatingInput value={rating} onChange={setRating} />
            </Field>
          </div>

          <Field
            label="Feedback & notes"
            required={decision === "changes"}
            hint={decision === "approve" ? "Optional summary" : "Required for revision"}
          >
            <FormTextarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError("");
              }}
              placeholder={
                decision === "approve"
                  ? "Great work meeting the acceptance criteria. Code is clean and tests pass."
                  : "Please address the following before this step can be approved…"
              }
              rows={4}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Strengths" hint="Optional">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ThumbsUp className="h-3 w-3" /> What went well
              </div>
              <ListEditor
                variant="bullet"
                value={strengths}
                onChange={setStrengths}
                placeholder="Clean modular architecture"
                addLabel="Add"
              />
            </Field>
            <Field label="Areas for growth" hint="Optional">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-secondary-600 dark:text-secondary-400">
                <Target className="h-3 w-3" /> Next improvements
              </div>
              <ListEditor
                variant="bullet"
                value={improvements}
                onChange={setImprovements}
                placeholder="Add edge-case handling"
                addLabel="Add"
              />
            </Field>
          </div>

          {decision === "approve" && (
            <ToggleCard
              icon={Sparkles}
              title="Queue a follow-up task"
              description="Assign the next piece of work as soon as this is approved."
              checked={queueNextTask}
              onCheckedChange={setQueueNextTask}
            >
              <Field label="Next task title">
                <FormInput
                  value={nextTaskTitle}
                  onChange={(e) => setNextTaskTitle(e.target.value)}
                  placeholder="e.g. Integrate token refresh middleware"
                />
              </Field>
              <Field label="Ordered steps">
                <ListEditor
                  value={nextTaskSteps}
                  onChange={setNextTaskSteps}
                  placeholder="Describe this step"
                  addLabel="Add step"
                />
              </Field>
              <Field label="Due date" hint="Optional">
                <FormInput
                  type="date"
                  value={nextTaskDue}
                  onChange={(e) => setNextTaskDue(e.target.value)}
                />
              </Field>
            </ToggleCard>
          )}
        </div>
      </div>
    </MentorModal>
  );
}
