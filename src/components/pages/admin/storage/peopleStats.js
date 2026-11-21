/** Pure helpers for the "Everyone's storage" table (kept free of React so they are easy to test). */

export const ROLE_ORDER = ["intern", "mentor", "admin"];

/** Status filters. "low" covers both "warning" and "critical" levels. */
export const STATUS_FILTERS = [
  { id: "all", label: "All", match: () => true },
  { id: "ok", label: "Healthy", match: (p) => (p.level ?? "ok") === "ok" },
  { id: "low", label: "Running low", match: (p) => p.level === "warning" || p.level === "critical" },
  { id: "full", label: "Full", match: (p) => p.level === "full" },
];

/**
 * Totals for the bar above the table. Only people with a limit count toward "allocated";
 * unlimited people (admins) are reported separately because they have no share to fill.
 */
export function summarize(people = []) {
  const limited = people.filter((p) => p.quotaBytes !== null && p.quotaBytes !== undefined);
  const allocated = limited.reduce((s, p) => s + p.quotaBytes, 0);
  const usedLimited = limited.reduce((s, p) => s + p.bytes, 0);
  const unlimitedBytes = people.filter((p) => p.quotaBytes === null || p.quotaBytes === undefined).reduce((s, p) => s + p.bytes, 0);

  const byRole = {};
  for (const p of limited) byRole[p.role] = (byRole[p.role] ?? 0) + p.bytes;

  return {
    allocated,
    usedLimited,
    unlimitedBytes,
    free: Math.max(0, allocated - usedLimited),
    percent: allocated > 0 ? Math.min(100, Math.round((usedLimited / allocated) * 1000) / 10) : 0,
    byRole,
    counts: Object.fromEntries(STATUS_FILTERS.map((f) => [f.id, people.filter(f.match).length])),
  };
}

/** Sort keys for the table headers. People without a limit sort as "0% used". */
export const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  role: (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.name.localeCompare(b.name),
  used: (a, b) => a.bytes - b.bytes,
  percent: (a, b) => (a.quotaBytes === null ? -1 : a.percent) - (b.quotaBytes === null ? -1 : b.percent),
  files: (a, b) => (a.files ?? 0) - (b.files ?? 0),
};

export function filterAndSort(people, { search = "", role = "all", status = "all", sort = { key: "used", dir: "desc" } }) {
  const q = search.trim().toLowerCase();
  const statusMatch = STATUS_FILTERS.find((f) => f.id === status)?.match ?? (() => true);
  const list = people.filter((p) => (role === "all" || p.role === role) && statusMatch(p) && (!q || p.name.toLowerCase().includes(q) || (p.email || "").toLowerCase().includes(q)));
  const by = SORTERS[sort.key] ?? SORTERS.used;
  return [...list].sort((a, b) => (sort.dir === "asc" ? by(a, b) : by(b, a)));
}
