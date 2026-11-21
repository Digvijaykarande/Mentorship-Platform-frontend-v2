"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Gauge,
  MessageSquarePlus,
  Send,
  ThumbsUp,
  Type,
  UserRound,
} from "lucide-react";
import { useMentorActions, useMentorSnapshot } from "../MentorProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  Field,
  FormError,
  FormTextarea,
  RatingInput,
  SegmentedControl,
} from "../MentorForm";
import { StepPanel, WizardStepper } from "../MentorWizard";
import { MentorModal } from "../MentorModal";
import FeedbackContextStep from "./FeedbackContextStep";
import FeedbackTakeawaysStep from "./FeedbackTakeawaysStep";

const CATEGORIES = [
  "Code Quality & Architecture",
  "Testing & Reliability",
  "Product & UX Thinking",
  "Communication & Velocity",
  "Milestone Evaluation",
];

const STATUSES = [
  { value: "Resolved", label: "Resolved", tone: "emerald" },
  { value: "In Review", label: "In review", tone: "indigo" },
  { value: "Action Required", label: "Action needed", tone: "rose" },
];

const STEPS = [
  { id: "context", label: "Context", icon: Type },
  { id: "assessment", label: "Assessment", icon: Gauge },
  { id: "takeaways", label: "Takeaways", icon: ThumbsUp },
];

const splitLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

export default function GiveFeedbackDialog({
  open,
  onOpenChange,
  onCreated,
  initialMentee,
  initialMentor,
  projects = [],
}) {
  const { interns: MENTOR_INTERNS } = useMentorSnapshot();
  const mentorActions = useMentorActions();
  const { user } = useAuth();
  const mentorNames = [user?.name];
  const buildForm = () => ({
    title: "",
    project: projects[0]?.name || "General Mentorship",
    mentor: initialMentor && mentorNames.includes(initialMentor) ? initialMentor : mentorNames[0] || "",
    mentee: initialMentee || MENTOR_INTERNS[0]?.name || "",
    category: CATEGORIES[0],
    rating: 5,
    status: "Resolved",
    summary: "",
    strengths: "Well structured pull request\nResponsive to review comments",
    improvements: "Consider adding more edge-case integration tests",
  });

  const [form, setForm] = useState(buildForm);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(buildForm());
      setError("");
      setStep(0);
    }
  }

  const isLast = step === STEPS.length - 1;

  const update = (key, value) => {
    setForm((curr) => ({ ...curr, [key]: value }));
    setError("");
  };

  const validateBefore = (upTo) => {
    if (upTo > 0 && !form.title.trim()) {
      setError("Please provide a title or topic for this feedback.");
      setStep(0);
      return false;
    }
    if (upTo > 1 && !form.summary.trim()) {
      setError("Please include a brief summary note for the intern.");
      setStep(1);
      return false;
    }
    return true;
  };

  const goTo = (target) => {
    if (target > step && !validateBefore(target)) return;
    setError("");
    setStep(target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLast) {
      goTo(step + 1);
      return;
    }
    if (!validateBefore(STEPS.length)) return;

    const mentee = MENTOR_INTERNS.find((u) => u.name === form.mentee);
    if (!mentee) {
      setError("Select the intern this feedback is for.");
      setStep(0);
      return;
    }
    try {
      const item = await mentorActions.giveFeedback({
        menteeId: mentee.apiId,
        title: form.title.trim(),
        category: form.category,
        rating: Number(form.rating),
        status: form.status,
        summary: form.summary.trim(),
        strengths: splitLines(form.strengths),
        improvements: splitLines(form.improvements),
        projectId: projects.find((p) => p.name === form.project)?.apiId ?? null,
      });
      if (onCreated) onCreated(item);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Could not send the feedback. Please try again.");
    }
  };

  const projectOptions = [...projects.map((p) => p.name), "General Mentorship"];

  return (
    <MentorModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={MessageSquarePlus}
      tone="violet"
      title="Give structured feedback"
      description="Coaching, recognition and clear next steps — visible to the intern right away."
      onSubmit={handleSubmit}
      footer={
        <>
          <span className="mr-auto hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:inline-flex">
            <UserRound className="h-3.5 w-3.5" />
            {form.mentee} · {Number(form.rating).toFixed(1)}/5
          </span>
          {step === 0 ? (
            <Button variant="unstyled"
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Cancel
            </Button>
          ) : (
            <Button variant="unstyled"
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
          <Button variant="unstyled"
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 transition duration-150 active:scale-[0.97] hover:bg-violet-700"
          >
            <span key={isLast ? "last" : "next"} className="inline-flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            {isLast ? (
              <>
                <Send className="h-4 w-4" /> Publish feedback
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
            </span>
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <WizardStepper steps={STEPS} step={step} onSelect={goTo} tone="violet" />

        <FormError>{error}</FormError>

        <StepPanel step={step} className="min-h-[270px]">
          {step === 0 && (
            <FeedbackContextStep
              form={form}
              update={update}
              mentorInterns={MENTOR_INTERNS}
              mentorNames={mentorNames}
              projectOptions={projectOptions}
              categories={CATEGORIES}
            />
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div className="space-y-3">
                <Field label="Overall rating">
                  <RatingInput value={form.rating} onChange={(v) => update("rating", v)} />
                </Field>
                <Field label="Status">
                  <SegmentedControl
                    value={form.status}
                    onChange={(v) => update("status", v)}
                    options={STATUSES}
                    className="h-11 [&>button]:h-9"
                  />
                </Field>
              </div>
              <Field label="Summary & guidance" required>
                <FormTextarea
                  rows={5}
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Overall observations and constructive guidance…"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <FeedbackTakeawaysStep form={form} update={update} />
          )}
        </StepPanel>
      </div>
    </MentorModal>
  );
}
