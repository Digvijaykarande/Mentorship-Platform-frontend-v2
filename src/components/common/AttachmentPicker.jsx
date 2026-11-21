"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Link2, Plus, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, isHttpUrl } from "@/lib/attachments";
import { useStorage } from "@/lib/storage";
import StorageHint from "@/components/common/StorageHint";

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // matches the limit the API signs uploads for

const INPUT =
  "h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100";

let counter = 0;
const nextId = () => `att-${Date.now()}-${counter++}`;

/**
 * Controlled picker for files (any type: images, PDFs, docs, zips...) and links.
 * `items` is [{ id, kind: "file", file } | { id, kind: "link", name, url }].
 * Nothing is uploaded here: the parent calls `resolveAttachments(items)` on submit.
 */
export default function AttachmentPicker({
  items,
  onChange,
  disabled = false,
  maxItems = 10,
  allowLinks = true,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState({ name: "", url: "" });

  const room = maxItems - items.length;
  const { remaining, full, me } = useStorage();
  const pendingBytes = items.reduce((sum, i) => sum + (i.kind === "file" ? i.file.size : 0), 0);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const tooBig = files.find((f) => f.size > MAX_FILE_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than ${MAX_FILE_BYTES / 1048576} MB.`);
      return;
    }
    if (files.length > room) {
      setError(`You can attach up to ${maxItems} items.`);
      return;
    }
    const incoming = files.reduce((sum, f) => sum + f.size, 0);
    if (pendingBytes + incoming > remaining) {
      setError(
        `Not enough storage: you have ${formatBytes(Math.max(0, remaining - pendingBytes))} left, these files are ${formatBytes(incoming)}.`,
      );
      return;
    }
    setError("");
    onChange([...items, ...files.map((file) => ({ id: nextId(), kind: "file", file }))]);
  };

  const addLink = () => {
    if (!isHttpUrl(link.url)) {
      setError("Links must start with http:// or https://");
      return;
    }
    if (room < 1) {
      setError(`You can attach up to ${maxItems} items.`);
      return;
    }
    setError("");
    onChange([...items, { id: nextId(), kind: "link", name: link.name.trim(), url: link.url.trim() }]);
    setLink({ name: "", url: "" });
  };

  const remove = (id) => onChange(items.filter((i) => i.id !== id));

  return (
    <div className="space-y-2.5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled && !full) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-center transition",
          compact ? "px-4 py-3.5" : "px-4 py-5",
          dragging
            ? "border-primary-400 bg-primary-50/60 dark:bg-primary-500/10"
            : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30",
          disabled && "opacity-60",
        )}
      >
        <UploadCloud className="h-5 w-5 text-primary-500" />
        <Button variant="unstyled"
          type="button"
          disabled={disabled || room < 1 || full}
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-slate-700 hover:text-primary-600 disabled:cursor-not-allowed dark:text-slate-200"
        >
          {full ? "Storage full: file uploads are blocked" : "Click to choose files or drag & drop"}
        </Button>
        <span className="text-[10.5px] text-slate-400 dark:text-slate-500">
          Images, PDF, DOCX, ZIP and more · up to {MAX_FILE_BYTES / 1048576} MB each
        </span>
        <Input
          ref={inputRef}
          type="file"
          multiple
          hidden
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {allowLinks && (
        <div className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto]">
          <Input
            className={INPUT}
            placeholder="Link name (optional)"
            value={link.name}
            disabled={disabled}
            onChange={(e) => setLink((l) => ({ ...l, name: e.target.value }))}
          />
          <Input
            className={INPUT}
            placeholder="https://… (Figma, Drive, repo)"
            value={link.url}
            disabled={disabled}
            onChange={(e) => setLink((l) => ({ ...l, url: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
          />
          <Button variant="unstyled"
            type="button"
            onClick={addLink}
            disabled={disabled || !link.url.trim()}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </Button>
        </div>
      )}

      {error && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>}

      {me && <StorageHint pending={pendingBytes} />}

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon =
              item.kind === "link" ? Link2 : item.file.type.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li
                key={item.id}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {item.kind === "link" ? item.name || item.url : item.file.name}
                  </p>
                  <p className="truncate text-[10.5px] text-slate-400">
                    {item.kind === "link" ? item.url : formatBytes(item.file.size)}
                  </p>
                </div>
                <Button variant="unstyled"
                  type="button"
                  aria-label="Remove"
                  disabled={disabled}
                  onClick={() => remove(item.id)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
