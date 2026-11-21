import { Folder, Tag, UserCheck, UserRound } from "lucide-react";
import { Field, FormInput, FormSelect } from "../MentorForm";

export default function FeedbackContextStep({
  form,
  update,
  mentorInterns,
  mentorNames,
  projectOptions,
  categories,
}) {
  return (
    <div className="space-y-3">
      <Field label="Feedback subject / milestone" required>
        <FormInput
          autoFocus
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Sprint 3 code quality & testing review"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Intern">
          <FormSelect
            icon={UserRound}
            value={form.mentee}
            onValueChange={(v) => update("mentee", v)}
            options={mentorInterns.map((u) => ({
              value: u.name,
              label: u.name,
              meta: u.team,
            }))}
          />
        </Field>
        <Field label="Mentor reviewer">
          <FormSelect
            icon={UserCheck}
            value={form.mentor}
            onValueChange={(v) => update("mentor", v)}
            options={mentorNames}
          />
        </Field>
        <Field label="Workstream">
          <FormSelect
            icon={Folder}
            value={form.project}
            onValueChange={(v) => update("project", v)}
            options={projectOptions}
          />
        </Field>
        <Field label="Category">
          <FormSelect
            icon={Tag}
            value={form.category}
            onValueChange={(v) => update("category", v)}
            options={categories}
          />
        </Field>
      </div>
    </div>
  );
}
