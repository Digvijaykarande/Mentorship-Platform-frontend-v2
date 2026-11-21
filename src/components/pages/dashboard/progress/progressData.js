// Small pure helpers for the Progress page. All figures come from lib/workspace/progress.js.

export function getSkillLevel(progress) {
  if (progress >= 85) return "Advanced";
  if (progress >= 60) return "Intermediate";
  return "Beginner";
}

export function formatShortDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}
