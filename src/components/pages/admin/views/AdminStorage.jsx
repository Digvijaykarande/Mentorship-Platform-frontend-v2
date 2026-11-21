"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Database,
  HardDrive,
  Infinity as InfinityIcon,
  Users,
} from "lucide-react";
import MentorStatCard from "../../mentor/MentorStatCard";
import { MentorSection as Section } from "../../mentor/MentorCommon";
import StorageSummary from "@/components/common/storage/StorageSummary";
import EditQuotaDialog from "@/components/common/storage/EditQuotaDialog";
import StorageProviders from "../storage/StorageProviders";
import AdminPeopleStorage from "../storage/AdminPeopleStorage";
import { SOURCE_META } from "@/components/common/StorageUsageCard";
import { loadStorage, useStorage } from "@/lib/storage";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import { Loaded } from "../AdminBits";

export default function AdminStorage() {
  const { users, defaults, status } = useStorage();
  const [editing, setEditing] = useState(null);

  const stats = useMemo(() => {
    const limited = users.filter((u) => u.quotaBytes !== null);
    const bySource = Object.fromEntries(
      Object.keys(SOURCE_META).map((k) => [k, 0]),
    );
    users.forEach((u) =>
      Object.entries(u.breakdown).forEach(
        ([k, v]) => (bySource[k] = (bySource[k] ?? 0) + v.bytes),
      ),
    );
    return {
      used: users.reduce((s, u) => s + u.bytes, 0),
      files: users.reduce((s, u) => s + u.files, 0),
      allocated: limited.reduce((s, u) => s + u.quotaBytes, 0),
      low: users.filter((u) => u.level === "warning" || u.level === "critical")
        .length,
      full: users.filter((u) => u.level === "full").length,
      bySource,
    };
  }, [users]);

  // The edit dialog reads the latest numbers for the person being edited.
  const editingPerson = editing
    ? (users.find((u) => u.id === editing.id) ?? editing)
    : null;

  return (
    <Loaded>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MentorStatCard
          icon={HardDrive}
          label="Storage used"
          value={formatBytes(stats.used)}
          tone="violet"
          trendLabel={`${stats.files} files across ${users.length} people`}
          index={0}
        />
        <MentorStatCard
          icon={Database}
          label="Space allocated"
          value={formatBytes(stats.allocated)}
          tone="indigo"
          trendLabel="Sum of all limits"
          index={1}
        />
        <MentorStatCard
          icon={AlertTriangle}
          label="Running low"
          value={stats.low}
          tone="amber"
          trendLabel="Above 80% of their limit"
          index={2}
        />
        <MentorStatCard
          icon={Users}
          label="Storage full"
          value={stats.full}
          tone="rose"
          trendLabel="Uploads are blocked"
          index={3}
        />
      </div>
      <StorageProviders />
      
      {/* <div className="grid gap-4 xl:grid-cols-2">
        <StorageSummary />

        <Section
          icon={Database}
          iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
          title="Limits and usage by source"
          description="Default limit per role and where the space goes"
        >
          <div className="space-y-5">
            <ul className="grid grid-cols-3 gap-2.5">
              {[
                ["Intern", defaults?.intern.readable ?? "5 GB"],
                ["Mentor", defaults?.mentor.readable ?? "10 GB"],
                ["Admin", null],
              ].map(([role, limit]) => (
                <li
                  key={role}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/30"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {role}
                  </p>
                  <p className="mt-1 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white">
                    {limit ?? (
                      <InfinityIcon className="h-5 w-5 text-primary-500" />
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {limit ? "default limit" : "unlimited"}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5">
              <div
                className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="img"
                aria-label="Storage by source"
              >
                {Object.entries(stats.bySource).map(([k, bytes]) => (
                  <div
                    key={k}
                    className={cn("h-full", SOURCE_META[k]?.bar)}
                    style={{
                      width: `${stats.used ? (bytes / stats.used) * 100 : 0}%`,
                    }}
                    title={`${SOURCE_META[k]?.label}: ${formatBytes(bytes)}`}
                  />
                ))}
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {Object.entries(stats.bySource).map(([k, bytes]) => (
                  <li key={k} className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        SOURCE_META[k]?.dot,
                      )}
                    />
                    <span className="flex-1 truncate text-slate-600 dark:text-slate-300">
                      {SOURCE_META[k]?.label}
                    </span>
                    <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
                      {formatBytes(bytes)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[11px] text-slate-400">
              Change one person&apos;s limit with the Limit button below. Role
              defaults are set on the server (STORAGE_QUOTA_INTERN_MB and
              STORAGE_QUOTA_MENTOR_MB).
            </p>
          </div>
        </Section>
      </div> */}

      <AdminPeopleStorage
        title="Everyone's storage"
        description={
          status === "ready"
            ? `${users.length} active people · open a person to see their files`
            : "Loading..."
        }
        people={users}
        onEdit={setEditing}
      />

      <EditQuotaDialog
        person={editingPerson}
        defaults={defaults}
        onClose={() => setEditing(null)}
        onSaved={loadStorage}
      />
    </Loaded>
  );
}
