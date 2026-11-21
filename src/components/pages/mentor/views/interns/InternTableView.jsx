import { Briefcase, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MentorAvatar, MentorProgressBar, MentorStatusBadge } from "../../MentorCommon";
import { Reveal } from "../../MentorMotion";
import { avatarTone, progressTone } from "./internUtils";

export default function InternTableView({ pager, setSelectedUser }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
      <Table className="min-w-[860px]">
        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 w-[30%] pl-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Intern
            </TableHead>
            <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Track / Team
            </TableHead>
            <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Mentor
            </TableHead>
            <TableHead className="h-10 w-52 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </TableHead>
            <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </TableHead>
            <TableHead className="h-10 pr-5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pager.pageItems.map((user, i) => (
            <Reveal
              as={TableRow}
              fade
              index={i}
              delay={250}
              key={user.id}
              className="group cursor-pointer border-slate-100 transition-colors hover:bg-primary-50/40 dark:border-slate-800 dark:hover:bg-primary-500/5"
              onClick={() => setSelectedUser(user)}
            >
              <TableCell className="py-2.5 pl-5">
                <div className="flex items-center gap-3">
                  <MentorAvatar
                    name={user.name}
                    tone={avatarTone(user.id)}
                    className="h-10 w-10 text-[11px] shadow-sm ring-2 ring-white dark:ring-slate-900"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Briefcase className="h-3 w-3 text-slate-400" />
                  {user.team}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MentorAvatar
                    name={user.mentor}
                    tone="bg-linear-to-br from-violet-500 to-primary-600"
                    className="h-6 w-6 text-[9px]"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {user.mentor}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <MentorProgressBar
                      value={user.progress}
                      delay={450 + i * 45}
                      tone={progressTone(user.progress)}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {user.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <MentorStatusBadge status={user.status} />
              </TableCell>
              <TableCell className="pr-5 text-right">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Open ${user.name}`}
                  className="rounded-lg opacity-60 transition group-hover:bg-white group-hover:opacity-100 group-hover:shadow-xs dark:group-hover:bg-slate-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(user);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4 text-slate-400 group-hover:hidden" />
                  <ChevronRight className="hidden h-4 w-4 text-primary-500 group-hover:block" />
                </Button>
              </TableCell>
            </Reveal>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
