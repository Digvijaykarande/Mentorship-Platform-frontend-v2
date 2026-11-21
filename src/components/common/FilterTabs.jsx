"use client";

import { useMemo } from "react";
import { PillTabs } from "@/components/common/PillTabs";

/**
 * Compact segmented control for filtering lists (notifications, tasks, etc).
 * Thin adapter over the shared `PillTabs`, keeping the `{ value, label, count? }` option shape
 * the pages already use.
 *
 * options: [{ value, label, count? }]
 */
export default function FilterTabs({ options, value, onChange, className }) {
  const tabs = useMemo(
    () => options.map(({ value: id, label, count }) => ({ id, label, count })),
    [options]
  );

  return (
    <PillTabs
      size="sm"
      tabs={tabs}
      activeTab={value}
      onTabChange={onChange}
      ariaLabel="Filter"
      className={className}
      tabClassName="capitalize"
    />
  );
}
