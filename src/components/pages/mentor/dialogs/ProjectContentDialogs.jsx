"use client";

import { useState } from "react";
import { BookOpenText, Loader2, Paperclip, Send } from "lucide-react";
import { useMentorActions } from "../MentorProvider";
import { Field, FormError, FormInput, FormTextarea } from "../MentorForm";
import { MentorModal, ModalButton } from "../MentorModal";
import AttachmentPicker from "@/components/common/AttachmentPicker";
import { resolveAttachments } from "@/lib/api";

/** Shared submit flow: upload files, call the action, close on success, show the error otherwise. */
function useSubmit(run, onDone) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await run();
      onDone();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, setError, submit };
}

/** Mentor shares a documentation entry (notes + files + links) with every intern on the project. */
export function ShareDocumentationDialog({ open, onOpenChange, project }) {
  const actions = useMentorActions();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [wasOpen, setWasOpen] = useState(open);

  const flow = useSubmit(
    async () => {
      if (!title.trim()) throw new Error("Give the document a title.");
      if (!notes.trim() && !items.length) throw new Error("Write some notes or attach a file or link.");
      const attachments = await resolveAttachments(items);
      await actions.addDocumentation(project.id, { title: title.trim(), notes: notes.trim(), attachments });
    },
    () => onOpenChange(false),
  );

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTitle("");
      setNotes("");
      setItems([]);
      flow.setError("");
    }
  }

  return (
    <MentorModal
      open={open}
      onOpenChange={(next) => !flow.busy && onOpenChange(next)}
      size="lg"
      icon={BookOpenText}
      tone="indigo"
      title="Share documentation"
      description={project ? `Visible to every intern on ${project.name}.` : undefined}
      onSubmit={flow.submit}
      footer={
        <>
          <ModalButton variant="secondary" type="button" disabled={flow.busy} onClick={() => onOpenChange(false)}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" disabled={flow.busy}>
            {flow.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {flow.busy ? "Sharing…" : "Share with interns"}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-3">
        <FormError>{flow.error}</FormError>
        <Field label="Title" required>
          <FormInput
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. API contract & environment setup"
          />
        </Field>
        <Field label="Notes" hint="Optional · leave a blank line between paragraphs">
          <FormTextarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Requirements, how to run the project, links to read first…"
          />
        </Field>
        <Field label="Files & links" hint="Images, PDFs, docs, URLs">
          <AttachmentPicker items={items} onChange={setItems} disabled={flow.busy} />
        </Field>
      </div>
    </MentorModal>
  );
}

/** Mentor adds files / links to the project's "Resources & Specs". */
export function AddResourceDialog({ open, onOpenChange, project }) {
  const actions = useMentorActions();
  const [items, setItems] = useState([]);
  const [wasOpen, setWasOpen] = useState(open);

  const flow = useSubmit(
    async () => {
      if (!items.length) throw new Error("Choose a file or add a link first.");
      const uploaded = await resolveAttachments(items);
      await actions.addResources(project.id, uploaded);
    },
    () => onOpenChange(false),
  );

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setItems([]);
      flow.setError("");
    }
  }

  return (
    <MentorModal
      open={open}
      onOpenChange={(next) => !flow.busy && onOpenChange(next)}
      size="md"
      icon={Paperclip}
      tone="indigo"
      title="Add resources & specs"
      description={project ? `Shared in ${project.name}.` : undefined}
      onSubmit={flow.submit}
      footer={
        <>
          <ModalButton variant="secondary" type="button" disabled={flow.busy} onClick={() => onOpenChange(false)}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" disabled={flow.busy || !items.length}>
            {flow.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            {flow.busy ? "Uploading…" : "Add to project"}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-3">
        <FormError>{flow.error}</FormError>
        <AttachmentPicker items={items} onChange={setItems} disabled={flow.busy} />
      </div>
    </MentorModal>
  );
}
