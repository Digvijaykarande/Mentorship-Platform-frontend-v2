"use client";

import { Link2, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { formatBytes } from "@/lib/attachments";
import { useStorage } from "@/lib/storage";

/** Plain-language rules so nobody is surprised by what counts toward the limit. */
export default function StorageTips({ className }) {
  const { maxFileBytes } = useStorage();
  const tips = [
    { icon: UploadCloud, title: `Up to ${formatBytes(maxFileBytes)} per file`, text: "Bigger files are rejected before they upload." },
    { icon: Link2, title: "Links are free", text: "Pasting a link to Drive, GitHub or Figma never uses storage." },
    { icon: Trash2, title: "Deleting frees space", text: "Removing a submission, resource or task reference gives its files back. Withdrawn submissions still count." },
    { icon: ShieldCheck, title: "Need more?", text: "Use Request more space. Admins review requests and can raise your limit." },
  ];
  return (
    <SectionCard icon={ShieldCheck} title="How storage works" description="What counts and what doesn't" className={className} iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" contentClassName="p-5">
      <ul className="grid gap-3 sm:grid-cols-2">
        {tips.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
