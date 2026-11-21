"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Search, FileText } from "lucide-react";
import { initialsOf, statusTone } from "./mentorData";
import { cn } from "@/lib/utils";
import { Reveal, useInView, useRevealed } from "./MentorMotion";

export { Field, FormError } from "./MentorForm";

export function MentorStatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-0 px-2.5 py-0.5 text-[11px] font-semibold",
        statusTone(status),
        className
      )}
    >
      {status}
    </Badge>
  );
}

export function Pill({ children, status, className }) {
  return <MentorStatusBadge status={status || children} className={className} />;
}

export function MentorAvatar({ name, tone = "bg-primary-600", className }) {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarFallback className={cn(tone, "text-[10px] font-bold text-white")}>
        {initialsOf(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function MentorProgressBar({ value, tone = "bg-primary-500", className, delay = 200 }) {
  const safeVal = Math.min(100, Math.max(0, value || 0));
  // Mount at 0 and grow to the real value once the bar scrolls into view.
  const [shown, setShown] = useState(0);
  const parentInView = useRevealed();
  const [ref, ownInView] = useInView(parentInView === null);
  const active = parentInView === null ? ownInView : parentInView;

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => setShown(safeVal), delay);
    return () => clearTimeout(timer);
  }, [active, safeVal, delay]);

  return (
    <Progress ref={ref} value={shown} className={cn("gap-0", className)}>
      <ProgressTrack className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
        <ProgressIndicator
          className={cn(
            "rounded-full duration-1000 ease-out motion-reduce:transition-none",
            tone
          )}
        />
      </ProgressTrack>
    </Progress>
  );
}

export function Toolbar({ search, setSearch, placeholder = "Search records...", children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100/80 pb-4 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          className="h-10 rounded-xl border-slate-200/80 bg-slate-50/80 pl-9 text-[13px] shadow-none transition focus-visible:border-primary-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-950/60 dark:focus-visible:bg-slate-900"
        />
      </div>
      {children && <div className="max-w-full overflow-x-auto">{children}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon = FileText, title, description, action }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-6 text-center dark:border-slate-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Mentor card wrapper. Unlike the shared SectionCard it has no hidden default padding,
 * renders a header only when there is something to show, and keeps one consistent
 * inner padding so every mentor page lines up.
 */
export function MentorSection({
  icon: Icon,
  iconClassName = "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  revealIndex = 0,
}) {
  const hasHeader = Boolean(Icon || title || action);
  return (
    <Reveal
      as={Card}
      index={revealIndex}
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-20px_rgba(15,23,42,0.45)] dark:border-slate-800/70 dark:bg-slate-900/70 text-inherit text-[length:inherit]",
        className
      )}
    >
      {hasHeader && (
        <CardHeader className="flex items-center justify-between gap-3 rounded-none border-b border-slate-100/80 bg-gradient-to-r from-slate-50/90 to-white px-4 py-3 sm:px-5 [.border-b]:pb-3 dark:border-slate-800/60 dark:from-slate-900/70 dark:to-slate-900/30">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10",
                  iconClassName
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("p-4 sm:p-5", contentClassName)}>{children}</CardContent>
    </Reveal>
  );
}
