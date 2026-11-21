export const MENTOR_AVATAR = "bg-linear-to-br from-violet-500 to-primary-600";

export const parseCapacity = (capacity = "") => {
  const [used, total] = String(capacity)
    .split("/")
    .map((part) => parseInt(part.trim(), 10));
  return {
    used: Number.isFinite(used) ? used : 0,
    total: Number.isFinite(total) && total > 0 ? total : 0,
  };
};

export const capacityTone = (pct) =>
  pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-secondary-500" : "bg-emerald-500";

export const progressTone = (value) =>
  value === 100 ? "bg-emerald-500" : value < 40 ? "bg-rose-500" : "bg-primary-500";
