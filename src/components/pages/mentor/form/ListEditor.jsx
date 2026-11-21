"use client";

import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-primary-400 dark:focus:ring-primary-400/15";

/**
 * Line-by-line list editor (value is a newline-joined string)
 */
export function ListEditor({
  value,
  onChange,
  variant = "number",
  placeholder = "Add an item",
  addLabel = "Add item",
  mono = false,
}) {
  const items = value === "" || value == null ? [""] : value.split("\n");
  const refs = useRef([]);
  const focusTarget = useRef(null);

  useEffect(() => {
    if (focusTarget.current != null) {
      refs.current[focusTarget.current]?.focus();
      focusTarget.current = null;
    }
  });

  const commit = (next) => onChange(next.join("\n"));
  const setItem = (index, text) => {
    const next = [...items];
    next[index] = text.replace(/\n/g, " ");
    commit(next);
  };
  const addAfter = (index) => {
    const next = [...items];
    next.splice(index + 1, 0, "");
    focusTarget.current = index + 1;
    commit(next);
  };
  const remove = (index) => {
    if (items.length === 1) {
      commit([""]);
      return;
    }
    focusTarget.current = Math.max(0, index - 1);
    commit(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
            {variant === "number" ? (
              index + 1
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
            )}
          </span>
          <Input
            ref={(el) => {
              refs.current[index] = el;
            }}
            value={item}
            placeholder={placeholder}
            onChange={(e) => setItem(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAfter(index);
              } else if (e.key === "Backspace" && item === "" && items.length > 1) {
                e.preventDefault();
                remove(index);
              }
            }}
            className={cn(CONTROL, "h-10 px-3.5", mono && "font-mono text-[13px]")}
          />
          <Button
            variant="unstyled"
            type="button"
            onClick={() => remove(index)}
            aria-label="Remove item"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="unstyled"
        type="button"
        onClick={() => addAfter(items.length - 1)}
        className="ml-[38px] inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary-600 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-500/10"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}
