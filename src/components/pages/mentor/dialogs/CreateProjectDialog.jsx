"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  FolderPlus,
  Send,
  Users,
} from "lucide-react";
import { useMentorActions, useMentorSnapshot } from "../MentorProvider";
import { Field, FormError, FormInput, FormTextarea, SegmentedControl } from "../MentorForm";
import { StepPanel, WizardStepper } from "../MentorWizard";
import { MentorModal } from "../MentorModal";
import { resolveAttachments } from "@/lib/api";
import ProjectTimelineStep from "./ProjectTimelineStep";
import ProjectInternsStep from "./ProjectInternsStep";

const PRIORITIES = [
  { value: "High", label: "High", tone: "rose" },
  { value: "Medium", label: "Medium", tone: "amber" },
  { value: "Low", label: "Low", tone: "emerald" },
];

const STEPS = [
  { id: "details", label: "Details", icon: FileText },
  { id: "timeline", label: "Timeline", icon: CalendarDays },
  { id: "interns", label: "Interns", icon: Users },
];

const emptyForm = () => ({
  name: "",
  description: "",
  due: "",
  priority: "Medium",
  resourceName: "",
  resourceUrl: "",
  attachments: [],
});

export default function CreateProjectDialog({ open, onOpenChange, onCreated }) {
  const { interns: MENTOR_INTERNS } = useMentorSnapshot();
  const mentorActions = useMentorActions();
  const defaultAssignees = () => (MENTOR_INTERNS[0] ? [MENTOR_INTERNS[0].name] : []);
  const [form, setForm] = useState(emptyForm);
  const [assignees, setAssignees] = useState(defaultAssignees);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);

  const eligible = useMemo(() => MENTOR_INTERNS.filter((u) => u.status !== "Completed" && u.isActive), [MENTOR_INTERNS]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eligible;
    return eligible.filter(
      (u) => u.name.toLowerCase().includes(q) || (u.team || "").toLowerCase().includes(q)
    );
  }, [eligible, query]);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(emptyForm());
      setAssignees(defaultAssignees());
      setError("");
      setStep(0);
      setQuery("");
    }
  }

  const isLast = step === STEPS.length - 1;
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((u) => assignees.includes(u.name));

  const update = (key, value) => {
    setForm((curr) => ({ ...curr, [key]: value }));
    setError("");
  };

  const toggleAssignee = (name) => {
    setAssignees((curr) =>
      curr.includes(name) ? curr.filter((n) => n !== name) : [...curr, name]
    );
    setError("");
  };

  const toggleAllFiltered = () => {
    const names = filtered.map((u) => u.name);
    setAssignees((curr) =>
      allFilteredSelected
        ? curr.filter((n) => !names.includes(n))
        : Array.from(new Set([...curr, ...names]))
    );
  };

  const validate = (index) => {
    if (index >= 0 && !form.name.trim()) {
      setError("Please add a project name to continue.");
      setStep(0);
      return false;
    }
    if (index >= 2 && !assignees.length) {
      setError("Select at least one intern so the project has an owner.");
      return false;
    }
    return true;
  };

  const goTo = (target) => {
    if (target > step && !validate(Math.min(target - 1, 0))) return;
    setError("");
    setStep(target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLast) {
      goTo(step + 1);
      return;
    }
    if (!validate(2)) return;

    const assigneeIds = assignees
      .map((name) => MENTOR_INTERNS.find((u) => u.name === name)?.apiId)
      .filter(Boolean);
    setBusy(true);
    try {
      const uploaded = await resolveAttachments(form.attachments);
      const created = await mentorActions.createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        dueDate: form.due || null,
        priority: form.priority,
        assigneeIds,
        ...(form.resourceName.trim() && {
          resource: { name: form.resourceName.trim(), ...(form.resourceUrl.trim() && { url: form.resourceUrl.trim() }) },
        }),
        ...(uploaded.length && { resources: uploaded }),
      });
      if (onCreated) onCreated(created);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Could not create the project. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MentorModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      icon={FolderPlus}
      tone="indigo"
      title="Create project"
      description="Brief, deadline and owners. Shows on assigned interns' dashboards instantly."
      onSubmit={handleSubmit}
      footer={
        <>
          <span className="mr-auto hidden text-xs font-medium text-slate-400 sm:inline">
            {assignees.length} intern{assignees.length === 1 ? "" : "s"} selected
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
                <Send className="h-4 w-4" /> {busy ? "Uploading…" : "Assign project"}
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

        <StepPanel step={step} className="min-h-[250px] max-h-[56vh] overflow-y-auto pr-1">
          {step === 0 && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Field label="Project name" required>
                  <FormInput
                    autoFocus
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Partner Analytics Dashboard"
                  />
                </Field>
                <Field label="Priority" className="sm:w-60">
                  <SegmentedControl
                    value={form.priority}
                    onChange={(v) => update("priority", v)}
                    options={PRIORITIES}
                  />
                </Field>
              </div>
              <Field label="Brief & expectations" hint="Optional">
                <FormTextarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Expected outcome, definition of done and any constraints…"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <ProjectTimelineStep form={form} update={update} busy={busy} />
          )}

          {step === 2 && (
            <ProjectInternsStep
              query={query}
              setQuery={setQuery}
              filtered={filtered}
              assignees={assignees}
              allFilteredSelected={allFilteredSelected}
              toggleAllFiltered={toggleAllFiltered}
              toggleAssignee={toggleAssignee}
            />
          )}
        </StepPanel>
      </div>
    </MentorModal>
  );
}
