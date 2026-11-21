import { apiClient, apiRequest, queryString } from "./client";

export const usersApi = {
  list: async (params) => (await apiRequest(`/users${queryString({ limit: 500, ...params })}`)).data,
  mentors: () => apiClient("/users/mentors"),
  create: (body) => apiClient("/users", { method: "POST", body }),
  update: (id, body) => apiClient(`/users/${id}`, { method: "PATCH", body }),
  approve: (id) => apiClient(`/users/${id}/approve`, { method: "POST" }),
  deactivate: (id) => apiClient(`/users/${id}`, { method: "DELETE" }),
  resetPassword: (id, newPassword) =>
    apiClient(`/users/${id}/reset-password`, { method: "POST", body: { newPassword } }),
};

export const adminApi = {
  overview: () => apiClient("/admin/overview"),
};
