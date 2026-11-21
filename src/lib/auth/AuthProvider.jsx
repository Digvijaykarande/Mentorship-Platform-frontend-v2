"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, authApi, authStorage, refreshSession, setAuthLostHandler } from "@/lib/api";

const AuthContext = createContext(null);

/** Where each role lands after signing in. */
export const HOME_BY_ROLE = { admin: "/admin", mentor: "/mentor", intern: "/dashboard" };
export const homeFor = (user) => HOME_BY_ROLE[user?.role] ?? "/dashboard";

const isPendingMentor = (user) => user?.role === "mentor" && !user.isApproved;
const PENDING_MESSAGE = "Your mentor account is waiting for admin approval. You will be able to sign in once it is approved.";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | anonymous

  const clear = useCallback(() => {
    authStorage.removeToken();
    setUser(null);
    setStatus("anonymous");
  }, []);

  // Restore the session after a reload from the httpOnly refresh cookie.
  useEffect(() => {
    let cancelled = false;
    setAuthLostHandler(clear);
    (async () => {
      const session = await refreshSession();
      if (cancelled) return;
      if (session?.user && !isPendingMentor(session.user)) {
        setUser(session.user);
        setStatus("authenticated");
      } else {
        clear();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clear]);

  const login = useCallback(async ({ email, password, remember }) => {
    const session = await authApi.login({ email, password, remember });
    if (isPendingMentor(session.user)) {
      await authApi.logout();
      throw new ApiError(PENDING_MESSAGE, 403, { code: "MENTOR_NOT_APPROVED" });
    }
    setUser(session.user);
    setStatus("authenticated");
    return session.user;
  }, []);

  /** Resolves to { user, pendingApproval }. Mentors must be approved by an admin before they can sign in. */
  const register = useCallback(async (input) => {
    const session = await authApi.register(input);
    if (isPendingMentor(session.user)) {
      await authApi.logout();
      return { user: session.user, pendingApproval: true };
    }
    setUser(session.user);
    setStatus("authenticated");
    return { user: session.user, pendingApproval: false };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clear();
    }
  }, [clear]);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, register, logout, setUser }),
    [user, status, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const PENDING_APPROVAL_MESSAGE = PENDING_MESSAGE;
