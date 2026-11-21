export const AVATAR_GRADIENTS = [
  "bg-linear-to-br from-primary-500 to-violet-600",
  "bg-linear-to-br from-sky-500 to-primary-600",
  "bg-linear-to-br from-emerald-500 to-teal-600",
  "bg-linear-to-br from-rose-500 to-orange-500",
  "bg-linear-to-br from-violet-500 to-fuchsia-600",
  "bg-linear-to-br from-secondary-500 to-orange-600",
];

export const avatarTone = (key = "") => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

export const progressTone = (value) =>
  value === 100 ? "bg-emerald-500" : value < 40 ? "bg-rose-500" : "bg-primary-500";

export const STAT_TONES = {
  indigo: "from-primary-500 to-violet-600 shadow-primary-500/25",
  emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
  rose: "from-rose-500 to-orange-500 shadow-rose-500/25",
  sky: "from-sky-500 to-primary-500 shadow-sky-500/25",
};
