"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/lib/theme";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ADMIN_NAV, isActiveRoute } from "./adminNav";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const name = user?.name || "";
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const current = ADMIN_NAV.find((n) => isActiveRoute(pathname, n.url)) || ADMIN_NAV[0];

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-3 backdrop-blur-xl sm:px-5 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger aria-label="Toggle sidebar" className="size-9 rounded-xl text-slate-500 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-400 dark:hover:bg-primary-500/10" />
        <Separator orientation="vertical" className="hidden h-8 sm:block" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base dark:text-white">{current.title}</h1>
          <p className="hidden truncate text-xs text-slate-500 md:block dark:text-slate-400">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle size="icon-lg" />
        <Separator orientation="vertical" className="mx-0.5 hidden h-8 sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" aria-label="Open admin profile" className="flex h-10 items-center gap-2 rounded-xl px-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" />}>
            <Avatar className="size-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-primary-700 text-[11px] font-bold text-white">{initials}</AvatarFallback>
              <AvatarBadge className="bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </Avatar>
            <div className="hidden text-left lg:block">
              <p className="max-w-[130px] truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-60 rounded-2xl border border-slate-200 p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-3">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{name}</p>
                <p className="truncate text-[11px] font-normal text-slate-500">{user?.email}</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logout();
                router.replace("/auth/login");
              }}
              className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-xs text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10"
            >
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
