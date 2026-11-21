"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/lib/theme";
import NavNotificationMenu from "./NavNotificationMenu";
import NavProfileMenu from "./NavProfileMenu";

const PAGE_META = {
  "/dashboard": { title: "Overview", subtitle: "Welcome back to Loyanox Mentor" },
  "/dashboard/my-projects": { title: "My Projects", subtitle: "Track your sprints and milestones" },
  "/dashboard/tasks": { title: "Tasks", subtitle: "Manage your assigned tasks" },
  "/dashboard/submit-work": { title: "Submit Work", subtitle: "Share your work with your mentor" },
  "/dashboard/feedback": { title: "Feedback", subtitle: "Mentor reviews and suggestions" },
  "/dashboard/progress": { title: "Progress", subtitle: "Your internship progress at a glance" },
  "/dashboard/notification": { title: "Notifications", subtitle: "Stay on top of your updates" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account preferences" },
  "/dashboard/storage": { title: "Storage", subtitle: "Your space, files and limits" },
  "/dashboard/profile": { title: "Profile", subtitle: "Your personal profile" },
};

const btnClass =
  "h-9 w-9 cursor-pointer rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isSearchExpanded = isSearchFocused || searchValue.length > 0;
  const pageMeta = PAGE_META[pathname] ?? { title: "Dashboard", subtitle: "Welcome back to Loyanox Mentor" };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center border-b border-slate-200/80 bg-white/95 px-2 pr-3 backdrop-blur-xl sm:px-2 md:px-2 md:pr-3 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <SidebarTrigger className={btnClass} />
          <Separator orientation="vertical" className="hidden h-6 sm:block dark:bg-slate-800" />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-950 dark:text-white">{pageMeta.title}</h1>
            <p className="hidden truncate text-[10px] text-slate-400 md:block">{pageMeta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden h-9 md:block md:w-56 lg:w-64">
            <div
              className={`absolute right-0 top-0 flex h-9 items-center transition-[width] duration-300 ease-in-out ${
                isSearchExpanded ? "w-[28rem]" : "w-40 lg:w-56"
              }`}
            >
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search..."
                className={`h-9 w-full rounded-xl border-slate-200/80 bg-slate-50 pl-9 text-xs transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
                  isSearchExpanded
                    ? "border-slate-300 bg-white shadow-sm ring-2 ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
                    : ""
                }`}
              />
              <Search
                className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
                  isSearchExpanded ? "text-slate-600 dark:text-slate-300" : "text-slate-400"
                }`}
              />
            </div>
          </div>

          <Button variant="ghost" size="icon-lg" type="button" aria-label="Search" className={`${btnClass} md:hidden`}>
            <Search className="h-4 w-4" />
          </Button>

          <NavNotificationMenu router={router} />
          <ThemeToggle size="icon-lg" />
          <Separator orientation="vertical" className="hidden h-6 sm:block dark:bg-slate-800" />
          <NavProfileMenu router={router} />
        </div>
      </div>
    </header>
  );
}
