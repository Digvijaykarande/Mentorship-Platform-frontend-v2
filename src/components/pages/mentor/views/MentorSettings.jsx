"use client";

import { useState } from "react";
import {
  Settings2,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Database,
  HardDrive,
  Lock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import StoragePanel from "@/components/common/storage/StoragePanel";
import StoragePeople from "@/components/common/storage/StoragePeople";
import { PillTabs } from "@/components/common/PillTabs";
import { useStorage } from "@/lib/storage";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import { MentorStatusBadge,
  MentorSection as SectionCard,
} from "../MentorCommon";

function SettingItem({ title, description, defaultChecked = false }) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0 dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {description}
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label={`Toggle ${title}`}
      />
    </div>
  );
}

const TABS = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "storage", label: "Storage", icon: HardDrive },
];

export default function MentorSettings({ initialTab = "general" }) {
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState(initialTab);
  const { users, me } = useStorage();
  const interns = users.filter((u) => u.role === "intern");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero
        icon={tab === "storage" ? HardDrive : Settings2}
        badge={tab === "storage" ? "Storage" : "Mentor Controls"}
        title={tab === "storage" ? "Keep your space and your interns' space in check." : "Shape how the program runs."}
        description={tab === "storage" ? "See what you and your interns have uploaded, spot anyone running low and ask the admins for more space." : "Configure organization-wide governance, review rules, and access policies."}
      >
        {tab === "general" && (
          <Button onClick={handleSave} className={MENTOR_HERO_BTN}>
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {saved ? "Saved Changes" : "Save Changes"}
          </Button>
        )}
      </MentorHero>

      <PillTabs tabs={TABS} activeTab={tab} onTabChange={setTab} ariaLabel="Settings sections" />

      {tab === "storage" && (
        <div className="space-y-5">
          <StoragePanel />
          <StoragePeople
            title="Your interns' storage"
            description={`${interns.length} intern${interns.length === 1 ? "" : "s"} · limits are set by the admins`}
            people={interns}
          />
        </div>
      )}

      {tab === "general" && (
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          icon={Settings2}
          title="Program Execution Controls"
          description="Rules governing task step unlocking and assignment flows"
          iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
          revealIndex={1}
        >
          <div className="space-y-1">
            <SettingItem
              title="Require Mentor Approval on Steps"
              description="Interns cannot proceed to the next milestone until the current step is reviewed and approved."
              defaultChecked={true}
            />
            <SettingItem
              title="Weekly Progress Digests"
              description="Automatically send you a cohort health breakdown every Monday morning."
              defaultChecked={true}
            />
            <SettingItem
              title="Intern Self-Assignment"
              description="Allow interns to pick unassigned projects from the open project pool."
              defaultChecked={false}
            />
            <SettingItem
              title="Automated Follow-up Task Creation"
              description="Allow mentors to automatically assign the next task directly from a review decision."
              defaultChecked={true}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Lock}
          title="Access & Organization Policies"
          description="Security and audit configuration across the mentorship workspace"
          iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          revealIndex={2}
        >
          <div className="space-y-1">
            <SettingItem
              title="Workspace Audit Logging"
              description="Track timestamps and authors for all reviews, status changes, and task assignments."
              defaultChecked={true}
            />
            <SettingItem
              title="Mentor Export Privileges"
              description="Allow mentors to export evaluation reports and intern performance spreadsheets."
              defaultChecked={true}
            />
            <SettingItem
              title="Invite-Only Registration"
              description="Block public registrations; require an organization invite to access the platform."
              defaultChecked={true}
            />
            <SettingItem
              title="Public Project Repositories"
              description="Require all linked GitHub pull requests and repositories to be organization-visible."
              defaultChecked={true}
            />
          </div>
        </SectionCard>
      </div>
      )}

      {tab === "general" && (
      <SectionCard
        icon={Activity}
        title="Live Workspace Architecture"
        description="Logical connection between Mentor Portal and Intern Dashboard"
        iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        revealIndex={3}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Workstream Assignments",
              detail: "Shared Workspace Store",
              status: "Active",
            },
            {
              label: "Submission Review Pipeline",
              detail: "Sequential Unlock Engine",
              status: "Active",
            },
            {
              label: "Mentorship Feedback Loop",
              detail: "Bidirectional Event Channel",
              status: "Active",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                {item.detail}
              </p>
              <div className="mt-2">
                <MentorStatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          The entire mentor console and intern workspace communicate seamlessly through reactive custom events and shared local storage. When you assign projects, tasks, or respond to feedback in this console, the intern dashboard reflects the changes in real-time.
        </p>
      </SectionCard>
      )}
    </div>
  );
}
