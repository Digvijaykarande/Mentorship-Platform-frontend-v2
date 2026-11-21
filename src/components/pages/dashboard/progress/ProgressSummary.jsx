"use client";

import { ChartNoAxesCombined, CheckCircle2, Flame, Target } from "lucide-react";

import MiniStatCard from "@/components/common/MiniStatCard";

export default function ProgressSummary({ data }) {
  const { AVERAGE_RATING, INTERNSHIP, ON_TIME_RATE, OVERALL_PROGRESS, TASKS, WEEKLY_PROGRESS } = data;
  const recent = WEEKLY_PROGRESS.slice(-5);
  const gain = recent.length > 1 ? recent[recent.length - 1].completion - recent[0].completion : 0;
  const cards = [
    {
      icon: ChartNoAxesCombined,
      label: "Overall completion",
      value: `${OVERALL_PROGRESS}%`,
      tone: "indigo",
      trend: gain > 0 ? `+${gain}%` : undefined,
      trendLabel: gain > 0 ? "last 4 weeks" : "since you started",
      spark: WEEKLY_PROGRESS.map((w) => w.completion),
    },
    {
      icon: CheckCircle2,
      label: "Tasks completed",
      value: TASKS.completed,
      tone: "emerald",
      trendLabel: `${TASKS.total - TASKS.completed} still open`,
      spark: WEEKLY_PROGRESS.map((w) => w.tasks),
    },
    {
      icon: Flame,
      label: "On-time delivery",
      value: TASKS.completed ? `${ON_TIME_RATE}%` : "—",
      tone: "amber",
      trendLabel: "Consistency is key",
    },
    {
      icon: Target,
      label: "Mentor rating",
      value: AVERAGE_RATING ? `${AVERAGE_RATING}/5` : "—",
      tone: "violet",
      trendLabel: `Week ${INTERNSHIP.currentWeek}`,
    },
  ];
  return (
    <section className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <MiniStatCard key={card.label} {...card} />
      ))}
    </section>
  );
}