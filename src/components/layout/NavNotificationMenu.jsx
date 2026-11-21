"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/NotificationsProvider";

const NOTIFICATIONS_PATH = "/dashboard/notification";
const ACCENT_COLORS = {
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  amber: "bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const btnClass =
  "h-9 w-9 cursor-pointer rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

export default function NavNotificationMenu({ router }) {
  const { notifications, unreadCount, toggleRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const visible = notifications.filter((n) => (filter === "unread" ? n.unread : true));

  const goToNotifications = () => {
    setOpen(false);
    router.push(NOTIFICATIONS_PATH);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg" type="button" aria-label="Notifications" className={`${btnClass} relative`}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-950">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                {unreadCount} new
              </span>
            )}
          </span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={markAllRead}
              className="h-auto p-0 text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-transparent dark:text-blue-400"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="flex gap-1 border-b border-slate-100 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800/80 dark:bg-slate-900/30">
          {["all", "unread"].map((f) => (
            <Button
              key={f}
              variant="ghost"
              size="xs"
              onClick={() => setFilter(f)}
              className={`h-auto rounded-md px-2 py-0.5 text-[10px] capitalize transition ${
                filter === f
                  ? "bg-white font-semibold text-slate-900 shadow-xs hover:bg-white dark:bg-slate-800 dark:text-white dark:hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              {f} ({f === "all" ? notifications.length : unreadCount})
            </Button>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
          {visible.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-slate-400">
              {filter === "unread" ? "No unread notifications" : "You're all caught up"}
            </p>
          )}
          {visible.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={goToNotifications}
                className={`group flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition ${
                  !item.unread
                    ? "opacity-60 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    : "bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ACCENT_COLORS[item.accent] || ACCENT_COLORS.blue}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    {item.unread && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">{item.description}</p>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  aria-label={item.unread ? "Mark as read" : "Mark as unread"}
                  onClick={(e) => { e.stopPropagation(); toggleRead(item.id); }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="p-2 border-t border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/50">
          <Button variant="ghost" onClick={goToNotifications} className="h-7 w-full text-xs font-semibold text-slate-600 dark:text-slate-300">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
