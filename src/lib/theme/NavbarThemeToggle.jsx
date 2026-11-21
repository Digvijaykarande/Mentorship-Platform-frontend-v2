"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeContext";
import { cn } from "@/lib/utils";
export const NavbarThemeToggle = ({
  isDarkMode: isDarkModeProp,
  onToggleTheme,
  className,
  id = "navbar-theme-toggle",
}) => {
  const { isDarkMode: contextDark, toggleTheme } = useTheme();
  const isDarkMode =
    isDarkModeProp !== undefined ? isDarkModeProp : contextDark;
  const handleToggle = onToggleTheme || toggleTheme;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      id={id}
      onClick={handleToggle}
      className={cn(
        "w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-transparent transition-colors shrink-0 cursor-pointer p-0",
        className
      )}
      aria-label="Toggle theme"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
};
export default NavbarThemeToggle;
