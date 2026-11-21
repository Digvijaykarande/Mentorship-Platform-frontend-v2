import {
  AlertCircle,
  BookOpenText,
  BriefcaseBusiness,
  Calendar,
  ListTodo,
  Paperclip,
  Plus,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MentorModal,
  ModalButton,
  InfoTile,
  DetailSection,
  Chip,
} from "../../MentorModal";
import { MentorProgressBar, MentorStatusBadge, EmptyState } from "../../MentorCommon";
import AttachmentList from "@/components/common/AttachmentList";
import { formatBytes } from "@/lib/attachments";

export default function ProjectDetailModal({
  selectedProject,
  dialog,
  onClose,
  shownProject,
  onAddTask,
  projectTasks,
  projectDocs,
  projectResources,
  setDialog,
  removeDoc,
  removeResource,
}) {
  return (
    <MentorModal
      open={Boolean(selectedProject) && !dialog}
      onOpenChange={(open) => !open && onClose()}
      size="xl"
      compact
      icon={BriefcaseBusiness}
      tone="indigo"
      badges={
        shownProject && (
          <>
            <MentorStatusBadge status={shownProject.status} />
            {shownProject.priority && <Chip>{shownProject.priority} priority</Chip>}
            {shownProject.due && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Calendar className="h-3 w-3" /> {shownProject.due}
              </span>
            )}
          </>
        )
      }
      title={shownProject?.name}
      description={
        shownProject && `${shownProject.cohort} · Mentor ${shownProject.mentor || shownProject.owner}`
      }
      footer={
        shownProject && (
          <>
            <ModalButton variant="secondary" onClick={onClose}>
              Close
            </ModalButton>
            {onAddTask && (
              <ModalButton
                onClick={() => {
                  const proj = shownProject;
                  onClose();
                  onAddTask(proj);
                }}
              >
                <Plus className="h-4 w-4" /> Add task
              </ModalButton>
            )}
          </>
        )
      }
    >
      {shownProject && (
        <div className="space-y-3.5">
          <p className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
            {shownProject.description || "No project brief provided yet."}
          </p>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <InfoTile icon={Users} label="Interns" className="rounded-xl p-2.5">
              <span className="line-clamp-2 text-[13px]">
                {(shownProject.assignees || []).join(", ") || "None"}
              </span>
            </InfoTile>
            <InfoTile icon={UserCheck} label="Mentor" className="rounded-xl p-2.5" value={shownProject.mentor || shownProject.owner} />
            <InfoTile icon={ListTodo} label="Tasks" className="rounded-xl p-2.5" value={projectTasks.length} />
            <InfoTile icon={AlertCircle} label="Health" className="rounded-xl p-2.5">
              <span
                className={
                  shownProject.risk === "On track"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-secondary-600 dark:text-secondary-400"
                }
              >
                {shownProject.risk || "On track"}
              </span>
            </InfoTile>
          </div>

          <div className="rounded-xl border border-slate-200/80 px-3.5 py-2.5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Overall progress
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {shownProject.progress || 0}%
              </span>
            </div>
            <div className="mt-2">
              <MentorProgressBar
                value={shownProject.progress}
                tone={
                  shownProject.progress > 80
                    ? "bg-emerald-500"
                    : shownProject.progress < 50
                    ? "bg-rose-500"
                    : "bg-primary-500"
                }
              />
            </div>
          </div>

          <DetailSection title="Tasks in this workstream" count={projectTasks.length} className="space-y-2">
            {projectTasks.length > 0 ? (
              <div className="grid gap-1.5 sm:grid-cols-2">
                {projectTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                          {task.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {task.mentee} · Due {task.due}
                        </p>
                      </div>
                      <MentorStatusBadge status={task.status} />
                    </div>
                    <div className="mt-2">
                      <MentorProgressBar
                        value={
                          task.subtasks?.length
                            ? (task.subtasks.filter((s) => s.done && s.approved).length /
                                task.subtasks.length) *
                              100
                            : 0
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ListTodo}
                title="No tasks assigned yet"
                description="Assign the first task to start intern work."
              />
            )}
          </DetailSection>

          <DetailSection
            title="Documentation shared with interns"
            count={projectDocs.length}
            className="space-y-2"
            action={
              <Button variant="unstyled"
                type="button"
                onClick={() => setDialog("doc")}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300"
              >
                <Plus className="h-3.5 w-3.5" /> Share documentation
              </Button>
            }
          >
            {projectDocs.length > 0 ? (
              <div className="space-y-2">
                {projectDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                          <BookOpenText className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                          <span className="truncate">{doc.title}</span>
                        </p>
                        {doc.addedBy && <p className="mt-0.5 text-[10px] text-slate-400">Shared by {doc.addedBy}</p>}
                      </div>
                      <Button variant="unstyled"
                        type="button"
                        aria-label={`Delete ${doc.title}`}
                        onClick={() => removeDoc(doc)}
                        className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {Array.isArray(doc.content) && doc.content.length > 0 && typeof doc.content[0] === "string" && (
                      <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {doc.content.join("\n\n")}
                      </p>
                    )}
                    <AttachmentList items={doc.attachments} className="mt-2.5" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                Nothing shared yet. Interns see documentation here once you share it.
              </p>
            )}
          </DetailSection>

          <DetailSection
            title="Resources & Specs"
            count={projectResources.length}
            className="space-y-2"
            action={
              <Button variant="unstyled"
                type="button"
                onClick={() => setDialog("resource")}
                className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300"
              >
                <Paperclip className="h-3.5 w-3.5" /> Add file / link
              </Button>
            }
          >
            {projectResources.length > 0 ? (
              <AttachmentList
                items={projectResources.map((r) => ({
                  ...r,
                  kind: r.kind || (r.url ? "link" : "file"),
                  sub: [
                    r.uploaderName
                      ? `${r.uploaderName}${r.uploaderRole === "intern" ? " (intern)" : ""}`
                      : "Reference",
                    r.size ? formatBytes(r.size) : null,
                  ]
                    .filter(Boolean)
                    .join(" · "),
                }))}
                onRemove={removeResource}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                No resources attached. Files interns upload to this project appear here too.
              </p>
            )}
          </DetailSection>
        </div>
      )}
    </MentorModal>
  );
}
