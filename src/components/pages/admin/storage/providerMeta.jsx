import { Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

/** Google Drive's triangle, drawn inline so no extra icon package is needed. */
export function DriveMark({ className }) {
  return (
    <svg viewBox="0 0 87.3 78" className={className} aria-hidden="true">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

export function ProviderMark({ id, className }) {
  if (id === "gdrive") return <DriveMark className={cn("h-5 w-5", className)} />;
  return <Cloud className={cn("h-5 w-5 text-sky-600 dark:text-sky-400", className)} />;
}

/** Colour used for each provider in the "stored where" bar and legend. */
export const PROVIDER_COLOR = { cloudinary: "bg-sky-500", gdrive: "bg-emerald-500" };

/** Shown while the server is still working, so the layout never jumps. */
export const PROVIDER_PLACEHOLDERS = [
  { id: "cloudinary", label: "Cloudinary" },
  { id: "gdrive", label: "Google Drive" },
];

export const STATUS_UI = {
  connected: { label: "Connected", chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300" },
  needs_reauth: { label: "Needs reconnecting", chip: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300" },
  error: { label: "Can't reach", chip: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300" },
  not_configured: { label: "Not connected", chip: "bg-slate-100 text-slate-600 ring-slate-500/15 dark:bg-slate-800 dark:text-slate-300" },
};

export const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "";

/** "digvijay@gmail.com" -> "di•••@gmail.com" */
export function maskEmail(email) {
  if (!email || typeof email !== "string") return "";
  const [name, domain] = email.split("@");
  if (!domain) return `${email.slice(0, 2)}•••`;
  return `${name.slice(0, 2)}•••@${domain}`;
}

/** "mycloudname" -> "my•••" */
export const maskText = (text) => (text ? `${String(text).slice(0, 2)}•••` : "");
