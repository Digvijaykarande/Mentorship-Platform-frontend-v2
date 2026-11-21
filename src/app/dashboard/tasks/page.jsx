"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TasksHeader from "@/components/pages/dashboard/tasks/TasksHeader";
import TaskFilters from "@/components/pages/dashboard/tasks/TaskFilters";
import TaskList from "@/components/pages/dashboard/tasks/TaskList";
import TaskDetails from "@/components/pages/dashboard/tasks/TaskDetails";
import { groupOf } from "@/components/pages/dashboard/tasks/taskData";
import { useWorkspace } from "@/lib/workspace/WorkspaceProvider";

export default function TasksPage() {
  const { tasks, ready } = useWorkspace();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState("all");
  const handledLink = useRef(false);

  // /dashboard/tasks?task=ID opens that task (used by "View task" links and notifications).
  useEffect(() => {
    if (!ready || handledLink.current) return;
    handledLink.current = true;
    const wanted = new URLSearchParams(window.location.search).get("task");
    const target = wanted && tasks.find((task) => String(task.id) === wanted);
    if (target) {
      setSelectedId(target.id);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [ready, tasks]);

  const projectNames = useMemo(() => [...new Set(tasks.map((t) => t.project))], [tasks]);

  const scoped = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (project === "all" || t.project === project) &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.mentee.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q)),
    );
  }, [tasks, search, project]);

  const counts = useMemo(
    () => ({
      all: scoped.length,
      todo: scoped.filter((t) => groupOf(t) === "todo").length,
      active: scoped.filter((t) => groupOf(t) === "active").length,
      done: scoped.filter((t) => groupOf(t) === "done").length,
    }),
    [scoped],
  );

  const visible = useMemo(
    () => (status === "all" ? scoped : scoped.filter((t) => groupOf(t) === status)),
    [scoped, status],
  );

  const selected = visible.find((t) => t.id === selectedId) ?? visible[0] ?? null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30 px-4 py-6 font-sans text-[15px] leading-relaxed text-foreground antialiased sm:px-6 lg:px-8 lg:py-8">
      <div className="stagger mx-auto flex w-full max-w-6xl flex-col gap-6">
        <TasksHeader
          inProgressCount={tasks.filter((t) => t.status === "In progress").length}
          searchQuery={search}
          setSearchQuery={setSearch}
        />

        <TaskFilters
          status={status}
          setStatus={setStatus}
          project={project}
          setProject={setProject}
          projects={projectNames}
          counts={counts}
        />

        <div className="stagger grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <TaskList
            tasks={visible}
            selectedTaskId={selected?.id}
            onSelect={setSelectedId}
          />

          {selected && (
            <div className="lg:sticky lg:top-6">
              <TaskDetails key={selected.id} task={selected} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
