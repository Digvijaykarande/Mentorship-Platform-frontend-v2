export const TABS = [
  { value: "all", label: "All" },
  { value: "todo", label: "To do" },
  { value: "active", label: "In progress" },
  { value: "done", label: "Done" },
];

export const STATUS_STYLES = {
  "To do":
    "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
  "In progress":
    "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  Done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

export const groupOf = (task) =>
  task.status === "To do" ? "todo" : task.status === "Done" ? "done" : "active";

export const initialsOf = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const stepStates = (subtasks = []) => {
  let blocked = false;
  return subtasks.map((s) => {
    if (s.done && s.approved) return "done";
    if (s.done) {
      blocked = true;
      return "review";
    }
    if (blocked) return "locked";
    blocked = true;
    return "current";
  });
};

export const progressOf = (task) => {
  const steps = task.subtasks || [];
  const states = stepStates(steps);
  const done = states.filter((s) => s === "done").length;
  return {
    done,
    total: steps.length,
    percent: steps.length ? Math.round((done / steps.length) * 100) : 0,
    current: steps[states.indexOf("current")] ?? null,
    review: steps[states.indexOf("review")] ?? null,
    states,
  };
};

// Intern action: mark the current step as completed.
