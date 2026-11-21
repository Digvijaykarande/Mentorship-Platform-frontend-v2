"use client";

import { useState } from "react";
import {
  UserCheck,
  BadgeCheck,
  MessageSquareText,
  Quote,
  Clock,
  Video,
} from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScheduleMeetingDialog from "./ScheduleMeetingDialog";
import RequestReviewDialog from "./RequestReviewDialog";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";
import { getInitials } from "./projectHelpers";

const FALLBACK_QUOTE = "No mentor feedback on this project yet. It will appear here after your first review.";

export default function ProjectMentorCard({ project }) {
  const { actions } = useWorkspace();
  const mentor = project?.mentorInfo ?? null;
  const feedback = project?.mentorFeedback;
  const initials = getInitials(mentor?.name);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    topic: "",
  });
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const handleScheduleSubmit = async () => {
    if (!scheduleForm.date || !scheduleForm.time || !project) return;
    setScheduleError("");
    try {
      await actions.scheduleMeeting(project.id, {
        date: scheduleForm.date,
        timeSlot: scheduleForm.time,
        agenda: scheduleForm.topic,
      });
    } catch (error) {
      setScheduleError(error.message);
      return;
    }
    setScheduleSuccess(true);
    setTimeout(() => {
      setScheduleSuccess(false);
      setIsScheduleOpen(false);
      setScheduleForm({ date: "", time: "", topic: "" });
    }, 1800);
  };

  const handleReviewSubmit = async () => {
    if (!reviewNote.trim() || !project) return;
    setReviewError("");
    try {
      await actions.requestReview(project.id, reviewNote.trim());
    } catch (error) {
      setReviewError(error.message);
      return;
    }
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setIsReviewOpen(false);
      setReviewNote("");
    }, 1800);
  };

  // Optional mentor fields: rendered only when present in projectsData
  const expertise = mentor?.expertise?.slice(0, 3) ?? [];
  const responseTime = mentor?.responseTime;

  return (
    <>
      <SectionCard
        icon={UserCheck}
        title="Assigned Supervisor & Mentor"
        description="Direct project guidance & feedback"
        iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
        contentClassName="space-y-3 p-3.5"
      >
        {/* Mentor profile */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-primary-100 dark:ring-primary-900/50">
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-violet-600 text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            {mentor?.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                {mentor?.name || "Assigned Mentor"}
              </h4>
              {mentor?.verified && (
                <BadgeCheck
                  className="h-4 w-4 shrink-0 fill-primary-600 text-white dark:fill-primary-500"
                  title="Verified Supervisor"
                />
              )}
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {mentor?.title}
            </p>
          </div>

          {mentor?.online && (
            <Badge className="shrink-0 gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Available
            </Badge>
          )}
        </div>

        {(expertise.length > 0 || responseTime) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {expertise.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
            {responseTime && (
              <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                Replies in {responseTime}
              </span>
            )}
          </div>
        )}

        {/* Latest feedback */}
        <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/70 py-2.5 pl-4 pr-3 dark:border-slate-800 dark:bg-slate-900/40">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-500 to-violet-500"
          />
          <Quote
            aria-hidden
            className="absolute right-2 top-2 h-6 w-6 rotate-180 text-primary-100 dark:text-primary-500/10"
          />
          <div className="relative flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {feedback?.label || "Latest Mentor Feedback"}
            </span>
            <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
              {feedback?.timeAgo || "Recently"}
            </span>
          </div>
          <p className="relative mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {feedback?.quote || FALLBACK_QUOTE}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="h-9 w-full gap-2 bg-gradient-to-r from-primary-600 to-violet-600 font-semibold text-white shadow-sm shadow-primary-500/20 transition hover:from-primary-500 hover:to-violet-500"
          >
            <Video className="h-4 w-4" />
            Schedule 1-on-1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsReviewOpen(true)}
            className="h-9 w-full gap-2 border-slate-200 font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
          >
            <MessageSquareText className="h-4 w-4" />
            Request Review
          </Button>
        </div>
      </SectionCard>

      <ScheduleMeetingDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        mentorName={mentor?.name || "your supervisor"}
        form={scheduleForm}
        onFormChange={(key, val) =>
          setScheduleForm((prev) => ({ ...prev, [key]: val }))
        }
        onSubmit={handleScheduleSubmit}
        success={scheduleSuccess}
        error={scheduleError}
      />
      <RequestReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        mentorName={mentor?.name || "your supervisor"}
        note={reviewNote}
        onNoteChange={setReviewNote}
        onSubmit={handleReviewSubmit}
        success={reviewSuccess}
        error={reviewError}
      />
    </>
  );
}