"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_BASE =
  "p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer select-none border relative overflow-hidden group flex flex-col justify-between";
const CARD_ACTIVE =
  "border-slate-900 dark:border-white ring-2 ring-slate-900/10 dark:ring-white/20 bg-[#f9fbfd] dark:bg-white/5 shadow-xs";
const CARD_IDLE =
  "border-slate-200/90 dark:border-white/10 bg-white dark:bg-card hover:border-slate-300 dark:hover:border-white/20 hover:bg-[#f1f5f9] dark:hover:bg-white/5 active:bg-[#f9fbfd] hover:shadow-2xs";

function RadioCheck({ active }) {
  return (
    <span
      className={cn(
        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
        active
          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-2xs"
          : "border-slate-300 dark:border-white/20 bg-white dark:bg-card"
      )}
    >
      {active && <Check className="w-3 h-3 stroke-3" />}
    </span>
  );
}

export function LightThemeCard({ active, onSelect }) {
  return (
    <div
      id="theme-option-light"
      role="button"
      tabIndex={0}
      onClick={() => onSelect("light")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect("light")}
      className={cn(CARD_BASE, active ? CARD_ACTIVE : CARD_IDLE)}
    >
      <div className="w-full h-24 rounded-xl border border-slate-200/90 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-100 overflow-hidden relative shadow-inner mb-3.5 flex">
        <div className="w-6 bg-slate-900 flex flex-col items-center py-2 gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-2xs" />
          <span className="w-3 h-1 rounded-full bg-slate-700 mt-1" />
          <span className="w-3 h-1 rounded-full bg-slate-700" />
          <span className="w-3 h-1 rounded-full bg-slate-800" />
        </div>
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-4 border-b border-slate-200/80 bg-slate-50/70 px-2 flex items-center justify-between">
            <span className="w-8 h-1.5 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-primary/80" />
          </div>
          <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="p-1.5 rounded-md border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
              <div className="space-y-1">
                <span className="block w-12 h-1.5 rounded-full bg-slate-700" />
                <span className="block w-8 h-1 rounded-full bg-slate-400" />
              </div>
              <span className="w-5 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
            </div>
            <div className="h-2 rounded-md bg-slate-100 border border-slate-200/50 flex items-center px-1.5">
              <span className="w-6 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center shrink-0">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-foreground font-heading text-[13px]">Light Theme</span>
          </div>
          <RadioCheck active={active} />
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">
          Optimal contrast on clean slate canvas for daylight focus.
        </p>
      </div>
    </div>
  );
}

export function DarkThemeCard({ active, onSelect }) {
  return (
    <div
      id="theme-option-dark"
      role="button"
      tabIndex={0}
      onClick={() => onSelect("dark")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect("dark")}
      className={cn(CARD_BASE, active ? CARD_ACTIVE : CARD_IDLE)}
    >
      <div className="w-full h-24 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-inner mb-3.5 flex">
        <div className="w-6 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-2 gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-2xs" />
          <span className="w-3 h-1 rounded-full bg-slate-700 mt-1" />
          <span className="w-3 h-1 rounded-full bg-slate-700" />
          <span className="w-3 h-1 rounded-full bg-slate-800" />
        </div>
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="h-4 border-b border-slate-800 bg-slate-900/80 px-2 flex items-center justify-between">
            <span className="w-8 h-1.5 rounded-full bg-slate-600" />
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="p-1.5 rounded-md border border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="space-y-1">
                <span className="block w-12 h-1.5 rounded-full bg-slate-200" />
                <span className="block w-8 h-1 rounded-full bg-slate-500" />
              </div>
              <span className="w-5 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            </div>
            <div className="h-2 rounded-md bg-slate-900/60 border border-slate-800/80 flex items-center px-1.5">
              <span className="w-6 h-1 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-foreground font-heading text-[13px]">Dark Obsidian</span>
          </div>
          <RadioCheck active={active} />
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">
          Low-light comfort with sleek deep obsidian and slate tones.
        </p>
      </div>
    </div>
  );
}

export function SystemThemeCard({ active, onSelect, systemPrefersDark }) {
  return (
    <div
      id="theme-option-system"
      role="button"
      tabIndex={0}
      onClick={() => onSelect("system")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect("system")}
      className={cn(CARD_BASE, active ? CARD_ACTIVE : CARD_IDLE)}
    >
      <div className="w-full h-24 rounded-xl border border-slate-300 dark:border-slate-700/80 overflow-hidden relative shadow-inner mb-3.5 flex">
        <div className="w-1/2 bg-white flex flex-col border-r border-slate-300 dark:border-slate-700">
          <div className="h-4 border-b border-slate-200 bg-slate-50 px-1.5 flex items-center">
            <span className="w-6 h-1.5 rounded-full bg-slate-400" />
          </div>
          <div className="p-1.5 space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="p-1 rounded border border-slate-200 bg-slate-50">
              <span className="block w-8 h-1.5 rounded-full bg-slate-700 mb-1" />
              <span className="block w-5 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-slate-950 flex flex-col">
          <div className="h-4 border-b border-slate-800 bg-slate-900 px-1.5 flex items-center justify-end">
            <span className="w-6 h-1.5 rounded-full bg-slate-600" />
          </div>
          <div className="p-1.5 space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="p-1 rounded border border-slate-800 bg-slate-900">
              <span className="block w-8 h-1.5 rounded-full bg-slate-200 mb-1" />
              <span className="block w-5 h-1 rounded-full bg-slate-600" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-background/90 text-foreground border border-border shadow-xs backdrop-blur-xs">
            Auto
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Laptop className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-foreground font-heading text-[13px]">System Adaptive</span>
          </div>
          <RadioCheck active={active} />
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">
          Syncs with OS mode ({systemPrefersDark ? "Dark active" : "Light active"}).
        </p>
      </div>
    </div>
  );
}
