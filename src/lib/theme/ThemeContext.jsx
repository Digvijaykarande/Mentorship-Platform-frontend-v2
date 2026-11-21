"use client";

import { createContext, useContext } from "react";
import { THEME_STORAGE_KEY, THEME_CHANGE_EVENT } from "./themeConstants";

export { THEME_STORAGE_KEY, THEME_CHANGE_EVENT };
export const ThemeContext = createContext(undefined);
/**
 * Returns current system dark mode preference
 */
export const getSystemPrefersDark = () => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
/**
 * Hook to access current theme state and controls.
 * Works seamlessly within ThemeProvider, or gracefully falls back to DOM/localStorage
 * if called outside of a provider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context !== undefined) {
    return context;
  }
  // Fallback for isolated components or when ThemeProvider isn't wrapped yet
  const getFallbackTheme = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }
    }
    return "light";
  };
  const sysDark = getSystemPrefersDark();
  const theme = getFallbackTheme();
  const isDark = theme === "dark" || (theme === "system" && sysDark);
  const fallbackSetTheme = (newTheme) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // ignore storage errors
      }
      const shouldBeDark =
        newTheme === "dark" ||
        (newTheme === "system" && getSystemPrefersDark());
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      window.dispatchEvent(
        new CustomEvent(THEME_CHANGE_EVENT, { detail: newTheme })
      );
    }
  };
  return {
    theme,
    setTheme: fallbackSetTheme,
    isDarkMode: isDark,
    toggleTheme: () => fallbackSetTheme(isDark ? "light" : "dark"),
    systemPrefersDark: sysDark,
  };
};
