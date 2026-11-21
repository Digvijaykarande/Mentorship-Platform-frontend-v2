"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
export const ThemeToggle = React.forwardRef(
  (
    {
      className,
      onClick,
      onToggleTheme,
      isDarkMode: isDarkModeProp,
      variant = "ghost",
      size = "icon",
      showTooltip = false,
      tooltipSide = "bottom",
      iconClassName,
      id = "theme-toggle-btn",
      title,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { isDarkMode: contextDark, toggleTheme } = useTheme();
    const effectiveDark =
      isDarkModeProp !== undefined ? isDarkModeProp : contextDark;
    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (onToggleTheme) {
        onToggleTheme();
      } else {
        toggleTheme();
      }
    };
    const labelText = effectiveDark
      ? "Switch to light mode"
      : "Switch to dark mode";
    const resolvedTitle = title || labelText;
    const resolvedAriaLabel = ariaLabel || labelText;
    const buttonContent = (
      <Button
        ref={ref}
        type="button"
        id={id}
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn(
          "relative flex items-center justify-center transition-colors cursor-pointer shrink-0",
          effectiveDark
            ? "text-muted-foreground hover:text-primary"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
        title={showTooltip ? undefined : resolvedTitle}
        aria-label={resolvedAriaLabel}
        {...props}
      >
        {effectiveDark ? (
          <Sun
            className={cn(
              "w-4 h-4 text-amber-500 dark:text-amber-400 animate-in spin-in-90 duration-300 transition-transform",
              iconClassName
            )}
          />
        ) : (
          <Moon
            className={cn(
              "w-4 h-4 text-slate-700 dark:text-slate-300 animate-in spin-in-90 duration-300 transition-transform",
              iconClassName
            )}
          />
        )}
      </Button>
    );
    if (!showTooltip) {
      return buttonContent;
    }
    return (
      <TooltipProvider delay={150}>
        <Tooltip>
          <TooltipTrigger render={buttonContent} />
          <TooltipContent
            side={tooltipSide}
            sideOffset={8}
            className="text-[11px] font-medium font-heading px-2.5 py-1 rounded-md shadow-md"
          >
            {resolvedTitle}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;
