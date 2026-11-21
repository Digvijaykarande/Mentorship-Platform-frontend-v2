"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ENTER, enterDelay } from "./sidebarUtils";

export function MenuList({ items, pathname, router, badgeMap = {}, startIndex = 0 }) {
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <SidebarMenu className="gap-1">
      {items.map(([title, url, Icon], idx) => {
        const active =
          url === "/mentor"
            ? pathname === "/mentor"
            : pathname === url || pathname.startsWith(`${url}/`);
        const badgeCount = badgeMap[title] || 0;

        return (
          <SidebarMenuItem
            key={title}
            className={`flex justify-center ${ENTER}`}
            style={enterDelay(startIndex + idx)}
          >
            <SidebarMenuButton
              tooltip={title}
              isActive={active}
              onClick={() => {
                router.push(url);
                if (isMobile) setOpenMobile(false);
              }}
              data-nav-active={active ? "true" : "false"}
              className={`relative z-10 h-9 w-full cursor-pointer rounded-lg px-2.5 transition-all duration-300 ease-out active:scale-[0.97] group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 ${
                active
                  ? "bg-transparent font-semibold text-slate-950 hover:bg-transparent dark:text-white"
                  : "text-slate-600 hover:translate-x-1 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-all duration-200 group-hover/menu-button:-rotate-6 group-hover/menu-button:scale-125 ${
                  active
                    ? "text-primary-600 dark:text-primary-300"
                    : "text-slate-400 group-hover/menu-button:text-primary-500 dark:text-slate-500"
                }`}
              />
              <span className="truncate text-xs transition-transform duration-300 group-data-[collapsible=icon]:hidden">
                {title}
              </span>

              {badgeCount > 0 ? (
                <span
                  key={badgeCount}
                  className="relative ml-auto flex h-4 min-w-4 animate-in zoom-in-50 items-center justify-center rounded-full bg-secondary-500/20 px-1.5 text-[10px] font-bold text-secondary-700 duration-300 group-data-[collapsible=icon]:hidden motion-reduce:animate-none dark:bg-secondary-500/20 dark:text-secondary-300"
                >
                  <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-secondary-400/40 [animation-duration:2.4s] motion-reduce:hidden" />
                  {badgeCount}
                </span>
              ) : active ? (
                <span className="ml-auto h-1.5 w-1.5 animate-in zoom-in-0 rounded-full bg-primary-500 duration-300 group-data-[collapsible=icon]:hidden motion-reduce:animate-none" />
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function Section({ title, children, index = 0 }) {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        style={enterDelay(index)}
        className={`${ENTER} mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 group-data-[collapsible=icon]:hidden`}
      >
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>{children}</SidebarGroupContent>
    </SidebarGroup>
  );
}
