/**
 * Translate API objects into the shapes the existing UI components were built around
 * (names instead of ids, display labels instead of ISO dates, `subtasks` instead of `steps`).
 * Every adapted object keeps its real id in `apiId`; for submissions and feedback the display
 * `id` is the human-readable code (SUB-1001 / FB-1001) because that is what the UI shows.
 */
import { dayGroup, dueLabel, formatDate, formatShort, timeAgo, toDateInput } from "./format";

export { initialsOf, toUiProject } from "./projectAdapter";
export { buildRecentActivity, internshipTimeline } from "./activityAdapters";
export { formatDate, formatShort };

/* --------------------------------- tasks -------------------------------- */

export function toUiTask(t) {
  const assignees = (t.assignees ?? []).map((a) => a.name);
  return {
    id: t.id,
    apiId: t.id,
    code: t.code,
    title: t.title,
    project: t.project?.name ?? "General",
    projectId: t.project?.id ?? null,
    mentee: assignees[0] ?? "Unassigned",
    assignees,
    assigneeIds: (t.assignees ?? []).map((a) => a.id),
    instructions: t.instructions,
    priority: t.priority,
    status: t.status,
    due: dueLabel(t.dueDate, { overdue: t.overdue, done: t.status === "Done" }),
    dueDate: toDateInput(t.dueDate),
    overdue: t.overdue,
    subtasks: t.steps.map((s) => ({
      id: s.id,
      text: s.text,
      done: s.done,
      approved: s.approved,
      changesRequested: s.changesRequested,
      reviewNote: s.reviewNote,
      submissionId: s.submissionId,
      sourceFeedbackId: s.sourceFeedbackId,
      approvedAt: s.approvedAt,
    })),
    completedAt:
      t.status === "Done"
        ? t.steps.map((s) => s.approvedAt).filter(Boolean).sort().at(-1) ?? null
        : null,
    resources: t.resources,
    createdAt: t.createdAt,
  };
}

/* ------------------------------- submissions ---------------------------- */

export function toUiSubmission(s) {
  return {
    id: s.code,
    apiId: s.id,
    title: s.title,
    type: s.type,
    scope: s.project?.name ?? "Intern Submission",
    version: s.version,
    status: s.status,
    date: formatDate(s.submittedAt),
    submittedAt: formatDate(s.submittedAt),
    milestone: s.stepNumber ? `Step ${s.stepNumber} of ${s.stepTotal}` : "Current Sprint",
    task: s.task?.title ?? "",
    taskId: s.task?.id ?? null,
    stepId: s.stepId,
    description: s.description,
    feedback: s.feedback,
    files: s.files.map((f) => f.name),
    fileItems: s.files,
    github: s.github,
    link: s.link,
    live: s.live,
    notes: s.notes,
    intern: s.intern?.name ?? "",
    internId: s.intern?.id ?? null,
    reviewedAt: s.reviewedAt,
    reviewedBy: s.reviewedBy?.name ?? "",
    reviewHistory: s.reviews.map((r) => ({
      status: r.status,
      note: r.note,
      reviewer: r.reviewer?.name ?? "",
      date: formatDate(r.date),
    })),
    versions: s.versions.map((v) => ({ ...v, date: formatDate(v.date) })),
    createdAt: s.createdAt,
  };
}

/* --------------------------------- feedback ----------------------------- */

export function toUiFeedback(f) {
  return {
    id: f.code,
    apiId: f.id,
    taskId: f.task?.id ?? null,
    submissionId: f.submissionId,
    title: f.title,
    project: f.project?.name ?? "General",
    category: f.category,
    mentor: f.mentor?.name ?? "Mentor",
    mentorId: f.mentor?.id ?? null,
    role: f.mentor?.specialty || "Mentor",
    mentee: f.mentee?.name ?? "",
    menteeId: f.mentee?.id ?? null,
    rating: f.rating ?? 0,
    status: f.status,
    date: formatDate(f.createdAt),
    summary: f.summary,
    strengths: f.strengths,
    improvements: f.improvements,
    addedSuggestionIds: f.addedSuggestionIds,
    isRequest: f.isRequest,
    respondedAt: f.respondedAt,
    createdAt: f.createdAt,
  };
}

/* ---------------------------------- users ------------------------------- */

export const toUiIntern = (u) => ({
  id: u.code,
  apiId: u.id,
  name: u.name,
  email: u.email,
  role: "Intern",
  team: u.team || "Unassigned",
  cohort: u.cohort,
  mentor: u.mentor?.name ?? "Unassigned",
  mentorId: u.mentor?.id ?? null,
  status: u.isActive ? u.status : "Inactive",
  progress: u.progress,
  joined: formatDate(u.joinedAt),
  isActive: u.isActive,
});

export const toUiMentor = (u) => ({
  id: u.code,
  apiId: u.id,
  name: u.name,
  email: u.email,
  specialty: u.specialty || "General mentoring",
  interns: u.internCount,
  rating: u.rating ?? "—",
  capacity: `${u.internCount} / ${u.capacity}`,
  capacityMax: u.capacity,
  status: !u.isActive ? "Inactive" : !u.isApproved ? "Pending approval" : u.status,
  isApproved: u.isApproved,
  isActive: u.isActive,
  lastActive: u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never",
});

/* ------------------------------ notifications --------------------------- */

export const toUiNotification = (n) => ({
  id: n.id,
  type: n.type,
  title: n.title,
  description: n.description,
  category: n.category,
  accent: n.accent,
  actionLabel: n.actionLabel,
  link: n.link,
  unread: n.unread,
  time: timeAgo(n.createdAt),
  group: dayGroup(n.createdAt),
});

/* -------------------------------- activity ------------------------------ */

export const toUiActivity = (a) => ({
  id: a.id,
  type: a.type,
  title: a.title,
  detail: a.detail,
  actor: a.actor?.name ?? "",
  date: formatDate(a.createdAt),
  timeAgo: timeAgo(a.createdAt),
  createdAt: a.createdAt,
});

/** Link every step to the code of its submission, which is what the intern-side pages look up. */
export function linkStepsToSubmissions(tasks, submissions) {
  const codeByApiId = new Map(submissions.map((s) => [s.apiId, s.id]));
  return tasks.map((task) => ({
    ...task,
    subtasks: task.subtasks.map((step) => ({
      ...step,
      submissionId: step.submissionId ? (codeByApiId.get(step.submissionId) ?? null) : null,
    })),
  }));
}
