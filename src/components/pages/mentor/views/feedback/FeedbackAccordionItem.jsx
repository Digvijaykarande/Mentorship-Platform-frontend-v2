import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Reply,
  Star,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorAvatar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";
import { cn } from "@/lib/utils";

export default function FeedbackAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  onRespondFeedback,
}) {
  const isRequest = Boolean(item.isRequest);
  const isPendingRequest = isRequest && item.status !== "Resolved";
  const strengths = item.strengths || [];
  const improvements = item.improvements || [];
  const hasDetails = strengths.length > 0 || improvements.length > 0;
  const intern = item.mentee || "Alex Rivera";

  return (
    <Reveal
      index={index}
      delay={150}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition duration-200 dark:bg-slate-900/40",
        isOpen
          ? "border-primary-200 shadow-lg shadow-primary-500/5 dark:border-primary-500/30"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700",
        isPendingRequest && !isOpen && "border-secondary-200/80 bg-secondary-50/30 dark:border-secondary-500/20 dark:bg-secondary-500/5"
      )}
    >
      <Button
        variant="unstyled"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
      >
        <MentorAvatar
          name={isRequest ? intern : item.mentor}
          tone={
            isRequest
              ? "bg-linear-to-br from-secondary-500 to-orange-500"
              : "bg-linear-to-br from-primary-500 to-violet-600"
          }
          className="h-10 w-10 text-xs shadow-sm"
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {item.title}
            </span>
            {isRequest && (
              <span className="shrink-0 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-bold text-secondary-700 dark:bg-secondary-500/15 dark:text-secondary-300">
                Request
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
            {item.summary}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-bold tabular-nums text-secondary-700 sm:inline-flex dark:bg-secondary-500/10 dark:text-secondary-300">
            <Star className="h-3 w-3 fill-secondary-400 text-secondary-400" />
            {Number(item.rating || 5).toFixed(1)}
          </span>
          <MentorStatusBadge status={item.status} />
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              isOpen && "rotate-180 text-primary-500"
            )}
          />
        </span>
      </Button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 space-y-4 border-t border-dashed border-slate-200 bg-slate-50/50 px-4 py-4 duration-200 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {item.mentor}
              <ArrowRight className="h-3 w-3 text-slate-400" />
              {intern}
            </span>
            {item.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <Tag className="h-3 w-3 text-slate-400" />
                {item.category}
              </span>
            )}
            {item.date && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                {item.date}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.summary}
          </p>

          {hasDetails && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Strengths
                </p>
                <ul className="mt-2 space-y-1.5">
                  {strengths.length === 0 && (
                    <li className="text-xs text-slate-400">None noted</li>
                  )}
                  {strengths.map((str, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary-200/70 bg-primary-50/40 p-3 dark:border-primary-500/20 dark:bg-primary-500/5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                  Improvements
                </p>
                <ul className="mt-2 space-y-1.5">
                  {improvements.length === 0 && (
                    <li className="text-xs text-slate-400">None noted</li>
                  )}
                  {improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {isPendingRequest && onRespondFeedback && (
            <Button
              size="sm"
              onClick={() => onRespondFeedback(item)}
              className="h-8 gap-1.5 rounded-lg text-xs"
            >
              <Reply className="h-3.5 w-3.5" /> Respond
            </Button>
          )}
        </div>
      )}
    </Reveal>
  );
}
