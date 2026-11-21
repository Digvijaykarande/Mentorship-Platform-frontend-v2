/** Date/label helpers shared by the adapters. Dates arrive from the API as ISO strings. */

const MS_DAY = 86_400_000;
const utcDay = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export const formatShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

/** "2026-11-30" for <input type="date">. */
export const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

export function timeAgo(iso, now = new Date()) {
  if (!iso) return "";
  const diff = now.getTime() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

/** Notification list grouping. */
export function dayGroup(iso, now = new Date()) {
  if (!iso) return "Earlier";
  const days = Math.round((utcDay(now) - utcDay(new Date(iso))) / MS_DAY);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : "Earlier";
}

/** "Tomorrow", "In 3 days", "Oct 26", "1 day overdue", "No deadline". */
export function dueLabel(dueDate, { overdue = false, done = false } = {}, now = new Date()) {
  if (!dueDate) return "No deadline";
  if (done) return formatShort(dueDate);
  const days = Math.round((utcDay(new Date(dueDate)) - utcDay(now)) / MS_DAY);
  if (overdue || days < 0) {
    const n = Math.abs(days);
    return `${n} day${n === 1 ? "" : "s"} overdue`;
  }
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return formatShort(dueDate);
}

/** "12 Days Remaining" style label used on project cards. */
export function remainingLabel(dueDate, now = new Date()) {
  if (!dueDate) return "No deadline";
  const days = Math.round((utcDay(new Date(dueDate)) - utcDay(now)) / MS_DAY);
  if (days < 0) return `${Math.abs(days)} Day${Math.abs(days) === 1 ? "" : "s"} Overdue`;
  if (days === 0) return "Due Today";
  return `${days} Day${days === 1 ? "" : "s"} Remaining`;
}
