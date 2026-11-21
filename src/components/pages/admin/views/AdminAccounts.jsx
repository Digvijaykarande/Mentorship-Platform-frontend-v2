"use client";

import { useMemo, useState } from "react";
import { Ban, CheckCircle2, RotateCcw, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FilterTabs from "@/components/common/FilterTabs";
import { MentorAvatar, MentorSection as Section, Toolbar, EmptyState } from "../../mentor/MentorCommon";
import { MentorModal, ModalButton } from "../../mentor/MentorModal";
import { MentorPagination, usePagination } from "../../mentor/MentorPagination";
import { useAdmin } from "../AdminProvider";
import { Loaded, StatusPill } from "../AdminBits";
import { accountStatus, formatDay } from "../adminData";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function AdminAccounts() {
  const { users, approve, deactivate, reactivate } = useAdmin();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null); // mentor being deactivated
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const mentors = useMemo(() => users.filter((u) => u.role === "mentor"), [users]);
  const shown = mentors.filter((m) => {
    const status = accountStatus(m);
    const okFilter = filter === "all" || (filter === "pending" && status === "Pending approval") || (filter === "active" && status === "Active") || (filter === "inactive" && status === "Inactive");
    const q = search.trim().toLowerCase();
    return okFilter && (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  });
  const pager = usePagination(shown, `${search}|${filter}`);

  const act = async (id, fn) => {
    setBusy(id);
    setError("");
    try {
      await fn(id);
    } catch (e) {
      setError(e?.message || "That didn't work. Please try again.");
    } finally {
      setBusy("");
    }
  };

  return (
    <Loaded>
      <Section icon={UsersRound} title="Mentor accounts" description={`${mentors.length} mentors on the platform`}>
        <div className="space-y-4">
          <Toolbar search={search} setSearch={setSearch} placeholder="Search by name or email...">
            <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />
          </Toolbar>
          {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

          {pager.pageItems.length === 0 ? (
            <EmptyState icon={UsersRound} title="No mentors found" description="Try another search or filter." />
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[640px] text-left text-sm">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800">
                    <TableHead className="h-auto text-inherit py-2 pr-3 font-semibold pl-0">Mentor</TableHead>
                    <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Interns</TableHead>
                    <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Last active</TableHead>
                    <TableHead className="h-auto text-inherit px-3 py-2 font-semibold">Status</TableHead>
                    <TableHead className="h-auto text-inherit py-2 pl-3 text-right font-semibold pr-0">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pager.pageItems.map((m) => {
                    const status = accountStatus(m);
                    return (
                      <TableRow key={m.id} className="hover:bg-transparent">
                        <TableCell className="whitespace-normal py-3 pr-3 pl-0">
                          <div className="flex items-center gap-3">
                            <MentorAvatar name={m.name} tone="bg-linear-to-br from-violet-500 to-primary-600" />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</p>
                              <p className="truncate text-xs text-slate-500">{m.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-normal px-3 py-3 text-slate-600 dark:text-slate-300">{m.internCount ?? 0}</TableCell>
                        <TableCell className="whitespace-normal px-3 py-3 text-xs text-slate-500">{formatDay(m.lastLoginAt)}</TableCell>
                        <TableCell className="whitespace-normal px-3 py-3"><StatusPill status={status} /></TableCell>
                        <TableCell className="whitespace-normal py-3 pl-3 text-right pr-0">
                          {status === "Pending approval" && (
                            <Button size="sm" disabled={busy === m.id} className="h-8 gap-1.5 rounded-lg text-xs" onClick={() => act(m.id, approve)}>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                            </Button>
                          )}
                          {status === "Active" && (
                            <Button size="sm" variant="outline" disabled={busy === m.id} className="h-8 gap-1.5 rounded-lg text-xs text-rose-600" onClick={() => setConfirm(m)}>
                              <Ban className="h-3.5 w-3.5" /> Deactivate
                            </Button>
                          )}
                          {status === "Inactive" && (
                            <Button size="sm" variant="outline" disabled={busy === m.id} className="h-8 gap-1.5 rounded-lg text-xs" onClick={() => act(m.id, reactivate)}>
                              <RotateCcw className="h-3.5 w-3.5" /> Reactivate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          <MentorPagination pagination={pager} label="mentors" />
        </div>
      </Section>

      <MentorModal
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        size="sm"
        icon={Ban}
        tone="rose"
        title="Deactivate mentor?"
        description={confirm ? `${confirm.name} will be signed out and won't be able to sign in. You can reactivate the account later.` : ""}
        footer={
          <>
            <ModalButton variant="secondary" onClick={() => setConfirm(null)}>Cancel</ModalButton>
            <ModalButton
              tone="rose"
              onClick={() => {
                const id = confirm.id;
                setConfirm(null);
                act(id, deactivate);
              }}
            >
              Deactivate
            </ModalButton>
          </>
        }
      />
    </Loaded>
  );
}
