"use client";

import { useState } from "react";
import { Paperclip, UploadCloud, CheckCircle2 } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import ResourceRow from "./ResourceRow";
import UploadResourceDialog from "./UploadResourceDialog";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { resolveAttachments } from "@/lib/api";

const uploaded_count = (list) => (list.length === 1 ? "1 item" : `${list.length} items`);

export default function ProjectResourcesPanel({ project }) {
  const { actions } = useWorkspace();
  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "picture_as_pdf" });
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const resetDialog = () => {
    setIsUploadOpen(false);
    setItems([]);
    setUploadError("");
    setForm({ name: "", category: "picture_as_pdf" });
  };
  // Ignore close requests while an upload is running so a half-finished upload is not abandoned.
  const closeDialog = (open) => {
    if (busy) return;
    if (open) setIsUploadOpen(true);
    else resetDialog();
  };

  const handleUpload = async () => {
    if (!items.length || busy) return;
    setBusy(true);
    setUploadError("");
    try {
      const uploaded = await resolveAttachments(items);
      const title = form.name.trim();
      await actions.addResources(
        project.id,
        uploaded.map((file) => ({
          ...file,
          name: uploaded.length === 1 && title ? title : file.name,
          category: form.category,
        })),
      );
    } catch (error) {
      setUploadError(error.message || "Could not add the resource");
      setBusy(false);
      return;
    }
    setBusy(false);
    resetDialog();
    showToast(`${uploaded_count(items)} added to the project`);
  };

  const handleDelete = async (resource) => {
    try {
      await actions.removeResource(project.id, resource.id);
      showToast(`"${resource.name}" removed`);
    } catch (error) {
      showToast(error.message || "Could not remove the resource");
    }
  };

  const allResources = project.resources || [];

  return (
    <>
    <div style={{ minWidth: "65%" }}>
      <SectionCard
        icon={Paperclip}
        title="Resources & Specs"
        description={`${project.name} • Project references & program documentation`}
        iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
 className="gap-1.5 font-medium shadow-xs"
          >
            <UploadCloud className="h-4 w-4" />
            Upload Spec
          </Button>
        }
        contentClassName="space-y-4 p-5 sm:p-6"
      >
        {toastMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-500/15 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <div className="space-y-3">
          <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Project Deliverables & Assets
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {allResources.length ? (
              allResources.map((resource) => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
                  onDelete={resource.uploaderId === user?.id ? handleDelete : undefined}
                />
              ))
            ) : (
              <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900/40">
                No resources uploaded for this project yet. Click &quot;Upload
                Spec&quot; to add a file or link.
              </p>
            )}
          </div>
        </div>
      </SectionCard>
      <UploadResourceDialog
        open={isUploadOpen}
        onOpenChange={closeDialog}
        items={items}
        onItemsChange={setItems}
        busy={busy}
        error={uploadError}
        form={form}
        onFormChange={(key, val) =>
          setForm((prev) => ({ ...prev, [key]: val }))
        }
        onSubmit={handleUpload}
      />
      </div>
    </>
  );
}
