/** Presentation helpers and the snapshot the mentor screens read. Data itself comes from the API. */

export const STATUS_TONES = {
  Active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Completed: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  "At risk": "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  "On leave":
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  "In Progress":
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  Planning:
    "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
  "Under Review":
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "To do":
    "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
  "In progress":
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  Done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Pending:
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  Approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  "Changes Requested":
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  Resolved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  "In Review":
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "Action Required":
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};
export const initialsOf = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
export const statusTone = (status) =>
  STATUS_TONES[status] ||
  "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300";

/** Everything the mentor views need, derived from the workspace (already scoped by role on the server). */
export const buildMentorSnapshot = ({ tasks, submissions, feedback, projects, interns, mentors, overview, activity }) => {
  const counts = overview?.counts;
  return {
    tasks,
    submissions,
    feedback,
    projects,
    interns,
    mentors,
    completed: tasks.filter((task) => task.status === "Done").length,
    pendingReviews: submissions.filter((s) => s.status === "Pending").length,
    overdue: tasks.filter((task) => task.overdue && task.status !== "Done").length,
    avgProgress: overview?.tasks?.avgProgress ?? 0,
    resources: projects.flatMap((p) => p.resources),
    activity,
    pendingMentors: counts?.pendingMentors ?? 0,
  };
};
