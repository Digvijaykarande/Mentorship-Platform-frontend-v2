"use client";

import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubmissionFileUpload from "./SubmissionFileUpload";
import SubmissionVersionPicker from "./SubmissionVersionPicker";
import SubmissionTypeSelector from "./SubmissionTypeSelector";
import SubmissionPreviousVersions from "./SubmissionPreviousVersions";
import SubmissionBanners from "./SubmissionBanners";
import SubmissionTaskAndLink from "./SubmissionTaskAndLink";
import SubmissionNotesInput from "./SubmissionNotesInput";
import SubmissionDialogFooter from "./SubmissionDialogFooter";
import { useSubmissionDialogState } from "./useSubmissionDialogState";

/**
 * mode: "create" | "edit" | "revise"
 * For "edit" and "revise" pass the existing `submission`.
 * The parent should give this component a fresh `key` every time it opens.
 */
export default function NewSubmissionDialog({
  open = false,
  mode = "create",
  submission = null,
  initialType = "Source Code",
  tasks = [],
  presetTaskId = null,
  presetTitle = "",
  context = null,
  onClose = () => {},
  onSubmit = () => {},
}) {
  const {
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
    versionText,
    setVersionInput,
    finalVersion,
    versionError,
    error,
    setError,
    clearError,
    activeType,
    projectName,
    pastVersions,
    noChanges,
    handleSubmit,
  } = useSubmissionDialogState({
    mode,
    submission,
    initialType,
    tasks,
    presetTaskId,
    presetTitle,
    context,
    onSubmit,
  });

  const ActionIcon = copy.icon;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 border-b px-4 pt-4 pb-3 pr-12">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{projectName || copy.description}</DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <SubmissionBanners context={context} mode={mode} base={base} />

            {mode !== "create" && (
              <SubmissionPreviousVersions pastVersions={pastVersions} />
            )}

            <div className="space-y-1.5">
              <Label htmlFor="submission-title">Title</Label>
              <Input
                id="submission-title"
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearError();
                }}
                placeholder="e.g. Authentication API"
              />
            </div>

            <SubmissionTypeSelector type={type} setType={setType} />

            <SubmissionTaskAndLink
              taskOptions={taskOptions}
              taskId={taskId}
              setTaskId={setTaskId}
              taskLocked={taskLocked}
              activeType={activeType}
              type={type}
              link={link}
              setLink={setLink}
              clearError={clearError}
            />

            <SubmissionFileUpload
              files={files}
              setFiles={setFiles}
              onError={setError}
            />

            <SubmissionNotesInput
              notes={notes}
              setNotes={setNotes}
              mode={mode}
              changeNote={changeNote}
              setChangeNote={setChangeNote}
              clearError={clearError}
            />

            {!noChanges && (
              <SubmissionVersionPicker
                base={base}
                versionText={versionText}
                setVersionInput={setVersionInput}
                finalVersion={finalVersion}
                versionError={versionError}
                clearError={clearError}
              />
            )}
          </div>

          <SubmissionDialogFooter
            noChanges={noChanges}
            base={base}
            finalVersion={finalVersion}
            versionText={versionText}
            onClose={onClose}
            ActionIcon={ActionIcon}
            actionText={copy.action}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
