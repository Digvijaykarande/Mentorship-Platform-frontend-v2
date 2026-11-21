import { statusKey } from "./Status";
import { linkField, resolveType } from "./constants";

/* ------------------------------------------------------------------ *
 * VERSIONING  —  vMAJOR.MINOR.PATCH
 *
 *   MAJOR  Revision: re-submitted after the mentor asked for changes.
 *   MINOR  Update:   files, link or type changed while still pending.
 *   PATCH  Small edit: only title / note / related task changed.
 *
 * Lower numbers reset when a higher one increases:
 *   v1.0.0 -> (edit files) v1.1.0 -> (fix note) v1.1.1 -> (revision) v2.0.0
 * ------------------------------------------------------------------ */

export const INITIAL_VERSION = "v1.0.0";

export const VERSION_KINDS = {
  initial: { label: "Initial" },
  major: { label: "Revision" },
  minor: { label: "Update" },
  patch: { label: "Small edit" },
};

export function parseVersion(value) {
  const parts = String(value ?? "")
    .trim()
    .replace(/^v/i, "")
    .split(".");
  const num = (i, fallback) => {
    const n = parseInt(parts[i], 10);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return { major: num(0, 1), minor: num(1, 0), patch: num(2, 0) };
}

export function formatVersion({ major, minor, patch }) {
  return `v${major}.${minor}.${patch}`;
}

/** "v2" -> "v2.0.0", "v1.3" -> "v1.3.0" */
export function normalizeVersion(value) {
  return formatVersion(parseVersion(value));
}

/** True for "v1.2.3" / "1.2.3" style values. */
export function isValidVersion(value) {
  return /^v?\d+\.\d+\.\d+$/i.test(String(value ?? "").trim());
}

/** > 0 when a is newer than b, < 0 when older, 0 when equal. */
export function compareVersions(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  return x.major - y.major || x.minor - y.minor || x.patch - y.patch;
}

export function bumpVersion(current, kind) {
  const { major, minor, patch } = parseVersion(current);
  if (kind === "major") return formatVersion({ major: major + 1, minor: 0, patch: 0 });
  if (kind === "minor") return formatVersion({ major, minor: minor + 1, patch: 0 });
  return formatVersion({ major, minor, patch: patch + 1 });
}

/* ------------------------------ helpers ----------------------------- */

/** What the student is allowed to do with a submission right now. */
export function getPermissions(submission) {
  const key = statusKey(submission?.status);
  return {
    canEdit: key === "pending",
    canRevise: key === "changes",
    canWithdraw: key === "pending" || key === "changes",
    canRestore: key === "withdrawn",
    canDelete: key !== "approved",
    isLocked: key === "approved",
  };
}

const norm = (v) => String(v ?? "").trim();
const sameList = (a = [], b = []) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

/** Editable values of a submission in the same shape the dialog produces. */
export function toFormValues(sub) {
  return {
    title: sub.title || "",
    type: resolveType(sub.type),
    taskTitle: sub.task || "",
    link: sub[linkField(sub.type)] || "",
    notes: sub.notes || "",
    files: Array.isArray(sub.files) ? sub.files : [],
  };
}

/** Compare two form values and decide which kind of version bump applies. */
export function diffForm(prev, next) {
  const content = [];
  const text = [];
  if (resolveType(prev.type) !== resolveType(next.type)) content.push("type");
  if (norm(prev.link) !== norm(next.link)) content.push("link");
  if (!sameList(prev.files, next.files)) content.push("files");
  if (norm(prev.title) !== norm(next.title)) text.push("title");
  if (norm(prev.taskTitle) !== norm(next.taskTitle)) text.push("related task");
  if (norm(prev.notes) !== norm(next.notes)) text.push("note");
  const kind = content.length ? "minor" : text.length ? "patch" : null;
  return { kind, changed: [...content, ...text] };
}
