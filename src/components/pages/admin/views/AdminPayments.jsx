"use client";

import { AlertTriangle, CreditCard, Receipt, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MentorStatCard from "../../mentor/MentorStatCard";
import { MentorSection as Section, EmptyState } from "../../mentor/MentorCommon";
import { MentorPagination, usePagination } from "../../mentor/MentorPagination";
import { useAdmin } from "../AdminProvider";
import { DemoNote, Loaded, StatusPill } from "../AdminBits";
import { formatDay, formatMoney } from "../adminData";

export default function AdminPayments() {
  const { platform } = useAdmin();
  const { invoices, totals, rows } = platform;
  const pager = usePagination(invoices);
  const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);

  return (
    <Loaded>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MentorStatCard icon={Wallet} label="Monthly recurring" value={formatMoney(totals.mrr)} tone="emerald" trendLabel="Active subscriptions" index={0} />
        <MentorStatCard icon={Receipt} label="Collected" value={formatMoney(paid)} tone="indigo" trendLabel="Last 3 months" index={1} />
        <MentorStatCard icon={CreditCard} label="Pending" value={totals.pendingPayments} tone="amber" trendLabel="Awaiting payment" index={2} />
        <MentorStatCard icon={AlertTriangle} label="Failed" value={totals.failedPayments} tone="rose" trendLabel="Need follow-up" index={3} />
      </div>

      <Section icon={Receipt} title="Invoices" description={`${rows.filter((r) => r.price > 0).length} paying mentors`}>
        {invoices.length === 0 ? (
          <EmptyState icon={Receipt} title="No invoices yet" description="Invoices appear once mentors are on a paid plan." />
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[560px] text-left text-sm">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800">
                  <TableHead className="h-auto text-inherit py-2 pr-3 font-semibold pl-0">Invoice</TableHead>
                  <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Mentor</TableHead>
                  <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Plan</TableHead>
                  <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Date</TableHead>
                  <TableHead className="h-auto text-inherit px-3 py-2 text-right font-semibold">Amount</TableHead>
                  <TableHead className="h-auto text-inherit py-2 pl-3 text-right font-semibold pr-0">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pager.pageItems.map((inv) => (
                  <TableRow key={`${inv.mentor.id}-${inv.id}`} className="hover:bg-transparent">
                    <TableCell className="whitespace-normal py-3 pr-3 font-mono text-xs text-slate-500 pl-0">{inv.id}</TableCell>
                    <TableCell className="whitespace-normal px-3 py-3 font-semibold text-slate-900 dark:text-white">{inv.mentor.name}</TableCell>
                    <TableCell className="whitespace-normal px-3 py-3"><StatusPill status={inv.plan} /></TableCell>
                    <TableCell className="whitespace-normal px-3 py-3 text-xs text-slate-500">{formatDay(inv.date)}</TableCell>
                    <TableCell className="whitespace-normal px-3 py-3 text-right font-semibold">{formatMoney(inv.amount)}</TableCell>
                    <TableCell className="whitespace-normal py-3 pl-3 text-right pr-0"><StatusPill status={inv.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <MentorPagination pagination={pager} label="invoices" />
      </Section>
      <DemoNote />
    </Loaded>
  );
}
