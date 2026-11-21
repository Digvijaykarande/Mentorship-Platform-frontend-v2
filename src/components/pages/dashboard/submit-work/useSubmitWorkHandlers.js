import { useRef, useState, useEffect } from "react";
import { uploadFile } from "@/lib/api";

/** Files already stored keep their link; newly picked files are uploaded first. */
async function buildFiles(form, existing = []) {
  const stored = new Map(existing.map((f) => [f.name, f]));
  const fresh = new Map((form.fileObjects || []).map((f) => [f.name, f]));
  const out = [];
  for (const name of form.files) {
    if (fresh.has(name)) out.push(await uploadFile(fresh.get(name)));
    else if (stored.has(name)) {
      const { name: n, url, size, mimeType, publicId } = stored.get(name);
      out.push({
        name: n,
        url,
        size: size ?? undefined,
        mimeType: mimeType || undefined,
        publicId: publicId || undefined,
      });
    }
  }
  return out;
}

export function useSubmitWorkHandlers({
  submissions,
  actions,
  router,
  resetFilters,
  setSelectedId,
  dialogSubmission,
}) {
  const [dialog, setDialog] = useState({
    open: false,
    mode: "create",
    type: "Source Code",
    submissionId: null,
    preset: null,
    key: 0,
  });
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const busy = useRef(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), toast.action ? 6000 : 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message, action) => setToast({ message, action });

  const run = async (task) => {
    if (busy.current) return undefined;
    busy.current = true;
    try {
      return await task();
    } catch (error) {
      notify(error?.message || "Something went wrong. Please try again.");
      return undefined;
    } finally {
      busy.current = false;
    }
  };

  const openDialog = (mode, submissionId = null, type = "Source Code") =>
    setDialog({ open: true, mode, type, submissionId, preset: null, key: Date.now() });

  const openNewSubmission = (type = "Source Code") => openDialog("create", null, type);
  const openEdit = (id) => {
    setSelectedId(id);
    openDialog("edit", id);
  };
  const openRevision = (id) => {
    setSelectedId(id);
    openDialog("revise", id);
  };
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const handleDialogSubmit = (form) =>
    run(async () => {
      const files = await buildFiles(form, dialogSubmission?.fileItems);
      const content = {
        title: form.title,
        type: form.type,
        link: form.link,
        notes: form.notes,
        files,
        version: form.version,
        changeNote: form.changeNote || undefined,
      };
      if (dialog.mode === "create") {
        const { submission } = await actions.createSubmission({
          ...content,
          taskId: form.taskId ?? null,
          stepId: dialog.preset?.stepId ?? null,
        });
        setSelectedId(submission.code);
        resetFilters();
        if (submission.stepId) {
          notify(
            `Sent to your mentor as ${submission.version}. The step now waits for review.`,
            {
              label: "View task",
              run: () => router.push(`/dashboard/tasks?task=${submission.task?.id}`),
            },
          );
        } else {
          notify(`Submitted as ${submission.version}`);
        }
      } else if (dialogSubmission) {
        const { submission, changed } =
          dialog.mode === "revise"
            ? await actions.reviseSubmission(dialogSubmission.id, content)
            : await actions.editSubmission(dialogSubmission.id, {
                ...content,
                taskId: form.taskId ?? null,
              });
        setSelectedId(dialogSubmission.id);
        if (!changed) notify("No changes to save");
        else
          notify(
            dialog.mode === "revise"
              ? `Revision sent as ${submission.version}`
              : `Changes saved as ${submission.version}`,
          );
      }
      closeDialog();
    });

  const requestWithdraw = (id) => {
    const target = submissions.find((s) => s.id === id);
    if (target) setConfirm({ kind: "withdraw", id, title: target.title });
  };

  const requestDelete = (id) => {
    const target = submissions.find((s) => s.id === id);
    if (target) setConfirm({ kind: "delete", id, title: target.title });
  };

  const handleRestore = (id) =>
    run(async () => {
      await actions.restoreSubmission(id);
      setSelectedId(id);
      notify("Submission restored");
    });

  const handleConfirm = () => {
    if (!confirm) return;
    const target = submissions.find((s) => s.id === confirm.id);
    const kind = confirm.kind;
    setConfirm(null);
    if (!target) return;
    run(async () => {
      if (kind === "withdraw") {
        await actions.withdrawSubmission(target.id);
        notify("Submission withdrawn", {
          label: "Undo",
          run: () => run(() => actions.restoreSubmission(target.id)),
        });
      } else {
        await actions.deleteSubmission(target.id);
        notify(`Deleted "${target.title}"`);
      }
    });
  };

  return {
    dialog,
    setDialog,
    confirm,
    setConfirm,
    toast,
    setToast,
    openNewSubmission,
    openEdit,
    openRevision,
    closeDialog,
    handleDialogSubmit,
    requestWithdraw,
    requestDelete,
    handleRestore,
    handleConfirm,
  };
}
