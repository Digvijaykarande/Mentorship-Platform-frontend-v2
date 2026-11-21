import { apiClient, authStorage } from "./client";

const keepToken = (session) => {
  if (session?.accessToken) authStorage.setToken(session.accessToken);
  return session;
};

export const authApi = {
  async login({ email, password, remember = true }) {
    return keepToken(await apiClient("/auth/login", { method: "POST", body: { email, password, remember }, auth: false }));
  },
  async register({ name, email, password, role = "intern" }) {
    return keepToken(await apiClient("/auth/register", { method: "POST", body: { name, email, password, role }, auth: false }));
  },
  async logout() {
    try {
      await apiClient("/auth/logout", { method: "POST", auth: false });
    } finally {
      authStorage.removeToken();
    }
  },
  async getMe() {
    return (await apiClient("/auth/me")).user;
  },
  async updateProfile(profile) {
    return (await apiClient("/auth/profile", { method: "PUT", body: profile })).user;
  },
  async updateSettings(settings) {
    return (await apiClient("/auth/settings", { method: "PATCH", body: settings })).user;
  },
  async changePassword({ currentPassword, newPassword }) {
    return keepToken(await apiClient("/auth/password", { method: "PUT", body: { currentPassword, newPassword } }));
  },
  async deleteAccount() {
    try {
      await apiClient("/auth/account", { method: "DELETE" });
    } finally {
      authStorage.removeToken();
    }
  },
  logoutAll() {
    return apiClient("/auth/logout-all", { method: "POST" }).finally(() => authStorage.removeToken());
  },
};
