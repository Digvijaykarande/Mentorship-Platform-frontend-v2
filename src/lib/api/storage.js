import { apiClient } from "./client";

/** Admin > Storage: where files are kept (Cloudinary, Google Drive) and which one new uploads use. */
export const storageApi = {
  /** Both providers with live account details, what is stored where, recent changes and the Google redirect URI. */
  overview: ({ refresh = false } = {}) => apiClient(`/storage/overview${refresh ? "?refresh=1" : ""}`),
  /** Choose where NEW uploads go: "cloudinary" | "gdrive". Existing files stay where they are. */
  setActive: (provider) => apiClient("/storage/active", { method: "PUT", body: { provider } }),
  /** Save Google credentials (optional when already saved) and get the Google consent URL: { authUrl }. */
  connectDrive: (body = {}) => apiClient("/storage/providers/gdrive/connect", { method: "POST", body }),
  disconnect: (provider) => apiClient(`/storage/providers/${provider}`, { method: "DELETE" }),
};
