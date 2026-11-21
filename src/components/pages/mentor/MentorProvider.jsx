"use client";

import { createContext, useContext, useMemo } from "react";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";
import { buildMentorSnapshot } from "./mentorData";

const MentorSnapshotContext = createContext(null);

/** One snapshot for the whole mentor shell (sidebar, navbar and pages read the same data). */
export function MentorProvider({ children }) {
  const workspace = useWorkspace();
  const snapshot = useMemo(
    () => buildMentorSnapshot(workspace),
    [workspace],
  );
  return <MentorSnapshotContext.Provider value={snapshot}>{children}</MentorSnapshotContext.Provider>;
}

export const useMentorSnapshot = () => useContext(MentorSnapshotContext);
/** Server actions (create task, review submission, ...). They throw ApiError on failure. */
export const useMentorActions = () => useWorkspace().actions;
