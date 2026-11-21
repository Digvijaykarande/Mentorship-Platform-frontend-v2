import { CreditCard, HardDrive, LayoutDashboard, UsersRound } from "lucide-react";

export const ADMIN_NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, subtitle: "Platform health at a glance" },
  { title: "Accounts", url: "/admin/mentors", icon: UsersRound, subtitle: "Approve and manage mentor accounts" },
  { title: "Storage", url: "/admin/storage", icon: HardDrive, subtitle: "Where files are kept, plus limits and usage for everyone" },
  { title: "Payments", url: "/admin/payments", icon: CreditCard, subtitle: "Subscriptions, invoices and failed payments" },
];

export const isActiveRoute = (pathname, url) => (url === "/admin" ? pathname === url : pathname === url || pathname.startsWith(`${url}/`));
