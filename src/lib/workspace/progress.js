/**
 * Everything the Progress page shows, derived from the intern's real tasks, projects, feedback and
 * submissions. Nothing here is stored, so the figures can never disagree with each other.
 */
import { internshipTimeline } from "./adapters";
import { formatDate } from "./format";

const WEEK = 7 * 86_400_000;
const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);
const average = (list) => (list.length ? list.reduce((sum, n) => sum + n, 0) / list.length : 0);
const dayStart = (d) => new Date(new Date(d).toISOString().slice(0, 10)).getTime();

const TASK_MILESTONES = [1, 5, 10, 25, 50, 100];

export function buildProgress({ user, tasks = [], projects = [], feedback = [], submissions = [] }, now = new Date()) {
  const timeline = internshipTimeline(user, projects, now);
  const INTERNSHIP = {
    currentWeek: timeline.currentWeek,
    totalWeeks: timeline.totalWeeks ?? timeline.currentWeek,
    endDate: timeline.endDate || "not set",
    hasEnd: timeline.totalWeeks !== null,
  };

  const done = tasks.filter((t) => t.status === "Done");
  const completedOnTime = done.filter((t) => {
    if (!t.dueDate || !t.completedAt) return true;
    return new Date(t.completedAt).getTime() <= dayStart(t.dueDate) + 86_400_000 - 1;
  }).length;
  const TASKS = {
    total: tasks.length,
    completed: done.length,
    inProgress: tasks.filter((t) => t.status === "In progress").length,
    pending: tasks.filter((t) => t.status === "To do").length,
    overdue: tasks.filter((t) => t.overdue).length,
    completedOnTime,
  };

  const PROJECTS = projects.map((p) => ({ id: p.id, name: p.name, status: p.status, progress: p.progress }));
  const BREAKDOWN = [
    { key: "projects", label: "Projects", value: Math.round(average(PROJECTS.map((p) => p.progress))), tone: "blue" },
    { key: "tasks", label: "Tasks", value: pct(TASKS.completed, TASKS.total), tone: "indigo" },
  ];
  const OVERALL_PROGRESS = Math.round(average(BREAKDOWN.map((b) => b.value)));
  const EXPECTED_PROGRESS = INTERNSHIP.hasEnd
    ? Math.round((INTERNSHIP.currentWeek / INTERNSHIP.totalWeeks) * 100)
    : OVERALL_PROGRESS; // no deadline set, so there is no pace to compare against

  /* Weekly history: cumulative approved steps / all steps, and tasks finished per week. */
  const start = new Date(user?.joinedAt || now);
  const steps = tasks.flatMap((t) => t.subtasks);
  const approvals = steps.filter((s) => s.approved && s.approvedAt).map((s) => new Date(s.approvedAt).getTime());
  const WEEKLY_PROGRESS = Array.from({ length: Math.min(INTERNSHIP.currentWeek, 26) }, (_, i) => {
    const weekNo = INTERNSHIP.currentWeek > 26 ? INTERNSHIP.currentWeek - 26 + i + 1 : i + 1;
    const from = start.getTime() + (weekNo - 1) * WEEK;
    const to = from + WEEK;
    return {
      week: `W${weekNo}`,
      start: new Date(from).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      completion: pct(approvals.filter((t) => t < to).length, steps.length),
      tasks: done.filter((t) => t.completedAt && new Date(t.completedAt).getTime() >= from && new Date(t.completedAt).getTime() < to).length,
    };
  });

  const rated = feedback.filter((f) => f.rating > 0).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const AVERAGE_RATING = Number(average(rated.map((f) => f.rating)).toFixed(1));
  const latest = rated[0];
  const previous = rated[1];
  const FEEDBACK = {
    totalReviews: feedback.filter((f) => !f.isRequest).length,
    trend: !latest ? "No reviews yet" : !previous ? "New" : latest.rating > previous.rating ? "Improving" : latest.rating < previous.rating ? "Needs focus" : "Steady",
    mentor: latest?.mentor ?? "",
    mentorRole: latest?.role ?? "",
    date: latest ? formatDate(latest.createdAt) : "",
    quote: latest?.summary || "No reviews yet. Your mentor's feedback will appear here.",
    ratings: [{ label: "Overall rating", value: latest?.rating ?? 0 }],
  };

  /* Achievements are earned from real events, newest first. */
  const doneByDate = done.filter((t) => t.completedAt).sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  const ACHIEVEMENTS = [];
  TASK_MILESTONES.forEach((n) => {
    if (doneByDate.length >= n) {
      ACHIEVEMENTS.push({
        id: `tasks-${n}`,
        title: n === 1 ? "First task completed" : `${n} tasks completed`,
        description: n === 1 ? "Your first task was approved by your mentor." : `Finished ${n} assigned internship tasks.`,
        date: doneByDate[n - 1].completedAt.slice(0, 10),
        icon: "check",
        tone: "emerald",
      });
    }
  });
  const firstApproved = submissions.filter((s) => s.status === "Approved" && s.reviewedAt).sort((a, b) => new Date(a.reviewedAt) - new Date(b.reviewedAt))[0];
  if (firstApproved) {
    ACHIEVEMENTS.push({ id: "first-approval", title: "First work approved", description: `${firstApproved.title} was approved by your mentor.`, date: firstApproved.reviewedAt.slice(0, 10), icon: "code", tone: "violet" });
  }
  const topRated = rated.filter((f) => f.rating >= 4.5).at(-1);
  if (topRated) {
    ACHIEVEMENTS.push({ id: "top-rated", title: "Mentor's choice", description: "Received a top rating from your mentor.", date: topRated.createdAt.slice(0, 10), icon: "star", tone: "rose" });
  }
  const finishedProject = projects.find((p) => p.status === "Completed");
  if (finishedProject) {
    ACHIEVEMENTS.push({ id: "project-delivered", title: "Project delivered", description: `${finishedProject.name} was completed.`, date: (finishedProject.createdAt || now.toISOString()).slice(0, 10), icon: "trophy", tone: "amber" });
  }
  ACHIEVEMENTS.sort((a, b) => b.date.localeCompare(a.date));

  const nextTarget = TASK_MILESTONES.find((n) => n > TASKS.completed) ?? TASKS.completed;
  const NEXT_ACHIEVEMENT = { title: `${nextTarget} tasks completed`, current: TASKS.completed, target: nextTarget };

  return {
    INTERNSHIP, WEEKLY_PROGRESS, PROJECTS, TASKS, BREAKDOWN, OVERALL_PROGRESS, EXPECTED_PROGRESS,
    ON_TIME_RATE: pct(TASKS.completedOnTime, TASKS.completed), AVERAGE_RATING, FEEDBACK, ACHIEVEMENTS, NEXT_ACHIEVEMENT,
  };
}
