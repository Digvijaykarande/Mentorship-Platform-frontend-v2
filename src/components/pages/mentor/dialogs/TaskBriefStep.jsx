import { FileText, Link2 } from "lucide-react";
import { Field, FormInput, FormTextarea } from "../MentorForm";
import AttachmentPicker from "@/components/common/AttachmentPicker";

export default function TaskBriefStep({ form, update, busy }) {
  return (
    <div className="space-y-3">
      <Field label="Instructions" hint="Optional">
        <FormTextarea
          rows={5}
          value={form.instructions}
          onChange={(e) => update("instructions", e.target.value)}
          placeholder="What should be delivered and how it's judged — acceptance criteria, constraints…"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Reference name" hint="Optional">
          <FormInput
            icon={FileText}
            value={form.resourceName}
            onChange={(e) => update("resourceName", e.target.value)}
            placeholder="e.g. RFC doc or API specs"
          />
        </Field>
        <Field label="Reference URL" hint="Optional">
          <FormInput
            icon={Link2}
            type="url"
            value={form.resourceUrl}
            onChange={(e) => update("resourceUrl", e.target.value)}
            placeholder="https://…"
          />
        </Field>
      </div>
      <Field label="Attach files or links" hint="Images, PDFs, docs — optional">
        <AttachmentPicker
          compact
          items={form.attachments}
          onChange={(items) => update("attachments", items)}
          disabled={busy}
        />
      </Field>
    </div>
  );
}
