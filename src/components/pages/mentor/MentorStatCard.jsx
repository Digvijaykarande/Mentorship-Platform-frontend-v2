"use client";

import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, Reveal, useRevealed } from "./MentorMotion";

/**
 * Mentor-only KPI tile (same look as the shared MiniStatCard, which the intern
 * dashboard also uses and therefore stays untouched). Tighter padding, animated
 * entrance and a counting number.
 */
const TONES = {
  blue: {
    wash: "from-blue-50 dark:from-blue-500/10",
    ring: "ring-blue-600/10 dark:ring-blue-400/10",
    icon: "bg-blue-600 text-white dark:bg-blue-500",
    stroke: "#2563eb",
  },
  indigo: {
    wash: "from-primary-50 dark:from-primary-500/10",
    ring: "ring-primary-600/10 dark:ring-primary-400/10",
    icon: "bg-primary-600 text-white dark:bg-primary-500",
    stroke: "#1a40e6",
  },
  emerald: {
    wash: "from-emerald-50 dark:from-emerald-500/10",
    ring: "ring-emerald-600/10 dark:ring-emerald-400/10",
    icon: "bg-emerald-600 text-white dark:bg-emerald-500",
    stroke: "#059669",
  },
  amber: {
    wash: "from-secondary-50 dark:from-secondary-500/10",
    ring: "ring-secondary-600/10 dark:ring-secondary-400/10",
    icon: "bg-secondary-600 text-white dark:bg-secondary-500",
    stroke: "#ea580c",
  },
  violet: {
    wash: "from-violet-50 dark:from-violet-500/10",
    ring: "ring-violet-600/10 dark:ring-violet-400/10",
    icon: "bg-violet-600 text-white dark:bg-violet-500",
    stroke: "#7c3aed",
  },
  rose: {
    wash: "from-rose-50 dark:from-rose-500/10",
    ring: "ring-rose-600/10 dark:ring-rose-400/10",
    icon: "bg-rose-600 text-white dark:bg-rose-500",
    stroke: "#e11d48",
  },
};

function fallbackSpark(seed = 6) {
  let value = 50;
  return Array.from({ length: 14 }, (_, i) => {
    value += (((seed + i) * 47) % 23) - 11;
    value = Math.max(15, Math.min(85, value));
    return value;
  });
}

function Backdrop({ points, stroke, gradientId }) {
  const revealed = useRevealed();
  const width = 240;
  const height = 64;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return [x, y];
  });

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full opacity-70 motion-reduce:animate-none ${revealed === false ? "invisible" : "animate-in fade-in"}`}
      style={{ animationDuration: "1200ms", animationDelay: "250ms", animationFillMode: "backwards" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MentorStatCard({
  icon: Icon,
  label,
  value,
  tone = "blue",
  trend,
  trendDirection,
  trendLabel,
  spark,
  showSpark = true,
  index = 0,
  className,
}) {
  const palette = TONES[tone] ?? TONES.blue;
  const points = spark?.length > 1 ? spark : fallbackSpark(label?.length ?? 6);
  const direction =
    trendDirection ||
    (typeof trend === "string" && trend.trim().startsWith("-") ? "down" : "up");
  const isUp = direction === "up";
  const gradientId = `adminStatBackdrop-${tone}-${(label ?? "stat").replace(/\s+/g, "-").toLowerCase()}`;
  const shownValue =
    typeof value === "number" ? <CountUp value={value} delay={index * 45} /> : value;

  return (
    <Reveal
      as={Card}
      index={index}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0 bg-transparent bg-gradient-to-b to-white p-3.5 ring-1 dark:border-0 dark:bg-transparent text-inherit text-[length:inherit] shadow-[0_8px_24px_-18px_rgba(15,23,42,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:to-slate-900",
        palette.wash,
        palette.ring,
        className
      )}
    >
      {showSpark && <Backdrop points={points} stroke={palette.stroke} gradientId={gradientId} />}

      <div className="relative flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {Icon && (
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105",
              palette.icon
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="relative mt-2 flex items-end justify-between gap-2">
        <p className="text-[1.65rem] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
          {shownValue}
        </p>

        {trend && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-xs font-bold",
              isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend}
          </span>
        )}
      </div>

      {trendLabel && (
        <p className="relative mt-0.5 text-[10.5px] text-slate-400 dark:text-slate-500">{trendLabel}</p>
      )}
    </Reveal>
  );
}
