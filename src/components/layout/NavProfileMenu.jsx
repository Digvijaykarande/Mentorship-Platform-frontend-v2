"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const profileItems = [
  { label: "My Profile", icon: User, path: "/dashboard/profile" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function NavProfileMenu({ router }) {
  const { user, logout } = useAuth();
  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();
  const firstName = (user?.name || "").split(" ")[0];
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="unstyled"
            type="button"
            aria-label="Account menu"
            className="group relative ml-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all group-hover:ring-slate-200 group-data-popup-open:ring-slate-900/10 dark:group-hover:ring-slate-700 dark:group-data-popup-open:ring-white/10">
              <AvatarFallback className="bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                {initial}
              </AvatarFallback>
            </Avatar>
            <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={10} className="w-52 rounded-2xl p-1.5 dark:border-slate-800">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2.5 px-2 py-2 font-normal">
            <Avatar size="sm">
              <AvatarFallback className="bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{firstName}</p>
              <p className="truncate text-[10px] text-slate-400">{roleLabel}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {profileItems.map(({ label, icon: Icon, path }) => (
          <DropdownMenuItem
            key={label}
            onClick={() => router.push(path)}
            className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-medium"
          >
            <Icon className="mr-2 h-3.5 w-3.5 text-slate-500" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
