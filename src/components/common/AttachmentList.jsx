"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Image as ImageIcon, Link2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, hostOf, isImage, previewUrl } from "@/lib/attachments";

/**
 * Read-only list of attachments ({ name, url, size, mimeType, kind }). Opens in a new tab.
 * Optional: `item.sub` replaces the default second line; `onRemove(item)` shows a delete button per item.
 */
export default function AttachmentList({ items = [], className, onRemove }) {
  if (!items.length) return null;
  return (
    <ul className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {items.map((a, i) => {
        const link = a.kind === "link";
        const image = !link && isImage(a);
        const Icon = link ? Link2 : image ? ImageIcon : FileText;
        return (
          <li key={`${a.url}-${i}`} className="relative">
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 transition hover:border-primary-300 hover:bg-primary-50/40 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary-500/40",
                onRemove && "pr-10",
              )}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl(a)} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" loading="lazy" />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                  <Icon className="h-4 w-4" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{a.name}</span>
                <span className="block truncate text-[10.5px] text-slate-400">
                  {a.sub ?? (link ? hostOf(a.url) : a.size ? formatBytes(a.size) : "File")}
                </span>
              </span>
              {!onRemove && (
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-primary-500" />
              )}
            </a>
            {onRemove && (
              <Button variant="unstyled"
                type="button"
                aria-label={`Remove ${a.name}`}
                onClick={() => onRemove(a)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
