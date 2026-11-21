import { Check, GraduationCap, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ROLES = [
  {
    value: "intern",
    label: "Intern",
    hint: "Submit work, get feedback",
    icon: GraduationCap,
  },
  {
    value: "mentor",
    label: "Mentor",
    hint: "Guide and review interns",
    icon: UserCheck,
  },
];

export default function RoleSelector({ role, onSelectRole, labelClass }) {
  return (
    <div className="space-y-1">
      <p className={labelClass}>I am joining as</p>
      <div role="radiogroup" className="grid grid-cols-2 gap-2">
        {ROLES.map(({ value, label, hint, icon: Icon }) => {
          const active = role === value;
          return (
            <Button
              key={value}
              type="button"
              variant="outline"
              role="radio"
              aria-checked={active}
              onClick={() => onSelectRole(value)}
              className={cn(
                "relative flex h-auto items-center justify-start gap-2.5 rounded-xl border px-2.5 py-2 text-left font-normal transition-all",
                active
                  ? "border-primary-300 bg-primary-50/70 ring-4 ring-primary-500/10 hover:bg-primary-50/80 dark:border-primary-500/40 dark:bg-primary-500/10 dark:hover:bg-primary-500/20"
                  : "border-slate-200 hover:border-primary-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                  {label}
                </span>
                <span className="block truncate text-[10.5px] text-slate-500 dark:text-slate-400">
                  {hint}
                </span>
              </span>
              {active && (
                <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
