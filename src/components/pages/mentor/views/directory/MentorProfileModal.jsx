import { Clock, Gauge, Mail, MessageSquarePlus, Star, Users } from "lucide-react";
import {
  MentorModal,
  ModalButton,
  InfoTile,
  DetailSection,
} from "../../MentorModal";
import { MentorAvatar, MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import {
  MENTOR_AVATAR,
  capacityTone,
  parseCapacity,
  progressTone,
} from "./mentorDirectoryUtils";

export default function MentorProfileModal({
  selectedMentor,
  shownMentor,
  onClose,
  mentorInterns,
  onGiveFeedback,
}) {
  const capacity = shownMentor ? parseCapacity(shownMentor.capacity) : { used: 0, total: 0 };
  const capacityPct = capacity.total ? Math.round((capacity.used / capacity.total) * 100) : 0;

  return (
    <MentorModal
      open={Boolean(selectedMentor)}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      tone="violet"
      leading={
        shownMentor && (
          <MentorAvatar
            name={shownMentor.name}
            tone={MENTOR_AVATAR}
            className="h-14 w-14 text-base shadow-lg shadow-violet-500/30 ring-4 ring-white dark:ring-slate-900"
          />
        )
      }
      badges={shownMentor && <MentorStatusBadge status={shownMentor.status} />}
      title={shownMentor?.name}
      description={shownMentor?.specialty}
      footer={
        shownMentor && (
          <>
            <ModalButton variant="secondary" onClick={onClose}>
              Close
            </ModalButton>
            <ModalButton
              variant="secondary"
              onClick={() => {
                window.location.href = `mailto:${shownMentor.email}`;
              }}
            >
              <Mail className="h-4 w-4" /> Email
            </ModalButton>
            {onGiveFeedback && (
              <ModalButton
                tone="violet"
                onClick={() => {
                  const name = shownMentor.name;
                  onClose();
                  onGiveFeedback(name);
                }}
              >
                <MessageSquarePlus className="h-4 w-4" /> Give feedback
              </ModalButton>
            )}
          </>
        )
      }
    >
      {shownMentor && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <InfoTile icon={Users} label="Interns" value={shownMentor.interns} />
            <InfoTile
              icon={Star}
              label="Rating"
              value={
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-secondary-400 text-secondary-400" />
                  {shownMentor.rating}
                </span>
              }
            />
            <InfoTile icon={Clock} label="Last active" value={shownMentor.lastActive} />
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Gauge className="h-4 w-4 text-slate-400" /> Mentoring capacity
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {shownMentor.capacity} · {capacityPct}%
              </span>
            </div>
            <div className="mt-3">
              <MentorProgressBar value={capacityPct} tone={capacityTone(capacityPct)} />
            </div>
            <a
              href={`mailto:${shownMentor.email}`}
              className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-primary-600 dark:text-slate-400"
            >
              <Mail className="h-3.5 w-3.5" /> {shownMentor.email}
            </a>
          </div>

          <DetailSection title="Assigned interns" count={mentorInterns.length}>
            {mentorInterns.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {mentorInterns.map((intern) => (
                  <div
                    key={intern.id}
                    className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <MentorAvatar name={intern.name} className="h-8 w-8 text-[10px]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                          {intern.name}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">{intern.team}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {intern.progress}%
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <MentorProgressBar value={intern.progress} tone={progressTone(intern.progress)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                No interns assigned yet.
              </p>
            )}
          </DetailSection>
        </div>
      )}
    </MentorModal>
  );
}
