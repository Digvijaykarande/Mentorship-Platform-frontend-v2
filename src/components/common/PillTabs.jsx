"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
const sizeConfig = {
  sm: {
    container: "p-1 gap-0.5",
    tab: "px-3 py-1.5 text-xs",
    icon: "w-3 h-3",
  },
  md: {
    container: "p-1 gap-1",
    tab: "px-4 py-2 text-xs",
    icon: "w-3.5 h-3.5",
  },
  lg: {
    container: "p-1.5 gap-1.5",
    tab: "px-5 py-2.5 text-sm",
    icon: "w-4 h-4",
  },
};
export function PillTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  containerClassName,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  size = "md",
  ariaLabel = "Navigation Tabs",
}) {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  return (
    <div className={cn("overflow-x-auto no-scrollbar", className)}>
      <nav
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center rounded-full bg-[#f1f5f9] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80",
          currentSize.container,
          containerClassName
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <Button variant="unstyled"
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap select-none",
                currentSize.tab,
                isActive
                  ? cn(
                      "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold",
                      activeTabClassName
                    )
                  : cn(
                      "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e2e8f0]/60 dark:hover:bg-slate-700/60",
                      inactiveTabClassName
                    ),
                tab.disabled && "opacity-50 cursor-not-allowed",
                tabClassName
              )}
            >
              {Icon && <Icon className={currentSize.icon} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined ? (
                tab.badge
              ) : tab.count !== undefined ? (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
export default PillTabs;
