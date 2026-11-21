"use client";

import { useState } from "react";
import Pagination from "@/components/common/Pagination";
import { cn } from "@/lib/utils";

export const MENTOR_PAGE_SIZE = 10;

/**
 * Client-side pagination for mentor lists.
 * `resetKey` (e.g. `${search}|${filter}`) sends the list back to page 1 whenever it changes.
 */
export function usePagination(items, resetKey = "", pageSize = MENTOR_PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [state, setState] = useState({ page: 1, key: resetKey });

  const page = state.key === resetKey ? Math.min(state.page, totalPages) : 1;
  const setPage = (next) =>
    setState({ page: Math.min(Math.max(1, next), totalPages), key: resetKey });

  const start = (page - 1) * pageSize;

  return {
    page,
    setPage,
    totalPages,
    total,
    pageSize,
    start,
    pageItems: items.slice(start, start + pageSize),
  };
}

/** Footer with range summary + page buttons. Renders nothing until there are more than `pageSize` records. */
export function MentorPagination({ pagination, label = "records", className }) {
  const { page, totalPages, total, pageSize, start, setPage } = pagination;
  if (total <= pageSize) return null;

  const from = start + 1;
  const to = Math.min(total, start + pageSize);

  return (
    <div
      className={cn(
        "mt-3 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-3 sm:flex-row dark:border-slate-800",
        className
      )}
    >
      <p className="text-[11px] font-medium text-slate-400">
        Showing {from}–{to} of {total} {label}
      </p>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
