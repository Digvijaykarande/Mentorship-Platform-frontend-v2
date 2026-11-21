"use client";

import { useMemo, useState } from "react";
import FeedbackHeader from "@/components/pages/dashboard/feedback/FeedbackHeader";
import FeedbackSummary from "@/components/pages/dashboard/feedback/FeedbackSummary";
import FeedbackFilters from "@/components/pages/dashboard/feedback/FeedbackFilters";
import LatestFeedback from "@/components/pages/dashboard/feedback/LatestFeedback";
import FeedbackPagination from "@/components/pages/dashboard/feedback/FeedbackPagination";
import RequestFeedbackDialog from "@/components/pages/dashboard/feedback/RequestFeedbackDialog";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";

const INITIAL_FILTERS = {
  search: "",
  category: "All Categories",
  status: "All Statuses",
};
const INITIAL_REQUEST_FORM = { mentor: "", subject: "", message: "" };
const PAGE_SIZE = 5;

export default function FeedbackPage() {
  const { feedback, mentorOptions, actions } = useWorkspace();
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [actionError, setActionError] = useState("");
  const [requestForm, setRequestForm] = useState(INITIAL_REQUEST_FORM);

  const filteredFeedback = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return feedback.filter((item) => {
      const matchesSearch =
        !q ||
        [item.title, item.project, item.category, item.mentor, item.id].some(
          (field) => field.toLowerCase().includes(q),
        );
      const matchesCategory =
        filters.category === "All Categories" ||
        item.category === filters.category;
      const matchesStatus =
        filters.status === "All Statuses" || item.status === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [feedback, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedback.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages); // stays valid if the list shrinks

  const pagedFeedback = useMemo(
    () =>
      filteredFeedback.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filteredFeedback, currentPage],
  );

  const summary = useMemo(() => {
    const total = feedback.length;
    const newFeedback = feedback.filter(
      (item) => item.status === "In Review",
    ).length;
    const actionRequired = feedback.filter(
      (item) => item.status === "Action Required",
    ).length;
    const rated = feedback.filter((item) => item.rating > 0);
    const average = rated.length
      ? (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1)
      : "0.0";
    return { total, newFeedback, actionRequired, average };
  }, [feedback]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };
  const handlePageChange = (next) => {
    const safe = Math.min(Math.max(next, 1), totalPages);
    setPage(safe);
    // Keep the detail panel in sync with the visible page.
    const first = filteredFeedback[(safe - 1) * PAGE_SIZE];
    if (first) setSelectedId(first.id);
  };
  const handleStatusChange = (id, status) => {
    setActionError("");
    actions.setFeedbackStatus(id, status).catch((error) => setActionError(error.message));
  };
  const handleAddSuggestion = (feedbackId, suggestionIndex) => {
    const item = feedback.find((entry) => entry.id === feedbackId);
    if (!item || item.addedSuggestionIds?.includes(suggestionIndex)) return;
    setActionError("");
    actions.addSuggestion(feedbackId, suggestionIndex).catch((error) => setActionError(error.message));
  };
  const handleOpenRequest = () => {
    setRequestForm(INITIAL_REQUEST_FORM);
    setRequestSent(false);
    setRequestError("");
    setIsRequestOpen(true);
  };
  const handleRequestSubmit = async () => {
    if (!requestForm.mentor || !requestForm.subject) return;
    try {
      await actions.requestFeedback({
        mentorId: requestForm.mentor,
        subject: requestForm.subject,
        message: requestForm.message,
      });
    } catch (error) {
      setRequestError(error.message);
      return;
    }
    setRequestSent(true);
    setTimeout(() => {
      setIsRequestOpen(false);
      setRequestSent(false);
      setRequestForm(INITIAL_REQUEST_FORM);
    }, 1200);
  };

  return (
    <main className="min-h-full bg-[#f6f8fc] dark:bg-slate-950">
      <div className="stagger mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {actionError && (
          <div
            role="alert"
            className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          >
            {actionError}
          </div>
        )}
        <FeedbackHeader
          totalFeedback={feedback.length}
          onRequestFeedback={handleOpenRequest}
        />

        {/* Stat cards intentionally preserved as provided. */}
        <FeedbackSummary
          summary={summary}
          onFilterStatus={(status) => {
            setFilters((current) =>
              status ? { ...current, status } : INITIAL_FILTERS,
            );
            setPage(1);
          }}
        />

        <LatestFeedback
          feedback={pagedFeedback}
          totalFeedback={feedback.length}
          selectedId={selectedId ?? pagedFeedback[0]?.id ?? null}
          onSelect={setSelectedId}
          onStatusChange={handleStatusChange}
          onAddSuggestion={handleAddSuggestion}
          toolbar={
            <FeedbackFilters
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          }
        />

        <FeedbackPagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filteredFeedback.length}
          onPageChange={handlePageChange}
        />

        <RequestFeedbackDialog
          open={isRequestOpen}
          onOpenChange={setIsRequestOpen}
          form={requestForm}
          onFormChange={(key, value) =>
            setRequestForm((previous) => ({ ...previous, [key]: value }))
          }
          onSubmit={handleRequestSubmit}
          sent={requestSent}
          mentors={mentorOptions}
          error={requestError}
        />
      </div>
    </main>
  );
}
