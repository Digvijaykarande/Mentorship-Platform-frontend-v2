import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Plus, UserCheck } from "lucide-react";
import {
  MentorModal,
  ModalButton,
  InfoTile,
  DetailSection,
} from "../../MentorModal";
import { MentorAvatar, MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { avatarTone } from "./internUtils";

export default function InternDetailModal({
  selectedUser,
  shownUser,
  onClose,
  internTasks,
  onAssignTask,
}) {
  return (
    <MentorModal
      open={Boolean(selectedUser)}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      tone="indigo"
      leading={
        shownUser && (
          <MentorAvatar
            name={shownUser.name}
            tone={avatarTone(shownUser.id)}
            className="h-14 w-14 text-base shadow-lg shadow-primary-500/30 ring-4 ring-white dark:ring-slate-900"
          />
        )
      }
      badges={shownUser && <MentorStatusBadge status={shownUser.status} />}
      title={shownUser?.name}
      description={shownUser?.email}
      footer={
        shownUser && (
          <>
            <ModalButton variant="secondary" onClick={onClose}>
              Close
            </ModalButton>
            <Link
              href="/mentor/tasks"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              View all tasks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {onAssignTask && (
              <ModalButton
                onClick={() => {
                  const name = shownUser.name;
                  onClose();
                  onAssignTask(name);
                }}
              >
                <Plus className="h-4 w-4" /> Assign task
              </ModalButton>
            )}
          </>
        )
      }
    >
      {shownUser && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InfoTile icon={Briefcase} label="Team track" value={shownUser.team} />
            <InfoTile icon={Calendar} label="Joined" value={shownUser.joined} />
            <InfoTile icon={UserCheck} label="Mentor" value={shownUser.mentor} />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Program progress
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {shownUser.progress}%
              </span>
            </div>
            <div className="mt-3">
              <MentorProgressBar
                value={shownUser.progress}
                tone={
                  shownUser.progress === 100
                    ? "bg-emerald-500"
                    : shownUser.progress < 40
                    ? "bg-rose-500"
                    : "bg-primary-500"
                }
              />
            </div>
          </div>

          <DetailSection title="Current tasks" count={internTasks.length}>
            {internTasks.length > 0 ? (
              <div className="space-y-2">
                {internTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 p-3 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {task.project} · Due {task.due}
                      </p>
                    </div>
                    <MentorStatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                No tasks assigned yet.
              </p>
            )}
          </DetailSection>
        </div>
      )}
    </MentorModal>
  );
}
