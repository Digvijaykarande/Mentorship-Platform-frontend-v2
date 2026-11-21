"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { useMentorSnapshot } from "./MentorProvider";

const PAGE = "mx-auto max-w-[1500px] space-y-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5";

function PageSkeleton() {
  return (
    <div className={PAGE} aria-hidden="true">
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />
        <div className="h-3 w-80 max-w-full animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/60" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
    </div>
  );
}

// Views and dialogs are loaded on demand so each route only compiles what it renders.
const lazyView = (loader) => dynamic(loader, { loading: () => <PageSkeleton /> });

const MentorOverview = lazyView(() => import("./views/MentorOverview"));
const MentorInterns = lazyView(() => import("./views/MentorInterns"));
const MentorDirectory = lazyView(() => import("./views/MentorDirectory"));
const MentorProjects = lazyView(() => import("./views/MentorProjects"));
const MentorTasks = lazyView(() => import("./views/MentorTasks"));
const MentorSubmissions = lazyView(() => import("./views/MentorSubmissions"));
const MentorFeedback = lazyView(() => import("./views/MentorFeedback"));
const MentorSettings = lazyView(() => import("./views/MentorSettings"));

const CreateProjectDialog = dynamic(() => import("./dialogs/CreateProjectDialog"), { ssr: false });
const CreateTaskDialog = dynamic(() => import("./dialogs/CreateTaskDialog"), { ssr: false });
const ReviewSubmissionDialog = dynamic(() => import("./dialogs/ReviewSubmissionDialog"), { ssr: false });
const GiveFeedbackDialog = dynamic(() => import("./dialogs/GiveFeedbackDialog"), { ssr: false });
const RespondFeedbackDialog = dynamic(() => import("./dialogs/RespondFeedbackDialog"), { ssr: false });

export default function MentorPage({ view = "overview" }) {
  const snapshot = useMentorSnapshot();

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskAssigneePreset, setTaskAssigneePreset] = useState(null);
  const [taskProjectPreset, setTaskProjectPreset] = useState(null);

  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackMentorPreset, setFeedbackMentorPreset] = useState(null);
  const [respondingFeedback, setRespondingFeedback] = useState(null);

  // A dialog's code is only fetched the first time it is opened.
  const [loaded, setLoaded] = useState({});
  const markLoaded = (key) => setLoaded((curr) => (curr[key] ? curr : { ...curr, [key]: true }));

  // Notification toast (single timer so rapid actions don't dismiss each other early)
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (action, subject) => {
    setToastMessage(`${action}: “${subject}” is now synced with the intern dashboard.`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 4000);
  };

  const openProjectDialog = () => {
    markLoaded("project");
    setProjectDialogOpen(true);
  };

  const openTaskDialog = (assignee = null, project = null) => {
    markLoaded("task");
    setTaskAssigneePreset(typeof assignee === "string" ? assignee : null);
    setTaskProjectPreset(typeof project === "string" ? project : null);
    setTaskDialogOpen(true);
  };

  const openFeedbackDialog = (mentorName = null) => {
    markLoaded("feedback");
    setFeedbackMentorPreset(typeof mentorName === "string" ? mentorName : null);
    setFeedbackDialogOpen(true);
  };

  const openReview = (submission) => {
    markLoaded("review");
    setReviewingSubmission(submission);
  };

  const openRespond = (requestItem) => {
    markLoaded("respond");
    setRespondingFeedback(requestItem);
  };

  if (!snapshot) return <PageSkeleton />;

  return (
    <>
      {view === "overview" && (
        <div className={PAGE}>
          <MentorOverview
            snapshot={snapshot}
            onCreateProject={openProjectDialog}
            onCreateTask={() => openTaskDialog()}
          />
        </div>
      )}

      {view === "interns" && (
        <MentorInterns snapshot={snapshot} onAssignTask={(internName) => openTaskDialog(internName)} />
      )}

      {view === "mentors" && <MentorDirectory onGiveFeedback={openFeedbackDialog} />}

      {view === "projects" && (
        <MentorProjects
          snapshot={snapshot}
          onCreate={openProjectDialog}
          onAddTask={(project) => openTaskDialog(null, project.name)}
        />
      )}

      {view === "tasks" && <MentorTasks snapshot={snapshot} onCreate={() => openTaskDialog()} />}

      {view === "submissions" && (
        <MentorSubmissions snapshot={snapshot} onReviewSubmission={openReview} />
      )}

      {view === "feedback" && (
        <MentorFeedback
          snapshot={snapshot}
          onGiveFeedback={() => openFeedbackDialog()}
          onRespondFeedback={openRespond}
        />
      )}

      {view === "settings" && <MentorSettings />}

      {view === "storage" && <MentorSettings initialTab="storage" />}

      {/* Dialog modals */}
      {loaded.project && (
        <CreateProjectDialog
          open={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
          onCreated={(project) => notify("Project assigned", project.name)}
        />
      )}

      {loaded.task && (
        <CreateTaskDialog
          open={taskDialogOpen}
          onOpenChange={(open) => {
            setTaskDialogOpen(open);
            if (!open) {
              setTaskAssigneePreset(null);
              setTaskProjectPreset(null);
            }
          }}
          projects={snapshot.projects}
          initialAssignee={taskAssigneePreset}
          initialProject={taskProjectPreset}
          onCreated={(task) => notify("Task assigned", task.title)}
        />
      )}

      {loaded.review && (
        <ReviewSubmissionDialog
          submission={reviewingSubmission}
          open={Boolean(reviewingSubmission)}
          onOpenChange={(open) => {
            if (!open) setReviewingSubmission(null);
          }}
          onReviewed={(submission, decision) =>
            notify(
              decision === "approve" ? "Deliverable approved" : "Changes requested",
              submission.title
            )
          }
        />
      )}

      {loaded.feedback && (
        <GiveFeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          projects={snapshot.projects}
          initialMentor={feedbackMentorPreset}
          onCreated={(item) => notify("Feedback recorded", item.title)}
        />
      )}

      {loaded.respond && (
        <RespondFeedbackDialog
          requestItem={respondingFeedback}
          open={Boolean(respondingFeedback)}
          onOpenChange={(open) => {
            if (!open) setRespondingFeedback(null);
          }}
          onResponded={(item) => notify("Response published", item.title)}
        />
      )}

      {/* Toast feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-2.5 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xl animate-in fade-in slide-in-from-bottom-2 dark:border-emerald-500/30 dark:bg-slate-900 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
