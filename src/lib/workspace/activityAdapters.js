import { timeAgo } from "./format";

/** Newest-first activity feed for the intern, built from what actually happened. */
export function buildRecentActivity({ submissions = [], feedback = [] }, limit = 8) {
  const items = [
    ...submissions.map((s) => ({
      id: `sub-${s.apiId}`,
      type: "submission",
      title: `${s.title} (${s.version})`,
      description: s.status === "Pending" ? "Submitted and waiting for review" : `Submission ${s.status.toLowerCase()}`,
      at: s.createdAt,
    })),
    ...feedback.map((f) => ({
      id: `fb-${f.apiId}`,
      type: "feedback",
      title: f.title,
      description: f.isRequest ? `Feedback requested from ${f.mentor}` : `Feedback from ${f.mentor}`,
      at: f.createdAt,
    })),
  ];
  return items
    .filter((i) => i.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit)
    .map((i) => ({ ...i, time: timeAgo(i.at) }));
}

/** Week counter for the greeting banner, from the join date to the last project deadline. */
export function internshipTimeline(user, projects = [], now = new Date()) {
  const WEEK = 7 * 86_400_000;
  const start = new Date(user?.joinedAt || now);
  const currentWeek = Math.max(1, Math.floor((now - start) / WEEK) + 1);
  const deadlines = projects.map((p) => p.dueDate).filter(Boolean).map((d) => new Date(d));
  if (!deadlines.length) return { currentWeek, totalWeeks: null, endDate: "" };
  const end = new Date(Math.max(...deadlines));
  const totalWeeks = Math.max(currentWeek, Math.ceil((end - start) / WEEK));
  return {
    currentWeek,
    totalWeeks,
    endDate: end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}
