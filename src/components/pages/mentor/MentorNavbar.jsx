
"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/lib/theme";
import { useMentorSnapshot } from "./MentorProvider";
import MentorNotificationDropdown from "./navbar/MentorNotificationDropdown";
import MentorProfileDropdown from "./navbar/MentorProfileDropdown";

const META = {
  "/mentor": ["Overview", "Your organization at a glance"],
  "/mentor/interns": ["Interns", "Monitor progress, tracks, and assignments"],
  "/mentor/projects": ["Projects", "Track delivery across every workstream"],
  "/mentor/tasks": ["Tasks", "Manage execution and overdue deliverables"],
  "/mentor/submissions": ["Submissions", "Review and approve deliverables"],
  "/mentor/feedback": ["Feedback", "Review mentor feedback and requests"],
  "/mentor/storage": ["Storage", "Your space, your interns' space and limits"],
  "/mentor/settings": ["Settings", "Manage organization preferences"],
};

export default function MentorNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user?.name || "";
  const initials = displayName.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const roleLabel = "Mentor";

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const [title, subtitle] = META[pathname] || META["/mentor"];
  const snapshot = useMentorSnapshot();

  const pendingSubmissions = (snapshot?.submissions || []).filter(
    (s) => s.status === "Pending" || s.status === "Under Review"
  );
  const pendingCount = pendingSubmissions.length;

  return (
    <header className="sticky top-0 z-40 w-full shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90" style={{ height: "9vh" }}>
      <div className="flex w-full items-center justify-between gap-3 px-3 sm:h-[72px] sm:px-5 lg:px-8" style={{ height: "9vh" }}>

        {/* Left: Sidebar and page information */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-400 dark:hover:border-primary-500/20 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
          />

          <Separator orientation="vertical" className="hidden h-8 sm:block" />

          <div className="min-w-0 space-y-0.5">
            <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base dark:text-white">
              {title}
            </h1>
            <p className="hidden max-w-[420px] truncate text-xs leading-4 text-slate-500 md:block dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <MentorNotificationDropdown
            pendingSubmissions={pendingSubmissions}
            pendingCount={pendingCount}
          />

          <div className="flex size-9 items-center justify-center sm:size-10">
            <ThemeToggle size="icon-lg" />
          </div>

          <Separator orientation="vertical" className="mx-0.5 hidden h-8 sm:block" />

          <MentorProfileDropdown
            displayName={displayName}
            initials={initials}
            roleLabel={roleLabel}
            email={user?.email}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
