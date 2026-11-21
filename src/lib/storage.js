"use client";

import { useEffect, useSyncExternalStore } from "react";
import { uploadsApi } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Tiny shared store for the signed-in user's storage usage, so the profile card and every upload
 * dialog show the same numbers and update together after an upload or delete.
 */
let state = { status: "idle", me: null, users: [], defaults: null, maxFileBytes: 10 * 1024 * 1024 };
const listeners = new Set();
let inflight = null;

const emit = (next) => {
  state = next;
  listeners.forEach((l) => l());
};

export function loadStorage() {
  if (inflight) return inflight;
  if (state.status === "idle") emit({ ...state, status: "loading" });
  inflight = uploadsApi
    .usage()
    .then((data) => emit({ status: "ready", me: data.me, users: data.users ?? [], defaults: data.defaults ?? null, maxFileBytes: data.maxFileBytes ?? state.maxFileBytes }))
    .catch(() => emit({ ...state, status: state.me ? "ready" : "error" }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Re-fetch, but only if something on screen has already asked for the numbers. */
export function refreshStorage() {
  if (state.status !== "idle") return loadStorage();
  return Promise.resolve();
}

export function resetStorage() {
  emit({ status: "idle", me: null, users: [], defaults: null, maxFileBytes: state.maxFileBytes });
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStorage() {
  const { user } = useAuth();
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);
  useEffect(() => {
    // A different person signed in since the numbers were fetched: start over.
    if (user && state.me && state.me.id !== user.id) resetStorage();
    if (state.status === "idle") loadStorage();
  }, [user]);
  const me = snapshot.me;
  const unlimited = me ? me.quotaBytes === null : false;
  return {
    ...snapshot,
    unlimited,
    remaining: me ? (unlimited ? Infinity : me.remainingBytes) : Infinity,
    full: me?.level === "full",
    reload: loadStorage,
  };
}
