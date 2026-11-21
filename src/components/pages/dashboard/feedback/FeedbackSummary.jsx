"use client";

import { MessageSquareText, TrendingUp, AlertCircle, Star } from "lucide-react";
import MiniStatCard from "@/components/common/MiniStatCard";
import { Button } from "@/components/ui/button";

export default function FeedbackSummary({ summary, onFilterStatus }) {
  const { total = 0, newFeedback = 0, actionRequired = 0, average = "0.0" } = summary || {};

  const cards = [
    { icon: MessageSquareText, label: "Total Feedback", value: total, tone: "blue", onClick: () => onFilterStatus(null) },
    { icon: TrendingUp, label: "In Review", value: newFeedback, tone: "indigo", onClick: () => onFilterStatus("In Review") },
    { icon: AlertCircle, label: "Action Required", value: actionRequired, tone: "amber", onClick: () => onFilterStatus("Action Required") },
    { icon: Star, label: "Avg Rating", value: `${average}/5`, tone: "emerald" },
  ];

  return (
    <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ onClick, ...card }) => (
        <Button
          key={card.label}
          type="button"
          variant="ghost"
          onClick={onClick}
          disabled={!onClick}
          className="h-auto w-full p-0 font-normal justify-start block text-left rounded-xl hover:bg-transparent disabled:opacity-100 disabled:cursor-default"
        >
          <MiniStatCard {...card} />
        </Button>
      ))}
    </div>
  );
}
