import { apiClient, apiRequest, queryString } from "./client";

const json = (id, path = "") => `/tasks/${id}${path}`;

export const tasksApi = {
  list: async (params) => (await apiRequest(`/tasks${queryString({ limit: 500, ...params })}`)).data,
  get: (id) => apiClient(json(id)),
  create: (body) => apiClient("/tasks", { method: "POST", body }),
  update: (id, body) => apiClient(json(id), { method: "PATCH", body }),
  remove: (id) => apiClient(json(id), { method: "DELETE" }),
  addStep: (id, text) => apiClient(json(id, "/steps"), { method: "POST", body: { text } }),
  updateStep: (id, stepId, text) => apiClient(json(id, `/steps/${stepId}`), { method: "PATCH", body: { text } }),
  removeStep: (id, stepId) => apiClient(json(id, `/steps/${stepId}`), { method: "DELETE" }),
  completeStep: (id, stepId) => apiClient(json(id, `/steps/${stepId}/complete`), { method: "POST" }),
  approveStep: (id, stepId, note = "") =>
    apiClient(json(id, `/steps/${stepId}/approve`), { method: "POST", body: { note } }),
  requestChanges: (id, stepId, note) =>
    apiClient(json(id, `/steps/${stepId}/request-changes`), { method: "POST", body: { note } }),
};
