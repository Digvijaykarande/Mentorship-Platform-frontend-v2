import { remainingLabel, toDateInput, timeAgo } from "./format";

const STATUS_NOTE = {
  Completed: "Approved by Mentor",
  "Under Review": "Awaiting mentor review",
  "In Progress": "In progress",
  Planning: "Planning phase",
};

export const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function toUiProject(p, uiTasks = []) {
  const tasks = uiTasks
    .filter((t) => t.projectId === p.id)
    .map((t) => ({
      id: t.id,
      title: t.title,
      badgeLabel: t.status === "Done" ? "Completed" : `${t.priority} Priority`,
      badgeTone: t.status === "Done" ? "secondary" : t.priority === "High" ? "primary" : "primary-fixed",
      completed: t.status === "Done",
      completedLabel: "Passed",
      dueLabel: t.status === "Done" ? undefined : t.due,
      dueTone: t.overdue || t.due === "Today" ? "error" : undefined,
      assignee: { initials: initialsOf(t.mentee), tone: "primary" },
      phaseId: null,
    }));
  const latest = p.latestFeedback;
  const mentorName = p.mentor?.name ?? null;
  return {
    id: p.id,
    apiId: p.id,
    code: p.code,
    name: p.name,
    repoPath: p.repo.path,
    icon: p.icon,
    status: p.status,
    statusLabel: p.status,
    progress: p.progress,
    progressPercent: p.progress,
    description: p.description,
    tags: p.tags,
    extraTagCount: 0,
    due: remainingLabel(p.dueDate),
    dueLabel: remainingLabel(p.dueDate),
    dueDate: toDateInput(p.dueDate),
    contributors: p.assignees.length,
    priority: p.priority,
    owner: p.owner?.name ?? p.assignees[0]?.name ?? "Unassigned",
    ownerId: p.owner?.id ?? null,
    mentor: mentorName ?? "Unassigned",
    mentorId: p.mentor?.id ?? null,
    mentorInfo: mentorName
      ? { id: p.mentor.id, name: mentorName, title: `${p.mentor.specialty || "Internship Mentor"}`, online: false, verified: true }
      : null,
    assignees: p.assignees.map((a) => a.name),
    assigneeIds: p.assignees.map((a) => a.id),
    eyebrow: p.code ? `Project ${p.code}` : "Internship Module Brief",
    cohort: p.cohort,
    reviewStatus: STATUS_NOTE[p.status] ?? p.status,
    commitHash: p.repo.commitHash,
    branch: p.repo.branch,
    ciStatus: p.repo.ciStatus,
    gauges: {
      completionPercent: p.progress,
      learningHours: 0,
      evaluationScore: 0,
    },
    mentorFeedback: latest
      ? { label: "Latest Mentor Feedback", timeAgo: timeAgo(latest.createdAt), quote: latest.quote }
      : null,
    documentation: p.documentation.sections.length
      ? {
          version: p.documentation.version,
          updatedLabel: p.documentation.updatedAt ? `Updated ${timeAgo(p.documentation.updatedAt)}` : "",
          sections: p.documentation.sections.map((s) => ({
            id: s.key,
            title: s.title,
            type: s.type,
            content: s.content,
            attachments: s.attachments ?? [],
            addedBy: s.addedBy?.name ?? "",
            addedAt: s.addedAt,
          })),
        }
      : null,
    roadmap: p.roadmap.map((phase) => ({
      id: phase.id,
      title: phase.title,
      status: phase.status,
      dateLabel: phase.dateLabel,
      description: phase.description,
    })),
    tasks,
    resources: p.resources.map((r) => ({
      id: r.id,
      name: r.name,
      meta: `${r.uploadedBy?.name ? `Added by ${r.uploadedBy.name}` : "Added"} • ${timeAgo(r.createdAt)}`,
      icon: r.category || "picture_as_pdf",
      tone: "primary-fixed",
      action: r.url ? "link" : "download",
      url: r.url,
      size: r.size,
      mimeType: r.mimeType,
      kind: r.kind,
      uploaderId: r.uploadedBy?.id ?? null,
      uploaderName: r.uploadedBy?.name ?? "",
      uploaderRole: r.uploadedBy?.role ?? "",
      createdAt: r.createdAt,
    })),
    taskCount: p.taskCount,
    openTaskCount: p.openTaskCount,
    risk: p.progress < 50 ? "Needs attention" : p.status === "Under Review" ? "Review queue" : "On track",
    createdAt: p.createdAt,
  };
}
