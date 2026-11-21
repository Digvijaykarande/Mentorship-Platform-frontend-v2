"use client";

import { useRouter } from "next/navigation";
import { LogOut, PanelLeft, Settings } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@/components/ui/avatar";
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

export default function MentorProfileDropdown({ displayName, initials, roleLabel, email, onLogout }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Open mentor profile"
            className="group flex h-10 items-center gap-2 rounded-xl px-1.5 transition-colors hover:bg-slate-100 sm:gap-2.5 sm:px-2 dark:hover:bg-slate-800"
          />
        }
      >
        <Avatar className="size-8 shrink-0 ring-2 ring-white transition-all group-hover:ring-primary-100 sm:size-9 dark:ring-slate-950 dark:group-hover:ring-primary-900">
          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-violet-700 text-[11px] font-bold text-white">
            {initials}
          </AvatarFallback>
          <AvatarBadge className="bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
        </Avatar>

        <div className="hidden min-w-0 text-left lg:block">
          <p className="max-w-[130px] truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
            {displayName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{roleLabel}</p>
        </div>

        <span className="hidden text-slate-400 lg:block">
          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-60 rounded-2xl border border-slate-200 p-2 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-violet-700 text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-[11px] font-normal text-slate-500">{email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-xs"
        >
          <PanelLeft className="size-4 text-slate-500" />
          Switch to Intern View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/mentor/settings")}
          className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-xs"
        >
          <Settings className="size-4 text-slate-500" />
          Mentor Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-xs text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
