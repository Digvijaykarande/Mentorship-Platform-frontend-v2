/**
 * Data helpers for the admin panel.
 *
 * Accounts and storage are REAL (users API and uploads/usage API). Subscriptions and invoices have no
 * backend yet, so `buildPlatform` derives sample plans and invoices from the real mentor list with
 * stable demo numbers. When a billing endpoint exists, replace it - the views only read its shape.
 */

export const PLANS = {
  Free: { price: 0, seats: 5 },
  Pro: { price: 29, seats: 25 },
  Team: { price: 99, seats: 100 },
};
export const PLAN_NAMES = Object.keys(PLANS);

const TONES = {
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
};
const STATUS = {
  Active: "emerald",
  Paid: "emerald",
  Pending: "amber",
  "Pending approval": "amber",
  Failed: "rose",
  Inactive: "slate",
  Free: "slate",
  Pro: "violet",
  Team: "violet",
};
export const toneOf = (status) => TONES[STATUS[status] || "slate"];

export const formatGb = (gb) => (gb >= 100 ? `${Math.round(gb)} GB` : `${Math.round(gb * 10) / 10} GB`);
export const formatMoney = (n) => `$${n.toLocaleString("en-US")}`;
export const formatDay = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Never");

const hash = (text = "") => [...String(text)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** account status shown in the UI */
export const accountStatus = (u) => (!u.isActive ? "Inactive" : u.role === "mentor" && !u.isApproved ? "Pending approval" : "Active");

/** Sample plans and invoices for every approved mentor. `planOverrides` = { [mentorId]: planName }. */
export function buildPlatform(users, planOverrides = {}) {
  const mentors = users.filter((u) => u.role === "mentor");
  const interns = users.filter((u) => u.role === "intern");
  const now = new Date();

  const rows = mentors
    .filter((m) => m.isApproved)
    .map((m) => {
      const h = hash(m.id || m.email);
      const plan = planOverrides[m.id] ?? PLAN_NAMES[h % PLAN_NAMES.length];
      const { price, seats } = PLANS[plan];
      const billing = price === 0 ? "Free" : ["Paid", "Paid", "Paid", "Pending", "Failed"][h % 5];
      const invoices = price === 0 ? [] : [0, 1, 2].map((i) => ({
        id: `INV-${String(h % 9000 + 1000)}-${3 - i}`,
        date: new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString(),
        amount: price,
        status: i === 0 ? billing : "Paid",
      }));
      return {
        mentor: m,
        plan,
        price,
        seats,
        interns: m.internCount ?? interns.filter((i) => i.mentor?.id === m.id).length,
        billing,
        invoices,
      };
    });

  const invoices = rows
    .flatMap((r) => r.invoices.map((inv) => ({ ...inv, mentor: r.mentor, plan: r.plan })))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    rows,
    invoices,
    totals: {
      mentors: mentors.length,
      activeMentors: mentors.filter((m) => m.isActive && m.isApproved).length,
      pendingMentors: mentors.filter((m) => m.isActive && !m.isApproved).length,
      interns: interns.length,
      mrr: rows.filter((r) => r.billing !== "Failed").reduce((s, r) => s + r.price, 0),
      pendingPayments: invoices.filter((i) => i.status === "Pending").length,
      failedPayments: invoices.filter((i) => i.status === "Failed").length,
    },
  };
}
