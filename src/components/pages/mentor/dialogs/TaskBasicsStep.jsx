import { Folder, UserRound } from "lucide-react";
import { Field, FormInput, FormSelect, SegmentedControl } from "../MentorForm";

export default function TaskBasicsStep({
  form,
  update,
  handleProjectSelect,
  projectOptions,
  mentorInterns,
  priorities,
}) {
  return (
    <div className="space-y-3">
      <Field label="Task title" required>
        <FormInput
          autoFocus
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Add OAuth 2.0 PKCE flow & unit tests"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Project workstream">
          <FormSelect
            icon={Folder}
            value={form.project}
            onValueChange={handleProjectSelect}
            options={projectOptions}
            placeholder="Select project"
          />
        </Field>
        <Field label="Assigned intern">
          <FormSelect
            icon={UserRound}
            value={form.assignee}
            onValueChange={(v) => update("assignee", v)}
            options={mentorInterns.map((u) => ({
              value: u.name,
              label: u.name,
              meta: u.team,
            }))}
            placeholder="Select intern"
          />
        </Field>
        <Field label="Due date" hint="Optional">
          <FormInput
            type="date"
            value={form.due}
            onChange={(e) => update("due", e.target.value)}
          />
        </Field>
        <Field label="Priority">
          <SegmentedControl
            value={form.priority}
            onChange={(v) => update("priority", v)}
            options={priorities}
          />
        </Field>
      </div>
    </div>
  );
}
