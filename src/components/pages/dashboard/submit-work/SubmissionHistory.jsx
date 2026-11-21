"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import SubmissionHistoryItem from "./SubmissionHistoryItem";

const PAGE_SIZE = 3;

export default function SubmissionHistory({
  submissions = [],
  selectedSubmissionId,
  onSelect = () => {},
  onEdit = () => {},
  onWithdraw = () => {},
  onRestore = () => {},
  onDelete = () => {},
  onSubmitRevision = () => {},
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(submissions.length / PAGE_SIZE));
  const visibleSubmissions = submissions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Go back to page 1 only when the list itself changes (filters, add, delete),
  // not when a submission is edited in place.
  const idsKey = submissions.map((s) => s.id).join("|");
  useEffect(() => {
    setPage(1);
  }, [idsKey]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const handleViewDetails = (id) => {
    onSelect(id);
    setTimeout(
      () =>
        document
          .getElementById("submission-details")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  return (
    <Card className="overflow-hidden rounded-xl border-slate-200/80 bg-white py-0 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-br from-white via-white to-primary-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-primary-500/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-500/25" />
            <h2 className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">
              Submission history
            </h2>
          </div>
          <p className="mt-1 pl-4 text-xs text-slate-500 dark:text-slate-400">
            Your latest deliverables and mentor review status
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No submissions found"
          description="Try a different search term or clear your filters."
        />
      ) : (
        <>
          <div className="stagger-list grid gap-2.5 p-3 sm:p-4">
            {visibleSubmissions.map((submission) => (
              <SubmissionHistoryItem
                key={submission.id}
                submission={submission}
                selected={submission.id === selectedSubmissionId}
                onSelect={onSelect}
                onEdit={onEdit}
                onWithdraw={onWithdraw}
                onRestore={onRestore}
                onDelete={onDelete}
                onSubmitRevision={onSubmitRevision}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Page{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{page}</span> of{" "}
                {pageCount}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-white dark:bg-slate-900"
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                  disabled={page === pageCount}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
