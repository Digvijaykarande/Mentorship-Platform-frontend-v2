"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import FilterTabs from "@/components/common/FilterTabs";
import MentorStatCard from "../MentorStatCard";
import { MentorPagination, usePagination } from "../MentorPagination";
import { Toolbar, EmptyState, MentorSection as SectionCard } from "../MentorCommon";
import FeedbackAccordionItem from "./feedback/FeedbackAccordionItem";

export default function MentorFeedback({ snapshot, onGiveFeedback, onRespondFeedback }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const feedback = snapshot.feedback;

  const counts = {
    actionRequired: feedback.filter((f) => f.status === "Action Required").length,
    inReview: feedback.filter((f) => f.status === "In Review").length,
    resolved: feedback.filter((f) => f.status === "Resolved").length,
    requests: feedback.filter((f) => f.isRequest).length,
  };

  const filteredFeedback = feedback.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "requests"
          ? Boolean(item.isRequest)
          : filter === "action-required"
            ? item.status === "Action Required"
            : filter === "in-review"
              ? item.status === "In Review"
              : item.status === "Resolved";

    const matchesSearch =
      `${item.title} ${item.mentor} ${item.mentee || ""} ${item.category} ${item.summary || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pager = usePagination(filteredFeedback, `${search}|${filter}`);

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + Number(f.rating || 5), 0) / feedback.length).toFixed(1)
    : "0.0";

  const filterOptions = [
    { value: "all", label: "All", count: feedback.length },
    { value: "requests", label: "Requests", count: counts.requests },
    { value: "action-required", label: "Action required", count: counts.actionRequired },
    { value: "in-review", label: "In review", count: counts.inReview },
    { value: "resolved", label: "Resolved", count: counts.resolved },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero icon={MessageSquare} badge="Mentorship Hub" title="Coach with clear, timely feedback." description="Review coaching signals and respond to intern requests.">
        <Button onClick={onGiveFeedback} className={MENTOR_HERO_BTN}>
          <Plus className="h-4 w-4" /> Give feedback
        </Button>
      </MentorHero>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MentorStatCard
          index={1}
          icon={AlertCircle}
          label="Action required"
          value={counts.actionRequired}
          tone="rose"
          trendLabel="follow-ups & blockers"
          trendDirection={counts.actionRequired ? "down" : "up"}
        />
        <MentorStatCard
          index={2}
          icon={Clock}
          label="In review"
          value={counts.inReview}
          tone="amber"
          trendLabel="awaiting a response"
        />
        <MentorStatCard
          index={3}
          icon={CheckCircle2}
          label="Resolved"
          value={counts.resolved}
          tone="emerald"
          trendLabel="milestones concluded"
        />
        <MentorStatCard
          index={4}
          icon={Star}
          label="Avg. rating"
          value={avgRating}
          tone="indigo"
          trendLabel={`across ${feedback.length} records`}
        />
      </div>

      <SectionCard revealIndex={5}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search by topic, intern or mentor…"
        >
          <FilterTabs value={filter} onChange={setFilter} options={filterOptions} />
        </Toolbar>

        <div className="mt-4 space-y-2.5">
          {pager.pageItems.map((item, i) => (
            <FeedbackAccordionItem
              key={item.id}
              item={item}
              index={i}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              onRespondFeedback={onRespondFeedback}
            />
          ))}

          {!filteredFeedback.length && (
            <EmptyState
              icon={MessageSquare}
              title="No feedback records match"
              description="Feedback published by mentors or requested by interns will appear here."
            />
          )}
        </div>
        <MentorPagination pagination={pager} label="feedback records" />
      </SectionCard>
    </div>
  );
}
