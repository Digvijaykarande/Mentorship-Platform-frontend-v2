import { apiClient } from "./client";

export const notificationsApi = {
  list: () => apiClient("/notifications"),
  toggleRead: (id) => apiClient(`/notifications/${id}/toggle-read`, { method: "PATCH" }),
  markAllRead: () => apiClient("/notifications/mark-all-read", { method: "POST" }),
  remove: (id) => apiClient(`/notifications/${id}`, { method: "DELETE" }),
  clearAll: () => apiClient("/notifications/clear-all", { method: "DELETE" }),
};
