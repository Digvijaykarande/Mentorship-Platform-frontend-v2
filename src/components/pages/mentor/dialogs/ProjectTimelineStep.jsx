import { FileText, Link2 } from "lucide-react";
import { Field, FormInput } from "../MentorForm";
import { Reveal } from "../MentorMotion";
import AttachmentPicker from "@/components/common/AttachmentPicker";

export default function ProjectTimelineStep({ form, update, busy }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Due date" hint="Optional">
          <FormInput
            type="date"
            value={form.due}
            onChange={(e) => update("due", e.target.value)}
          />
        </Field>
        <Field label="Reference name" hint="Optional">
          <FormInput
            icon={FileText}
            value={form.resourceName}
            onChange={(e) => update("resourceName", e.target.value)}
            placeholder="Spec, Figma, PRD…"
          />
        </Field>
      </div>
      <Field label="Reference link" hint="Optional">
        <FormInput
          icon={Link2}
          type="url"
          value={form.resourceUrl}
          onChange={(e) => update("resourceUrl", e.target.value)}
          placeholder="https://…"
        />
      </Field>
      <Field label="Attach files or links" hint="Images, PDFs, docs — optional">
        <AttachmentPicker
          compact
          items={form.attachments}
          onChange={(items) => update("attachments", items)}
          disabled={busy}
        />
      </Field>
      <Reveal as="p" className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
        Everything here is optional — interns see &ldquo;No deadline&rdquo; if you skip the date.
      </Reveal>
    </div>
  );
}
