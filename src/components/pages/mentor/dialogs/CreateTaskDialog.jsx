"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FileText,
  ListOrdered,
  PlusCircle,
  Type,
} from "lucide-react";
import { useMentorActions, useMentorSnapshot } from "../MentorProvider";
import { FormError, ListEditor } from "../MentorForm";
import { Reveal } from "../MentorMotion";
import { StepPanel, WizardStepper } from "../MentorWizard";
import { MentorModal } from "../MentorModal";
import { resolveAttachments } from "@/lib/api";
import TaskBasicsStep from "./TaskBasicsStep";
import TaskBriefStep from "./TaskBriefStep";

const PRIORITIES = [
  { value: "High", label: "High", tone: "rose" },
  { value: "Medium", label: "Medium", tone: "amber" },
  { value: "Low", label: "Low", tone: "emerald" },
];

const DEFAULT_STEPS = [
  "Reproduce the issue & inspect requirements",
  "Implement core changes",
  "Write tests & verify",
  "Submit PR and evidence for mentor review",
].join("\n");

const STEPS = [
  { id: "basics", label: "Basics", icon: Type },
  { id: "brief", label: "Brief", icon: FileText },
  { id: "steps", label: "Steps", icon: ListOrdered },
];

export default function CreateTaskDialog({
  open,
  onOpenChange,
  projects = [],
  onCreated,
  initialAssignee,
  initialProject,
}) {
  const { interns: MENTOR_INTERNS } = useMentorSnapshot();
  const mentorActions = useMentorActions();
  const buildForm = () => {
    const defaultProj = initialProject
      ? projects.find((p) => p.name === initialProject || p.id === initialProject)
      : projects[0];
    return {
      title: "",
      project: defaultProj?.name || initialProject || "",
      projectId: defaultProj?.id || "",
      assignee: initialAssignee || MENTOR_INTERNS[0]?.name || "",
      due: "",
      priority: "Medium",
      instructions: "",
      steps: DEFAULT_STEPS,
      resourceName: "",
      resourceUrl: "",
      attachments: [],
    };
  };

  const [form, setForm] = useState(buildForm);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
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
  const stepCount = form.steps.split("\n").filter((s) => s.trim()).length;

  const update = (key, value) => {
    setForm((curr) => ({ ...curr, [key]: value }));
    setError("");
  };

  const handleProjectSelect = (projectName) => {
    const matched = projects.find((p) => p.name === projectName);
    setForm((curr) => ({ ...curr, project: projectName, projectId: matched?.id || "" }));
  };

  const projectOptions = projects.map((p) => p.name);

  const titleOk = () => {
    if (form.title.trim()) return true;
    setError("Please provide a task title so the intern has a clear goal.");
    setStep(0);
    return false;
  };

  const goTo = (target) => {
    if (target > step && !titleOk()) return;
    setError("");
    setStep(target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLast) {
      goTo(step + 1);
      return;
    }
    if (!titleOk()) return;
    if (!stepCount) {
      setError("Add at least one ordered step; the intern submits each step sequentially.");
      return;
    }
    const intern = MENTOR_INTERNS.find((u) => u.name === form.assignee);
    if (!intern) {
      setError("Select the intern this task is for.");
      setStep(0);
      return;
    }

    setBusy(true);
    try {
      const uploaded = await resolveAttachments(form.attachments);
      const task = await mentorActions.createTask({
        title: form.title.trim(),
        projectId: form.projectId || null,
        assigneeIds: [intern.apiId],
        instructions: form.instructions.trim(),
        priority: form.priority,
        dueDate: form.due || null,
        steps: form.steps.split("\n").map((line) => line.trim()).filter(Boolean),
        ...(form.resourceName.trim() && form.resourceUrl.trim() && {
          resource: { name: form.resourceName.trim(), url: form.resourceUrl.trim() },
        }),
        ...(uploaded.length && { resources: uploaded }),
      });
      if (onCreated) onCreated(task);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Could not create the task. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MentorModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={ClipboardList}
      tone="indigo"
      title="Assign new task"
      description="Ordered steps — each unlocks after the mentor approves the previous one."
      onSubmit={handleSubmit}
      footer={
        <>
          <span className="mr-auto hidden text-xs font-medium text-slate-400 sm:inline">
            {stepCount} step{stepCount === 1 ? "" : "s"} · {form.assignee}
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
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-500/30 transition duration-150 active:scale-[0.97] hover:bg-primary-700 disabled:opacity-60"
          >
            <span key={isLast ? "last" : "next"} className="inline-flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            {isLast ? (
              <>
                <PlusCircle className="h-4 w-4" /> {busy ? "Uploading…" : "Assign task"}
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
        <WizardStepper steps={STEPS} step={step} onSelect={goTo} tone="indigo" />

        <FormError>{error}</FormError>

        <StepPanel step={step} className="min-h-[270px] max-h-[56vh] overflow-y-auto pr-1">
          {step === 0 && (
            <TaskBasicsStep
              form={form}
              update={update}
              handleProjectSelect={handleProjectSelect}
              projectOptions={projectOptions}
              mentorInterns={MENTOR_INTERNS}
              priorities={PRIORITIES}
            />
          )}

          {step === 1 && (
            <TaskBriefStep form={form} update={update} busy={busy} />
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Reveal as="p" className="text-xs text-slate-500 dark:text-slate-400">
                Press Enter to add the next step.
              </Reveal>
              <Reveal className="max-h-[230px] overflow-y-auto pr-1">
                <ListEditor
                  value={form.steps}
                  onChange={(v) => update("steps", v)}
                  placeholder="Describe this step"
                  addLabel="Add step"
                />
              </Reveal>
            </div>
          )}
        </StepPanel>
      </div>
    </MentorModal>
  );
}
