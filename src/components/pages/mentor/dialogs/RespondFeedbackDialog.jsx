"use client";

import { useState } from "react";
import { MessageCircle, Send, Quote, ThumbsUp, Target } from "lucide-react";
import { useMentorActions } from "../MentorProvider";
import { MentorAvatar } from "../MentorCommon";
import {
  Field,
  FormError,
  FormSection,
  FormTextarea,
  ListEditor,
  RatingInput,
  SegmentedControl,
} from "../MentorForm";
import { Reveal } from "../MentorMotion";
import { MentorModal, ModalActions, Chip } from "../MentorModal";

const STATUSES = [
  { value: "Resolved", label: "Resolved", tone: "emerald" },
  { value: "In Review", label: "Keep in review", tone: "indigo" },
  { value: "Action Required", label: "Action needed", tone: "rose" },
];

const splitLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

export default function RespondFeedbackDialog({
  requestItem,
  open,
  onOpenChange,
  onResponded,
}) {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("Resolved");
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState("");

  const mentorActions = useMentorActions();
  const [prevTarget, setPrevTarget] = useState(requestItem);

  // Reset the form when this dialog opens / switches target (adjust state during render, not in an effect).
  if (requestItem !== prevTarget) {
    setPrevTarget(requestItem);
    if (requestItem) {
      setRating(5);
      setStatus("Resolved");
      setSummary("");
      setStrengths(
        "Demonstrated proactive communication\nThoughtful questions about architectural choices"
      );
      setImprovements("");
      setError("");
    }
  }

  if (!requestItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError("Please write a response to the intern's feedback request.");
      return;
    }
    try {
      await mentorActions.respondFeedback(requestItem.id, {
        rating: Number(rating),
        status,
        summary: summary.trim(),
        strengths: splitLines(strengths),
        improvements: splitLines(improvements),
      });
      if (onResponded) onResponded(requestItem);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Failed to record feedback response. Please try again.");
    }
  };

  return (
    <MentorModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={MessageCircle}
      tone="sky"
      title="Respond to mentorship request"
      description={`Provide guidance and answer the question raised by ${requestItem.mentee}.`}
      onSubmit={handleSubmit}
      footer={
        <ModalActions
          onCancel={() => onOpenChange(false)}
          submitLabel="Send response"
          icon={Send}
          tone="sky"
        />
      }
    >
      {/* Intern request recap */}
      <Reveal className="mb-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <MentorAvatar name={requestItem.mentee} className="h-9 w-9 text-[11px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
              {requestItem.mentee}
            </p>
            <p className="text-[11px] text-slate-400">{requestItem.date}</p>
          </div>
          {requestItem.project && <Chip>{requestItem.project}</Chip>}
        </div>
        <div className="mt-3 flex gap-2.5">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white">
              {requestItem.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {requestItem.summary}
            </p>
          </div>
        </div>
      </Reveal>

      <FormError>{error}</FormError>
      {error && <div className="h-4" />}

      <FormSection title="Your response">
        <Field label="Mentor answer & guidance" required>
          <FormTextarea
            autoFocus
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setError("");
            }}
            placeholder="Answer the question, recommend best practices or share architectural pointers…"
            rows={5}
          />
        </Field>
        <div className="space-y-4">
          <Field label="Assessment rating">
            <RatingInput value={rating} onChange={setRating} />
          </Field>
          <Field label="Resolution">
            <SegmentedControl
              value={status}
              onChange={setStatus}
              options={STATUSES}
              className="h-11 [&>button]:h-9"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection icon={ThumbsUp} title="Strengths observed">
        <ListEditor
          variant="bullet"
          value={strengths}
          onChange={setStrengths}
          placeholder="A strength to highlight"
          addLabel="Add strength"
        />
      </FormSection>

      <FormSection icon={Target} title="Recommended next steps">
        <ListEditor
          variant="bullet"
          value={improvements}
          onChange={setImprovements}
          placeholder="A recommended action"
          addLabel="Add next step"
        />
      </FormSection>
    </MentorModal>
  );
}
