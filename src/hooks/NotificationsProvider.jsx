"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, Award, BellRing, CheckCircle2, FolderKanban, MessageSquare, Upload, UserCheck } from "lucide-react";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toUiNotification } from "@/lib/workspace/adapters";

const POLL_MS = 45_000;

/** Icon per notification type; anything unknown gets the bell. */
const ICONS = {
  "task-assigned": FolderKanban,
  "project-assigned": FolderKanban,
  "step-approved": CheckCircle2,
  "step-completed": Upload,
  "changes-requested": AlertCircle,
  "revision-requested": AlertCircle,
  "submission-approved": Award,
  "submission-received": Upload,
  "submission-revised": Upload,
  "feedback-received": MessageSquare,
  "feedback-requested": MessageSquare,
  "review-requested": UserCheck,
  "meeting-requested": UserCheck,
  "account-approved": UserCheck,
};

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    try {
      const list = await notificationsApi.list();
      setItems(list.map(toUiNotification));
    } catch {
      // Notifications are non-critical; keep what we already show and retry on the next tick.
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    load();
    const tick = () => document.visibilityState === "visible" && load();
    const timer = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [isAuthenticated, load]);

  /** Update the screen first, tell the server, and put things back if the server says no. */
  const optimistic = useCallback(
    async (apply, request) => {
      let previous;
      setItems((current) => {
        previous = current;
        return apply(current);
      });
      try {
        await request();
      } catch {
        setItems(previous);
      }
    },
    [],
  );

  const toggleRead = useCallback(
    (id) => optimistic((list) => list.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)), () => notificationsApi.toggleRead(id)),
    [optimistic],
  );
  const deleteNotification = useCallback(
    (id) => optimistic((list) => list.filter((n) => n.id !== id), () => notificationsApi.remove(id)),
    [optimistic],
  );
  const markAllRead = useCallback(
    () => optimistic((list) => list.map((n) => ({ ...n, unread: false })), () => notificationsApi.markAllRead()),
    [optimistic],
  );
  const clearAll = useCallback(() => optimistic(() => [], () => notificationsApi.clearAll()), [optimistic]);

  const notifications = useMemo(() => items.map((n) => ({ ...n, icon: ICONS[n.type] ?? BellRing })), [items]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => n.unread).length,
      toggleRead,
      deleteNotification,
      markAllRead,
      clearAll,
      refresh: load,
    }),
    [notifications, toggleRead, deleteNotification, markAllRead, clearAll, load],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
