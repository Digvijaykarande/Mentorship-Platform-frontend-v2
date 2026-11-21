import Link from "next/link";
import { CalendarClock, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/common/SectionCard";
import MetricBar from "@/components/common/MetricBar";

export default function OverviewSidebar({
  mentorName,
  mentorTime,
  mentorQuote,
  completedTasks,
  totalTasks,
  inProgressTasks,
  pendingTasks,
  overdueTasks,
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={MessageSquare}
        title="Latest mentor feedback"
        iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary-600 text-xs font-semibold text-white">
              {mentorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {mentorName}
              </p>
              <Badge variant="outline" className="text-[10px]">
                {mentorTime}
              </Badge>
            </div>
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              &ldquo;{mentorQuote}&rdquo;
            </p>
          </div>
        </div>
        <Link href="/dashboard/feedback" className="mt-2 inline-block">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
          >
            Read all feedback
          </Button>
        </Link>
      </SectionCard>

      <SectionCard
        icon={CalendarClock}
        title="Task breakdown"
        iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      >
        <div className="space-y-4">
          <MetricBar
            label="Completed"
            value={Math.round((completedTasks / totalTasks) * 100)}
            display={`${completedTasks}`}
            tone="emerald"
          />
          <MetricBar
            label="In progress"
            value={Math.round((inProgressTasks / totalTasks) * 100)}
            display={`${inProgressTasks}`}
            tone="indigo"
          />
          <MetricBar
            label="Pending"
            value={Math.round((pendingTasks / totalTasks) * 100)}
            display={`${pendingTasks}`}
            tone="amber"
          />
          {overdueTasks > 0 && (
            <MetricBar
              label="Overdue"
              value={Math.round((overdueTasks / totalTasks) * 100)}
              display={`${overdueTasks}`}
              tone="rose"
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}
