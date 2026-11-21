"use client";

import { useState } from "react";
import { Send, Save, RefreshCcw } from "lucide-react";
import { NO_TASK, getTypeMeta, resolveType } from "./constants";
import {
  INITIAL_VERSION,
  bumpVersion,
  compareVersions,
  diffForm,
  isValidVersion,
  normalizeVersion,
  toFormValues,
} from "./submissionLogic";

export const MODE_COPY = {
  create: {
    title: "Submit work",
    description: "Send your work to your mentor for feedback.",
    action: "Submit",
    icon: Send,
  },
  edit: {
    title: "Edit submission",
    description: "Update your work while it is waiting for review.",
    action: "Save changes",
    icon: Save,
  },
  revise: {
    title: "Submit revision",
    description: "Fix what your mentor asked for and send the next version.",
    action: "Submit revision",
    icon: RefreshCcw,
  },
};

export function useSubmissionDialogState({
  mode,
  submission,
  initialType,
  tasks,
  presetTaskId,
  presetTitle,
  context,
  onSubmit,
}) {
  const [base] = useState(() =>
    submission
      ? {
          values: toFormValues(submission),
          version: submission.version,
          feedback: submission.feedback,
        }
      : null,
  );
  const initial = base?.values ?? null;
  const copy = MODE_COPY[mode] ?? MODE_COPY.create;

  const taskOptions =
    initial?.taskTitle && !tasks.some((t) => t.title === initial.taskTitle)
      ? [{ id: "__current", title: initial.taskTitle }, ...tasks]
      : tasks;

  const [title, setTitle] = useState(initial?.title ?? presetTitle ?? "");
  const [type, setType] = useState(resolveType(initial?.type ?? initialType));
  const [taskId, setTaskId] = useState(() => {
    const wanted = submission?.taskId ?? presetTaskId;
    if (wanted != null) {
      const byId = taskOptions.find((t) => String(t.id) === String(wanted));
      if (byId) return String(byId.id);
    }
    const match = taskOptions.find((t) => t.title === initial?.taskTitle);
    return match ? String(match.id) : NO_TASK;
  });
  const taskLocked = Boolean(context) || (mode !== "create" && submission?.taskId != null);
  const [link, setLink] = useState(initial?.link ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [changeNote, setChangeNote] = useState("");
  const [files, setFiles] = useState(() =>
    (initial?.files ?? []).map((name) => ({ name })),
  );
  const [versionInput, setVersionInput] = useState(null);
  const [error, setError] = useState("");

  const activeType = getTypeMeta(type);
  const projectName = taskOptions.find((t) => String(t.id) === taskId)?.project || "";
  const pastVersions = submission?.versions ?? [];

  const currentValues = () => {
    const task = taskOptions.find((t) => String(t.id) === taskId);
    return {
      title: title.trim(),
      type,
      taskId: task && task.id !== "__current" ? task.id : null,
      taskTitle: task ? task.title : "",
      link: link.trim(),
      notes: notes.trim(),
      files: files.map((f) => f.name),
      fileObjects: files.filter((f) => f.file).map((f) => f.file),
    };
  };

  const diff = initial ? diffForm(initial, currentValues()) : null;
  let nextVersion = INITIAL_VERSION;
  if (mode === "revise") nextVersion = bumpVersion(base.version, "major");
  if (mode === "edit") {
    nextVersion = diff?.kind ? bumpVersion(base.version, diff.kind) : null;
  }
  const noChanges = mode === "edit" && !diff?.kind;

  const versionText = versionInput ?? nextVersion ?? "";
  const versionValid = isValidVersion(versionText);
  const finalVersion = versionValid ? normalizeVersion(versionText) : null;
  const versionTooLow =
    versionValid && base?.version && compareVersions(finalVersion, base.version) <= 0;
  const versionError = !versionValid
    ? "Use the format v1.0.0"
    : versionTooLow
      ? `Must be higher than ${base.version}`
      : "";

  const clearError = () => {
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = currentValues();
    if (!values.title) {
      setError("Please add a title.");
      return;
    }
    if (!values.files.length && !values.link) {
      setError("Add at least one file or a link.");
      return;
    }
    if (mode === "revise" && !changeNote.trim()) {
      setError("Tell your mentor what you changed in this version.");
      return;
    }
    if (noChanges) {
      setError("Nothing has changed yet.");
      return;
    }
    if (versionError) {
      setError(`Version: ${versionError}.`);
      return;
    }
    onSubmit({ ...values, changeNote: changeNote.trim(), version: finalVersion });
  };

  return {
    base,
    copy,
    taskOptions,
    title,
    setTitle,
    type,
    setType,
    taskId,
    setTaskId,
    taskLocked,
    link,
    setLink,
    notes,
    setNotes,
    changeNote,
    setChangeNote,
    files,
    setFiles,
    versionInput,
    setVersionInput,
    error,
    setError,
    clearError,
    activeType,
    projectName,
    pastVersions,
    noChanges,
    versionText,
    finalVersion,
    versionError,
    handleSubmit,
  };
}
