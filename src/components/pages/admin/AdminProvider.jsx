"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usersApi } from "@/lib/api";
import { buildPlatform } from "./adminData";

const AdminContext = createContext(null);

/** Loads every account once for the whole admin area and exposes the account actions. */
export function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setUsers(await usersApi.list());
      setError("");
    } catch (e) {
      setError(e?.message || "Could not load accounts.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  const run = useCallback(async (fn) => {
    await fn();
    await load();
  }, [load]);

  const value = useMemo(
    () => ({
      users,
      ready,
      error,
      platform: buildPlatform(users),
      reload: load,
      approve: (id) => run(() => usersApi.approve(id)),
      deactivate: (id) => run(() => usersApi.deactivate(id)),
      reactivate: (id) => run(() => usersApi.update(id, { isActive: true })),
    }),
    [users, ready, error, load, run],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
