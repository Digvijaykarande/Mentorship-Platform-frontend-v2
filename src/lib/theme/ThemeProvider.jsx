"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  THEME_CHANGE_EVENT,
} from "./ThemeContext";

const isTheme = (value) =>
  value === "light" || value === "dark" || value === "system";

const noopSubscribe = () => () => {};

const subscribeSystemPreference = (callback) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const readSystemPreference = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * Light / dark / system theme provider.
 *
 * Reads the saved choice with `useSyncExternalStore`, so the first client render matches the
 * server HTML (no hydration warnings) and every tab or micro-frontend stays in sync through
 * the `storage` event and `THEME_CHANGE_EVENT`.
 */
export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
  userTheme,
  onThemeChange,
  forcedTheme,
}) => {
  const subscribeStorage = useCallback((callback) => {
    window.addEventListener("storage", callback);
    window.addEventListener(THEME_CHANGE_EVENT, callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener(THEME_CHANGE_EVENT, callback);
    };
  }, []);

  const savedTheme = useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        const stored = localStorage.getItem(storageKey);
        return isTheme(stored) ? stored : null;
      } catch {
        return null;
      }
    },
    () => null
  );

  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemPreference,
    readSystemPreference,
    () => false
  );
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Priority: forced > saved by the user on this device > account preference > default.
  const theme =
    forcedTheme ||
    savedTheme ||
    (isTheme(userTheme) ? userTheme : defaultTheme);

  const isDarkMode = theme === "dark" || (theme === "system" && systemPrefersDark);

  // Apply the theme class to <html>. The inline init script already handled the first paint.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, mounted]);

  const setTheme = useCallback(
    (newTheme) => {
      if (forcedTheme || !isTheme(newTheme)) return;
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // storage unavailable (private mode, quota): the choice just won't persist
      }
      // Notify this tab's other consumers; other tabs get the native `storage` event.
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: newTheme }));
      onThemeChange?.(newTheme);
    },
    [forcedTheme, storageKey, onThemeChange]
  );

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark");
  }, [isDarkMode, setTheme]);

  const contextValue = useMemo(
    () => ({ theme, setTheme, isDarkMode, toggleTheme, systemPrefersDark }),
    [theme, setTheme, isDarkMode, toggleTheme, systemPrefersDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
