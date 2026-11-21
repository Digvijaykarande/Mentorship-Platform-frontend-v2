import { apiClient, apiRequest, queryString } from "./client";

export const projectsApi = {
  list: async (params) => (await apiRequest(`/projects${queryString({ limit: 500, ...params })}`)).data,
  get: (id) => apiClient(`/projects/${id}`),
  create: (body) => apiClient("/projects", { method: "POST", body }),
  update: (id, body) => apiClient(`/projects/${id}`, { method: "PATCH", body }),
  remove: (id) => apiClient(`/projects/${id}`, { method: "DELETE" }),
  requestReview: (id, note) => apiClient(`/projects/${id}/request-review`, { method: "POST", body: { note } }),
  scheduleMeeting: (id, body) => apiClient(`/projects/${id}/meetings`, { method: "POST", body }),
  addResource: (id, body) => apiClient(`/projects/${id}/resources`, { method: "POST", body }),
  addDocumentation: (id, body) => apiClient(`/projects/${id}/documentation`, { method: "POST", body }),
  removeDocumentation: (id, key) => apiClient(`/projects/${id}/documentation/${key}`, { method: "DELETE" }),
  removeResource: (id, resourceId) => apiClient(`/projects/${id}/resources/${resourceId}`, { method: "DELETE" }),
};
