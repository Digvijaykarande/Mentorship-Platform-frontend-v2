"use client";

import { Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STROKE = {
  ok: "stroke-primary-500",
  warning: "stroke-amber-500",
  critical: "stroke-rose-500",
  full: "stroke-rose-600",
};

/** Donut showing how full a quota is. Unlimited accounts get an infinity badge instead. */
export default function StorageRing({ percent = 0, level = "ok", unlimited = false, size = 132, children, className }) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const shown = Math.min(100, Math.max(0, percent));
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-100 dark:stroke-slate-800" />
        {!unlimited && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (shown / 100) * c}
            className={cn("transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none", STROKE[level] ?? STROKE.ok)}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {unlimited ? <InfinityIcon className="h-7 w-7 text-primary-500" /> : children}
      </div>
    </div>
  );
}
