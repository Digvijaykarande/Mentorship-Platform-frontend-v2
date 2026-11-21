"use client";

import { useState } from "react";
import { ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRetained } from "../MentorModal";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import { MentorPagination, usePagination } from "../MentorPagination";
import FilterTabs from "@/components/common/FilterTabs";
import { useMentorActions } from "../MentorProvider";
import { Toolbar, EmptyState, MentorSection as SectionCard } from "../MentorCommon";
import TaskListItem from "./tasks/TaskListItem";
import TaskDetailModal from "./tasks/TaskDetailModal";

export default function MentorTasks({ snapshot, onCreate }) {
  const mentorActions = useMentorActions();
  const [stepError, setStepError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStepText, setNewStepText] = useState("");

  const filteredTasks = snapshot.tasks.filter((task) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "overdue"
          ? task.overdue && task.status !== "Done"
          : task.status.toLowerCase().replace(/\s+/g, "-") === filter;

    const matchesSearch =
      `${task.title} ${task.project} ${task.mentee} ${(task.assignees || []).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pager = usePagination(filteredTasks, `${search}|${filter}`);

  const filterOptions = [
    { value: "all", label: "All Tasks", count: snapshot.tasks.length },
    {
      value: "to-do",
      label: "To Do",
      count: snapshot.tasks.filter((t) => t.status === "To do").length,
    },
    {
      value: "in-progress",
      label: "In Progress",
      count: snapshot.tasks.filter((t) => t.status === "In progress").length,
    },
    {
      value: "done",
      label: "Done",
      count: snapshot.tasks.filter((t) => t.status === "Done").length,
    },
    {
      value: "overdue",
      label: "Overdue",
      count: snapshot.overdue,
    },
  ];

  const shownTask = useRetained(selectedTask);
  const liveSelectedTask = shownTask
    ? snapshot.tasks.find((t) => t.id === shownTask.id) || shownTask
    : null;

  const handleAddStep = async (e) => {
    e.preventDefault();
    if (!newStepText.trim() || !liveSelectedTask) return;
    try {
      await mentorActions.addTaskStep(liveSelectedTask.id, newStepText.trim());
      setNewStepText("");
      setStepError("");
    } catch (error) {
      setStepError(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero
        icon={ListTodo}
        badge="Task Operations"
        title="Unblock execution across the cohort."
        description="Manage sequential step execution, review work in progress, and unblock overdue deliverables."
      >
        <Button onClick={onCreate} className={MENTOR_HERO_BTN}>
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </MentorHero>

      <SectionCard revealIndex={1}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search tasks by title, project, or intern..."
        >
          <FilterTabs
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />
        </Toolbar>

        <div className="mt-3 space-y-2">
          {pager.pageItems.map((task, i) => (
            <TaskListItem
              key={task.id}
              task={task}
              index={i}
              onSelect={() => setSelectedTask(task)}
            />
          ))}

          {!filteredTasks.length && (
            <EmptyState
              icon={ListTodo}
              title="No tasks found"
              description="Create a task or change the current search and status filters."
            />
          )}
        </div>
        <MentorPagination pagination={pager} label="tasks" />
      </SectionCard>

      <TaskDetailModal
        selectedTask={selectedTask}
        liveSelectedTask={liveSelectedTask}
        onClose={() => setSelectedTask(null)}
        newStepText={newStepText}
        setNewStepText={setNewStepText}
        stepError={stepError}
        handleAddStep={handleAddStep}
      />
    </div>
  );
}
