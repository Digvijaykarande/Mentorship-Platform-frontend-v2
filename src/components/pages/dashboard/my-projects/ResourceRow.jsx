"use client";

import { Button } from "@/components/ui/button";
import {
  PenLine,
  FileText,
  Database,
  Terminal,
  ExternalLink,
  Download,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { formatBytes, isImage } from "@/lib/attachments";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  draw: PenLine,
  picture_as_pdf: FileText,
  database: Database,
  terminal: Terminal,
};

const ICON_STYLES = {
  "primary-fixed":
    "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  "error-container":
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "secondary-container":
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function ResourceRow({ resource, onDelete }) {
  const Icon = isImage(resource) ? ImageIcon : (ICON_MAP[resource.icon] ?? FileText);
  const isLink = resource.kind === "link";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3 transition-colors hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            ICON_STYLES[resource.tone] ?? ICON_STYLES.neutral,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {resource.name}
          </span>
          <span className="text-[10.5px] text-slate-400 dark:text-slate-500">
            {resource.meta}
            {resource.size ? ` • ${formatBytes(resource.size)}` : ""}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            title={isLink ? "Open link" : "Open / download file"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400"
          >
            {isLink ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          </a>
        )}
        {onDelete && (
          <Button variant="unstyled"
            type="button"
            onClick={() => onDelete(resource)}
            title="Remove"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
