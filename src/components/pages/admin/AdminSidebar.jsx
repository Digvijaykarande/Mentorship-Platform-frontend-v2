"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAdmin } from "./AdminProvider";
import { ADMIN_NAV, isActiveRoute } from "./adminNav";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { platform } = useAdmin();
  const { setOpenMobile, isMobile } = useSidebar();
  const pending = platform.totals.pendingMentors;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/70 bg-white/95 shadow-[8px_0_30px_-28px_rgba(15,23,42,0.7)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95"
    >
      <SidebarHeader className="h-14 shrink-0 border-b border-slate-200/60 px-3 dark:border-slate-800 group-data-[collapsible=icon]:px-2">
        <div className="flex h-full items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-primary-600 to-slate-950 text-white shadow-lg shadow-violet-500/25">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Loyanox</p>
              <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Admin console</p>
            </div>
          </div>
          <div className="md:hidden">
            <SidebarTrigger className="text-slate-400">
              <X className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white/95 px-3 py-4 dark:bg-slate-950/90 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 group-data-[collapsible=icon]:hidden dark:text-slate-500">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {ADMIN_NAV.map(({ title, url, icon: Icon }) => {
                const active = isActiveRoute(pathname, url);
                const badge = title === "Accounts" ? pending : 0;
                return (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={active}
                      onClick={() => {
                        router.push(url);
                        if (isMobile) setOpenMobile(false);
                      }}
                      className={`h-9 w-full cursor-pointer rounded-lg px-2.5 transition-all duration-200 active:scale-[0.97] group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 ${
                        active
                          ? "bg-gradient-to-r from-primary-50 to-violet-50 font-semibold text-slate-950 ring-1 ring-primary-200/70 hover:from-primary-50 hover:to-violet-50 dark:from-primary-500/15 dark:to-violet-500/10 dark:text-white dark:ring-primary-500/20"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary-600 dark:text-primary-300" : "text-slate-400 dark:text-slate-500"}`} />
                      <span className="truncate text-xs group-data-[collapsible=icon]:hidden">{title}</span>
                      {badge > 0 && (
                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-500/20 px-1.5 text-[10px] font-bold text-secondary-700 group-data-[collapsible=icon]:hidden dark:text-secondary-300">
                          {badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="shrink-0 border-t border-slate-200/60 p-2.5 dark:border-slate-800 group-data-[collapsible=icon]:items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={async () => {
                await logout();
                router.replace("/auth/login");
              }}
              className="h-9 w-full cursor-pointer rounded-lg px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
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
