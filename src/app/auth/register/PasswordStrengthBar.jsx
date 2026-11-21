import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STRENGTH = [
  { label: "Too weak", bar: "bg-rose-500", text: "text-rose-600" },
  { label: "Weak", bar: "bg-rose-500", text: "text-rose-600" },
  { label: "Fair", bar: "bg-secondary-500", text: "text-secondary-600" },
  { label: "Good", bar: "bg-emerald-400", text: "text-emerald-600" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
];

export function checkPassword(pw) {
  const rules = [
    { label: "8+ characters", short: "8+ chars", ok: pw.length >= 8 },
    {
      label: "Upper & lower case",
      short: "Aa",
      ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
    },
    { label: "A number", short: "Number", ok: /\d/.test(pw) },
    { label: "A symbol", short: "Symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = pw ? rules.filter((r) => r.ok).length : 0;
  return { rules, score };
}

export default function PasswordStrengthBar({ password, score, rules, strength }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <div className="grid w-24 shrink-0 grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors duration-300",
              i <= score ? strength.bar : "bg-slate-200 dark:bg-slate-800",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "shrink-0 text-[11px] font-semibold",
          password ? strength.text : "text-slate-400",
        )}
      >
        {password ? strength.label : "Strength"}
      </span>
      <ul className="ml-auto flex flex-wrap justify-end gap-x-2.5 gap-y-0.5">
        {rules.map((r) => (
          <li
            key={r.label}
            title={r.label}
            className={cn(
              "flex items-center gap-1 text-[11px] transition-colors",
              r.ok ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400",
            )}
          >
            <Check
              className={cn(
                "h-3 w-3 transition-opacity",
                r.ok ? "opacity-100" : "opacity-30",
              )}
            />
            {r.short}
          </li>
        ))}
      </ul>
    </div>
  );
}
