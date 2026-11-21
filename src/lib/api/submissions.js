import { apiClient, apiRequest, queryString } from "./client";

export const submissionsApi = {
  list: async (params) => (await apiRequest(`/submissions${queryString({ limit: 500, ...params })}`)).data,
  get: (id) => apiClient(`/submissions/${id}`),
  /** Resolves to { submission, changed } so callers can tell "nothing to save" from a real save. */
  async create(body) {
    const res = await apiRequest("/submissions", { method: "POST", body });
    return { submission: res.data, changed: res.meta?.changed !== false };
  },
  async update(id, body) {
    const res = await apiRequest(`/submissions/${id}`, { method: "PUT", body });
    return { submission: res.data, changed: res.meta?.changed !== false };
  },
  async revise(id, body) {
    const res = await apiRequest(`/submissions/${id}/revisions`, { method: "POST", body });
    return { submission: res.data, changed: true };
  },
  withdraw: (id) => apiClient(`/submissions/${id}/withdraw`, { method: "POST" }),
  restore: (id) => apiClient(`/submissions/${id}/restore`, { method: "POST" }),
  remove: (id) => apiClient(`/submissions/${id}`, { method: "DELETE" }),
  review: (id, body) => apiClient(`/submissions/${id}/review`, { method: "POST", body }),
};
