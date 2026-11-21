import { apiClient, apiRequest, queryString } from "./client";

export const feedbackApi = {
  list: async (params) => (await apiRequest(`/feedback${queryString({ limit: 500, ...params })}`)).data,
  give: (body) => apiClient("/feedback", { method: "POST", body }),
  request: (body) => apiClient("/feedback/request", { method: "POST", body }),
  respond: (id, body) => apiClient(`/feedback/${id}/respond`, { method: "POST", body }),
  setStatus: (id, status) => apiClient(`/feedback/${id}/status`, { method: "PATCH", body: { status } }),
  addSuggestion: (id, index) => apiClient(`/feedback/${id}/suggestions/${index}`, { method: "POST" }),
};
