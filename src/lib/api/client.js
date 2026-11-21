/**
 * Loyanox API client.
 *
 * - The access token lives in memory only. It is restored after a page reload by calling
 *   /auth/refresh, which uses the httpOnly refresh-token cookie (so XSS cannot steal a session).
 * - Every call sends cookies (`credentials: "include"`) and the Bearer token.
 * - An expired access token is refreshed once, transparently, and the request is retried.
 * - Success bodies look like { success, data, meta }; `apiClient` returns `data`, and
 *   `apiRequest` returns { data, meta } when pagination/meta is needed.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status = 500, { code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let accessToken = null;
let onAuthLost = () => {};

export const authStorage = {
  getToken: () => accessToken,
  setToken: (token) => {
    accessToken = token || null;
  },
  removeToken: () => {
    accessToken = null;
  },
};

/** The AuthProvider registers what should happen when the session cannot be recovered. */
export const setAuthLostHandler = (handler) => {
  onAuthLost = typeof handler === "function" ? handler : () => {};
};

const urlFor = (endpoint) =>
  /^https?:\/\//.test(endpoint) ? endpoint : `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;

async function send(endpoint, { method = "GET", body, headers = {}, auth = true, isFormData = false, signal } = {}) {
  const requestHeaders = { ...headers };
  if (body !== undefined && body !== null && !isFormData) requestHeaders["Content-Type"] = "application/json";
  if (auth && accessToken) requestHeaders.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(urlFor(endpoint), {
      method,
      headers: requestHeaders,
      credentials: "include",
      signal,
      body: body === undefined || body === null ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 204) return { status: 204, json: null };
  const json = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, json };
}

const toError = ({ status, json }) =>
  new ApiError(json?.message || `Request failed (${status})`, status, {
    code: json?.code,
    details: json?.errors,
  });

/* ------------------------- refresh (single flight) -------------------- */

let refreshing = null;

/** Exchanges the refresh cookie for a new access token. Resolves to the session or null. */
export function refreshSession() {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await send("/auth/refresh", { method: "POST", auth: false });
        if (!res.ok) return null;
        accessToken = res.json.data.accessToken;
        return res.json.data;
      } catch {
        return null;
      } finally {
        setTimeout(() => {
          refreshing = null;
        }, 0);
      }
    })();
  }
  return refreshing;
}

const RECOVERABLE = new Set(["TOKEN_EXPIRED", "NO_TOKEN", "INVALID_TOKEN"]);

export async function apiRequest(endpoint, options = {}) {
  let res = await send(endpoint, options);

  if (res.status === 401 && options.auth !== false && RECOVERABLE.has(res.json?.code)) {
    const session = await refreshSession();
    if (session) res = await send(endpoint, options);
    else {
      accessToken = null;
      onAuthLost();
    }
  }

  if (res.status === 204) return { data: null, meta: undefined };
  if (!res.ok) throw toError(res);
  return { data: res.json?.data ?? null, meta: res.json?.meta, message: res.json?.message };
}

export async function apiClient(endpoint, options = {}) {
  return (await apiRequest(endpoint, options)).data;
}

export const queryString = (params = {}) => {
  const clean = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return clean.length ? `?${new URLSearchParams(clean).toString()}` : "";
};
