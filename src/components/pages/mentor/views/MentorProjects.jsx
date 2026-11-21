"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRetained } from "../MentorModal";
import MentorHero, { MENTOR_HERO_BTN } from "../MentorHero";
import { useMentorActions } from "../MentorProvider";
import { AddResourceDialog, ShareDocumentationDialog } from "../dialogs/ProjectContentDialogs";
import { MentorPagination, usePagination } from "../MentorPagination";
import { Toolbar, EmptyState, MentorSection as SectionCard } from "../MentorCommon";
import ProjectGridCard from "./projects/ProjectGridCard";
import ProjectDetailModal from "./projects/ProjectDetailModal";

export default function MentorProjects({ snapshot, onCreate, onAddTask }) {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialog, setDialog] = useState(null); // "doc" | "resource"
  const actions = useMentorActions();
  const retained = useRetained(selectedProject);
  const shownProject = retained
    ? (snapshot.projects.find((p) => p.id === retained.id) ?? retained)
    : retained;

  const filteredProjects = snapshot.projects.filter((project) =>
    `${project.name} ${project.owner} ${project.mentor} ${(project.assignees || []).join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pager = usePagination(filteredProjects, search);

  const projectTasks = shownProject
    ? snapshot.tasks.filter(
        (t) => t.projectId === shownProject.id || t.project === shownProject.name
      )
    : [];

  const projectResources = shownProject
    ? [
        ...(shownProject.resources || []),
        ...snapshot.resources.filter(
          (r) => r.projectId === shownProject.id || r.project === shownProject.name
        ),
      ].filter((item, idx, arr) => arr.findIndex((r) => r.id === item.id) === idx)
    : [];

  const projectDocs = (shownProject?.documentation?.sections ?? []).map((section) => ({
    ...section,
    attachments: section.attachments ?? [],
  }));

  const removeDoc = async (doc) => {
    if (!window.confirm(`Remove "${doc.title}" from the project documentation?`)) return;
    try {
      await actions.removeDocumentation(shownProject.id, doc.id);
    } catch (err) {
      window.alert(err.message || "Could not remove the document.");
    }
  };

  const removeResource = async (resource) => {
    if (!window.confirm(`Remove "${resource.name}" from this project?`)) return;
    try {
      await actions.removeResource(shownProject.id, resource.id);
    } catch (err) {
      window.alert(err.message || "Could not remove the file.");
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero icon={FolderKanban} badge="Project Workstreams" title="Keep every workstream on track." description="Create assignments, define scopes, and monitor milestones across active projects.">
        <Button onClick={onCreate} className={MENTOR_HERO_BTN}>
          <Plus className="h-4 w-4" /> Create Project
        </Button>
      </MentorHero>

      <SectionCard revealIndex={1}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search projects by name, assignee, or mentor..."
        />

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {pager.pageItems.map((project, i) => (
            <ProjectGridCard
              key={project.id}
              project={project}
              index={i}
              onSelect={() => setSelectedProject(project)}
            />
          ))}

          {!filteredProjects.length && (
            <div className="col-span-full">
              <EmptyState
                icon={FolderKanban}
                title="No projects match"
                description="Create a new project or adjust your search query."
              />
            </div>
          )}
        </div>
        <MentorPagination pagination={pager} label="projects" />
      </SectionCard>

      <ProjectDetailModal
        selectedProject={selectedProject}
        dialog={dialog}
        onClose={() => setSelectedProject(null)}
        shownProject={shownProject}
        onAddTask={onAddTask}
        projectTasks={projectTasks}
        projectDocs={projectDocs}
        projectResources={projectResources}
        setDialog={setDialog}
        removeDoc={removeDoc}
        removeResource={removeResource}
      />

      <ShareDocumentationDialog
        open={dialog === "doc"}
        onOpenChange={(open) => !open && setDialog(null)}
        project={shownProject}
      />
      <AddResourceDialog
        open={dialog === "resource"}
        onOpenChange={(open) => !open && setDialog(null)}
        project={shownProject}
      />
    </div>
  );
}
