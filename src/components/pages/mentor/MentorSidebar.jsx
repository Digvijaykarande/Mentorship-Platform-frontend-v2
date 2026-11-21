"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  FolderKanban,
  HardDrive,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MessageSquare,
  PanelLeft,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMentorSnapshot } from "./MentorProvider";
import { useSlidingPill, ENTER, enterDelay } from "./sidebar/sidebarUtils";
import { MenuList, Section } from "./sidebar/SidebarMenuList";

const PLATFORM = [
  ["Overview", "/mentor", LayoutDashboard],
  ["Interns", "/mentor/interns", Users],
  ["Projects", "/mentor/projects", FolderKanban],
  ["Tasks", "/mentor/tasks", ListTodo],
  ["Submissions", "/mentor/submissions", ClipboardCheck],
  ["Feedback", "/mentor/feedback", MessageSquare],
];

const SYSTEM = [
  ["Storage", "/mentor/storage", HardDrive],
  ["Settings", "/mentor/settings", Settings],
];

export default function MentorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();
  const snapshot = useMentorSnapshot();
  const navRef = useRef(null);
  const pill = useSlidingPill(navRef, pathname);
  const [pillReady, setPillReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPillReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  const badgeMap = {
    Submissions: snapshot?.pendingReviews ?? 0,
    Feedback: (snapshot?.feedback || []).filter((f) => f.isRequest && f.status !== "Resolved").length,
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/70 bg-white/95 shadow-[8px_0_30px_-28px_rgba(15,23,42,0.7)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95"
    >
      <SidebarHeader className="h-14 shrink-0 border-b border-slate-200/60 bg-white/95 px-3 dark:border-slate-800 dark:bg-slate-950/90 group-data-[collapsible=icon]:px-2">
        <div className="flex h-full items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 animate-in zoom-in-50 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-violet-600 to-slate-950 text-sm font-bold text-white shadow-lg shadow-primary-500/25 duration-500 transition-transform hover:rotate-6 hover:scale-105 motion-reduce:animate-none">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div style={enterDelay(0)} className={`${ENTER} group-data-[collapsible=icon]:hidden`}>
              <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Loyanox</p>
              <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Mentor command center</p>
            </div>
          </div>
          <div className="md:hidden">
            <SidebarTrigger className="text-slate-400">
              <X className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4 bg-white/95 px-3 py-4 dark:bg-slate-950/90 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div ref={navRef} className="relative flex w-full flex-col gap-4 group-data-[collapsible=icon]:items-center">
          {/* Sliding active highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-gradient-to-r from-primary-50 to-violet-50 shadow-sm ring-1 ring-primary-200/70 transition-[transform,width,height,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none dark:from-primary-500/15 dark:to-violet-500/10 dark:ring-primary-500/20"
            style={{
              width: pill?.w ?? 0,
              height: pill?.h ?? 0,
              opacity: pill && pillReady ? 1 : 0,
              transitionProperty: pill?.instant ? "opacity" : undefined,
              transform: `translate(${pill?.x ?? 0}px, ${pill?.y ?? 0}px)`,
            }}
          >
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-600 group-data-[collapsible=icon]:hidden" />
          </span>

          <Section title="Platform" index={0}>
            <MenuList
              items={PLATFORM}
              pathname={pathname}
              router={router}
              badgeMap={badgeMap}
              startIndex={1}
            />
          </Section>

          <SidebarSeparator className="mx-0 my-0 group-data-[collapsible=icon]:w-8" />

          <Section title="System" index={PLATFORM.length + 1}>
            <MenuList
              items={SYSTEM}
              pathname={pathname}
              router={router}
              badgeMap={badgeMap}
              startIndex={PLATFORM.length + 2}
            />
          </Section>
        </div>
      </SidebarContent>

      <SidebarFooter className="shrink-0 border-t border-slate-200/60 bg-white/95 p-2.5 dark:border-slate-800 dark:bg-slate-950/90 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem className={ENTER} style={enterDelay(PLATFORM.length + 4)}>
            <SidebarMenuButton
              tooltip="Switch to Intern View"
              onClick={() => {
                router.push("/dashboard");
                if (isMobile) setOpenMobile(false);
              }}
              className="h-9 transition-all duration-200 hover:translate-x-0.5 active:scale-[0.98] w-full cursor-pointer rounded-lg px-2.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <PanelLeft className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">View Intern Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className={ENTER} style={enterDelay(PLATFORM.length + 5)}>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => router.push("/auth/login")}
              className="h-9 transition-all duration-200 hover:translate-x-0.5 active:scale-[0.98] w-full cursor-pointer rounded-lg px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
