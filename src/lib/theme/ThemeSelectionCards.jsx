"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "./ThemeContext";
import { cn } from "@/lib/utils";
import { LightThemeCard, DarkThemeCard, SystemThemeCard } from "./ThemeCards";

export const ThemeSelectionCards = ({
  theme: themeProp,
  systemPrefersDark: systemPrefersDarkProp,
  onSelectTheme,
  className,
}) => {
  const context = useTheme();
  const theme = themeProp !== undefined ? themeProp : context.theme;
  const systemPrefersDark =
    systemPrefersDarkProp !== undefined
      ? systemPrefersDarkProp
      : context.systemPrefersDark;

  const handleSelect = (selectedTheme) => {
    if (onSelectTheme) {
      onSelectTheme(selectedTheme);
    } else {
      context.setTheme(selectedTheme);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground font-heading">
            Interface Theme
          </span>
          <Badge
            variant="outline"
            className="text-[10px] font-medium bg-muted/60 text-muted-foreground border-border/70 px-2 py-0.5 rounded-full"
          >
            Instant Switch
          </Badge>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Changes apply instantly across all open screens, modals, and navigation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <LightThemeCard active={theme === "light"} onSelect={handleSelect} />
        <DarkThemeCard active={theme === "dark"} onSelect={handleSelect} />
        <SystemThemeCard
          active={theme === "system"}
          onSelect={handleSelect}
          systemPrefersDark={systemPrefersDark}
        />
      </div>
    </div>
  );
};

export default ThemeSelectionCards;
