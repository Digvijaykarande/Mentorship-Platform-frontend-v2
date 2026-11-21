"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { adminApi, feedbackApi, projectsApi, submissionsApi, tasksApi, usersApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { refreshStorage } from "@/lib/storage";
import {
  linkStepsToSubmissions,
  toUiActivity,
  toUiFeedback,
  toUiIntern,
  toUiMentor,
  toUiProject,
  toUiSubmission,
  toUiTask,
} from "./adapters";

const WorkspaceContext = createContext(null);
const POLL_MS = 60_000;
const EMPTY = { tasks: [], submissions: [], feedback: [], projects: [], interns: [], mentors: [], mentorOptions: [], overview: null };

/**
 * The single source of truth for everything the signed-in person can see. It loads from the API
 * (scoped by role on the server), keeps the data fresh, and exposes the actions the pages call.
 * After every change the affected data is re-fetched, so the screen always shows what the server holds.
 */
export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "mentor";
  const [raw, setRaw] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    if (inFlight.current) return inFlight.current;
    inFlight.current = (async () => {
      const jobs = {
        tasks: tasksApi.list(),
        submissions: submissionsApi.list(),
        feedback: feedbackApi.list(),
        projects: projectsApi.list(),
        mentorOptions: usersApi.mentors(),
        ...(isStaff && { users: usersApi.list(), overview: adminApi.overview() }),
      };
      const keys = Object.keys(jobs);
      const results = await Promise.allSettled(Object.values(jobs));
      const next = {};
      let failure = null;
      results.forEach((r, i) => {
        if (r.status === "fulfilled") next[keys[i]] = r.value;
        else failure = failure ?? r.reason;
      });
      setRaw((prev) => ({
        ...prev,
        ...(next.tasks && { tasks: next.tasks }),
        ...(next.submissions && { submissions: next.submissions }),
        ...(next.feedback && { feedback: next.feedback }),
        ...(next.projects && { projects: next.projects }),
        ...(next.mentorOptions && { mentorOptions: next.mentorOptions }),
        ...(next.users && {
          interns: next.users.filter((u) => u.role === "intern"),
          mentors: next.users.filter((u) => u.role === "mentor"),
        }),
        ...(next.overview && { overview: next.overview }),
      }));
      setError(failure ? failure.message || "Could not load your data." : "");
      setReady(true);
    })().finally(() => {
      inFlight.current = null;
    });
    return inFlight.current;
  }, [user, isStaff]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the screen fresh when other people change things (mentor decisions, new assignments).
  useEffect(() => {
    const tick = () => document.visibilityState === "visible" && load();
    const timer = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load]);

  /* ---------------------------- derived UI data --------------------------- */
  const data = useMemo(() => {
    const submissions = raw.submissions.map(toUiSubmission);
    const tasks = linkStepsToSubmissions(raw.tasks.map(toUiTask), submissions);
    const projects = raw.projects.map((p) => toUiProject(p, tasks));
    const feedback = raw.feedback.map(toUiFeedback);
    const interns = raw.interns.map(toUiIntern);
    const mentors = raw.mentors.map(toUiMentor);
    const mentorOptions = raw.mentorOptions.map((m) => ({ value: m.id, label: m.label }));
    const activity = (raw.overview?.activity ?? []).map(toUiActivity);
    return { tasks, submissions, projects, feedback, interns, mentors, mentorOptions, activity, overview: raw.overview };
  }, [raw]);

  /* -------------------------------- lookups -------------------------------- */
  const apiIdOf = useCallback(
    (list, id) => data[list].find((item) => item.id === id || item.apiId === id)?.apiId ?? id,
    [data],
  );

  /** Runs a change on the server, then reloads. Errors propagate so each page can show them. */
  const mutate = useCallback(
    async (fn) => {
      const result = await fn();
      await load();
      refreshStorage(); // uploads / deletes change the user's storage numbers
      return result;
    },
    [load],
  );

  const actions = useMemo(
    () => ({
      refresh: load,

      /* ----- intern: submissions ----- */
      createSubmission: (payload) => mutate(() => submissionsApi.create(payload)),
      editSubmission: (id, payload) => mutate(() => submissionsApi.update(apiIdOf("submissions", id), payload)),
      reviseSubmission: (id, payload) => mutate(() => submissionsApi.revise(apiIdOf("submissions", id), payload)),
      withdrawSubmission: (id) => mutate(() => submissionsApi.withdraw(apiIdOf("submissions", id))),
      restoreSubmission: (id) => mutate(() => submissionsApi.restore(apiIdOf("submissions", id))),
      deleteSubmission: (id) => mutate(() => submissionsApi.remove(apiIdOf("submissions", id))),

      /* ----- intern: feedback ----- */
      requestFeedback: (payload) => mutate(() => feedbackApi.request(payload)),
      setFeedbackStatus: (id, status) => mutate(() => feedbackApi.setStatus(apiIdOf("feedback", id), status)),
      addSuggestion: (id, index) => mutate(() => feedbackApi.addSuggestion(apiIdOf("feedback", id), index)),

      /* ----- intern: projects ----- */
      requestReview: (projectId, note) => mutate(() => projectsApi.requestReview(projectId, note)),
      scheduleMeeting: (projectId, body) => mutate(() => projectsApi.scheduleMeeting(projectId, body)),
      addResource: (projectId, body) => mutate(() => projectsApi.addResource(projectId, body)),
      /** Several files / links at once (already uploaded); reloads once at the end. */
      addResources: (projectId, list) =>
        mutate(async () => {
          for (const body of list) await projectsApi.addResource(projectId, body);
        }),
      removeResource: (projectId, resourceId) => mutate(() => projectsApi.removeResource(projectId, resourceId)),
      addDocumentation: (projectId, body) => mutate(() => projectsApi.addDocumentation(projectId, body)),
      removeDocumentation: (projectId, key) => mutate(() => projectsApi.removeDocumentation(projectId, key)),

      /* ----- staff ----- */
      reviewSubmission: (id, body) => mutate(() => submissionsApi.review(apiIdOf("submissions", id), body)),
      createProject: (body) => mutate(() => projectsApi.create(body)),
      updateProject: (id, body) => mutate(() => projectsApi.update(id, body)),
      deleteProject: (id) => mutate(() => projectsApi.remove(id)),
      createTask: (body) => mutate(() => tasksApi.create(body)),
      updateTask: (id, body) => mutate(() => tasksApi.update(id, body)),
      deleteTask: (id) => mutate(() => tasksApi.remove(id)),
      addTaskStep: (id, text) => mutate(() => tasksApi.addStep(id, text)),
      approveStep: (taskId, stepId, note) => mutate(() => tasksApi.approveStep(taskId, stepId, note)),
      requestStepChanges: (taskId, stepId, note) => mutate(() => tasksApi.requestChanges(taskId, stepId, note)),
      giveFeedback: (body) => mutate(() => feedbackApi.give(body)),
      respondFeedback: (id, body) => mutate(() => feedbackApi.respond(apiIdOf("feedback", id), body)),
      createUser: (body) => mutate(() => usersApi.create(body)),
      updateUser: (id, body) => mutate(() => usersApi.update(id, body)),
      approveMentor: (id) => mutate(() => usersApi.approve(id)),
      deactivateUser: (id) => mutate(() => usersApi.deactivate(id)),
      resetPassword: (id, password) => usersApi.resetPassword(id, password),
    }),
    [load, mutate, apiIdOf],
  );

  const value = useMemo(() => ({ ...data, ready, error, actions }), [data, ready, error, actions]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
