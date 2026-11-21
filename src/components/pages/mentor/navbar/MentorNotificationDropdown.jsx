"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function MentorNotificationDropdown({ pendingSubmissions, pendingCount }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Pending reviews: ${pendingCount}`}
            className="relative size-9 rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:size-10 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          />
        }
      >
        <Bell className="size-[18px]" />
        {pendingCount > 0 && (
          <span className="absolute right-1 top-1 flex min-h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-bold leading-none text-white dark:border-slate-950">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(340px,calc(100vw-24px))] rounded-2xl border border-slate-200 p-2 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2 px-3 py-2.5">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
              <p className="text-[11px] font-normal text-slate-500">Your review queue</p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary-100 bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-300"
            >
              {pendingCount} pending
            </Badge>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {pendingSubmissions.length > 0 ? (
          <div className="max-h-64 space-y-1 overflow-y-auto py-1">
            {pendingSubmissions.slice(0, 5).map((sub) => (
              <DropdownMenuItem
                key={sub.id}
                onClick={() => router.push("/mentor/submissions")}
                className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 focus:bg-primary-50 dark:focus:bg-primary-500/10"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400">
                  <CheckCircle2 className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {sub.title}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {sub.scope} · {sub.milestone}
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-[10px] text-slate-400">Review</span>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">All caught up!</p>
            <p className="text-[11px] text-slate-500">No submissions are waiting for review.</p>
          </div>
        )}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => router.push("/mentor/submissions")}
          className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-primary-600 focus:bg-primary-50 dark:text-primary-400 dark:focus:bg-primary-500/10"
        >
          View all submissions
          <ArrowRight className="size-3.5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
