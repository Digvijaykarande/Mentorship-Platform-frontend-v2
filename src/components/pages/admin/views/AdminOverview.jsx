"use client";

import Link from "next/link";
import { ArrowRight, HardDrive, ShieldCheck, UserCheck, UsersRound, GraduationCap, Wallet } from "lucide-react";
import MentorHero from "../../mentor/MentorHero";
import MentorStatCard from "../../mentor/MentorStatCard";
import { MentorAvatar, MentorSection as Section, EmptyState } from "../../mentor/MentorCommon";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../AdminProvider";
import { DemoNote, Loaded, UsageBar } from "../AdminBits";
import { useStorage } from "@/lib/storage";
import { formatBytes } from "@/lib/attachments";
import { formatMoney } from "../adminData";

export default function AdminOverview() {
  const { platform, users, approve } = useAdmin();
  const { totals } = platform;
  const { users: storageUsers } = useStorage();
  const storageUsed = storageUsers.reduce((s, u) => s + u.bytes, 0);
  const storageLimited = storageUsers.filter((u) => u.quotaBytes !== null);
  const storageAllocated = storageLimited.reduce((s, u) => s + u.quotaBytes, 0);
  const pending = users.filter((u) => u.role === "mentor" && u.isActive && !u.isApproved);
  const attention = storageUsers.filter((u) => u.level !== "ok").sort((a, b) => b.percent - a.percent);

  return (
    <Loaded>
      <MentorHero
        badge="Admin console"
        icon={ShieldCheck}
        title="Run the platform, not the projects."
        description="Approve mentors, keep an eye on storage and make sure payments are healthy. Mentors take it from there."
      >
        <Link href="/admin/mentors" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-slate-950 shadow-lg shadow-black/10 hover:bg-primary-50">
          <UserCheck className="h-4 w-4" /> Review accounts
        </Link>
      </MentorHero>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MentorStatCard icon={UsersRound} label="Active mentors" value={totals.activeMentors} tone="indigo" trendLabel={`${totals.pendingMentors} awaiting approval`} index={0} />
        <MentorStatCard icon={GraduationCap} label="Interns" value={totals.interns} tone="emerald" trendLabel="Across all mentors" index={1} />
        <MentorStatCard icon={HardDrive} label="Storage used" value={formatBytes(storageUsed)} tone="violet" trendLabel={`of ${formatBytes(storageAllocated)} allocated`} index={2} />
        <MentorStatCard icon={Wallet} label="Monthly revenue" value={formatMoney(totals.mrr)} tone="amber" trendLabel={`${totals.failedPayments} failed · ${totals.pendingPayments} pending`} index={3} />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Section
          className="xl:col-span-3"
          icon={UserCheck}
          title="Waiting for approval"
          description="Mentors cannot sign in until you approve them"
          action={<Link href="/admin/mentors" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-300">All accounts <ArrowRight className="h-3.5 w-3.5" /></Link>}
        >
          {pending.length === 0 ? (
            <EmptyState icon={UserCheck} title="Nothing waiting" description="New mentor sign-ups will show up here." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {pending.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <MentorAvatar name={m.name} tone="bg-linear-to-br from-violet-500 to-primary-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="truncate text-xs text-slate-500">{m.email}</p>
                  </div>
                  <Button size="sm" className="h-8 rounded-lg text-xs" onClick={() => approve(m.id).catch(() => {})}>Approve</Button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section className="xl:col-span-2" icon={HardDrive} iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300" title="Needs attention" description="People close to their storage limit" action={<Link href="/admin/storage" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-300">Manage <ArrowRight className="h-3.5 w-3.5" /></Link>}>
          {attention.length === 0 ? (
            <EmptyState icon={HardDrive} title="All healthy" description="Nobody is close to their storage limit." />
          ) : (
            <ul className="space-y-3">
              {attention.slice(0, 5).map((u) => (
                <li key={u.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{u.name} <span className="font-normal text-slate-400">· {u.role}</span></p>
                    <span className="text-[11px] font-semibold text-slate-500">{Math.round(u.percent)}%</span>
                  </div>
                  <UsageBar percent={u.percent} />
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <DemoNote />
    </Loaded>
  );
}
