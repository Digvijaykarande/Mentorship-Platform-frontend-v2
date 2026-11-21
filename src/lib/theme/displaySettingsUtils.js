export const applyDisplaySettings = (settings) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const theme = settings?.theme || "light";
  const density = settings?.density || "comfortable";
  const highContrast = !!settings?.highContrast;
  const reducedMotion = !!settings?.reducedMotion;
  const monospaceNumbers =
    settings?.monospaceNumbers !== undefined ? settings.monospaceNumbers : true;
  // 1. Theme application
  let isDark = false;
  if (theme === "dark") {
    isDark = true;
  } else if (theme === "system") {
    isDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  // 2. Layout density
  if (density === "compact") {
    root.classList.add("density-compact");
  } else {
    root.classList.remove("density-compact");
  }
  // 3. High Contrast
  if (highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }
  // 4. Reduced Motion
  if (reducedMotion) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }
  // 5. Tabular / Monospace Numbers
  if (monospaceNumbers) {
    root.classList.add("tabular-nums");
  } else {
    root.classList.remove("tabular-nums");
  }
};
