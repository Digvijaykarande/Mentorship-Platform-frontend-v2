"use client";

import StorageSummary from "./StorageSummary";
import StorageFiles from "./StorageFiles";
import StorageTips from "./StorageTips";

/** Everything a person needs to manage their own storage. Used by the intern profile tab and the mentor settings tab. */
export default function StoragePanel() {
  return (
    <div className="space-y-5">
      <StorageSummary />
      <StorageFiles />
      <StorageTips />
    </div>
  );
}
