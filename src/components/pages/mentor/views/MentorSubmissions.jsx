"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import FilterTabs from "@/components/common/FilterTabs";
import { Reveal } from "../MentorMotion";
import { MentorPagination, usePagination } from "../MentorPagination";
import { MentorStatusBadge, Toolbar, EmptyState,
  MentorSection as SectionCard,
} from "../MentorCommon";

export default function MentorSubmissions({ snapshot, onReviewSubmission }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSubmissions = snapshot.submissions.filter((submission) => {
    const matchesFilter =
      filter === "all" ||
      submission.status.toLowerCase().replace(/\s+/g, "-") === filter;

    const matchesSearch = `${submission.title} ${submission.scope} ${submission.task} ${submission.id}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pager = usePagination(filteredSubmissions, `${search}|${filter}`);

  const filterOptions = [
    { value: "all", label: "All Reviews", count: snapshot.submissions.length },
    {
      value: "pending",
      label: "Pending",
      count: snapshot.submissions.filter((s) => s.status === "Pending").length,
    },
    {
      value: "approved",
      label: "Approved",
      count: snapshot.submissions.filter((s) => s.status === "Approved").length,
    },
    {
      value: "changes-requested",
      label: "Needs Changes",
      count: snapshot.submissions.filter((s) => s.status === "Changes Requested").length,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero icon={ClipboardCheck} badge="Review Queue" title="Review deliverables before they block." description="Evaluate submitted pull requests and evidence, leave structured coaching, and approve milestones."
      />

      <SectionCard revealIndex={1}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search submissions by title, scope, or ID..."
        >
          <FilterTabs
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />
        </Toolbar>

        <div className="mt-3 space-y-2">
          {pager.pageItems.map((submission, i) => {
            const isPending =
              submission.status === "Pending" || submission.status === "Under Review";

            return (
              <Reveal
                key={submission.id}
                index={i}
                delay={200}
                onClick={() => onReviewSubmission(submission)}
                className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-3 transition lg:flex-row lg:items-center ${
                  isPending
                    ? "border-secondary-200/80 bg-secondary-50/20 hover:border-secondary-300 hover:bg-secondary-50/40 dark:border-secondary-900/40 dark:bg-secondary-950/10"
                    : "border-slate-100 hover:border-primary-200 hover:bg-primary-50/20 dark:border-slate-800 dark:hover:border-primary-500/30"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isPending
                        ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300"
                        : submission.status === "Approved"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}
                  >
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                      {submission.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {submission.scope} · {submission.milestone} · Submitted {submission.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <MentorStatusBadge status={submission.status} />
                  <Button
                    variant={isPending ? "default" : "outline"}
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReviewSubmission(submission);
                    }}
                  >
                    <span>{isPending ? "Review Work" : "View Feedback"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Reveal>
            );
          })}

          {!filteredSubmissions.length && (
            <EmptyState
              icon={ClipboardCheck}
              title="Review queue is clear"
              description="Deliverables submitted by interns will immediately appear here for your review."
            />
          )}
        </div>
        <MentorPagination pagination={pager} label="submissions" />
      </SectionCard>
    </div>
  );
}
