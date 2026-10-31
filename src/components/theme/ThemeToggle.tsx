"use client";

import { SunIcon } from "@/components/ui/Icons";
import iconStyles from "@/components/ui/IconButton.module.css";
import { cx } from "@/lib/cx";

import { useTheme } from "./useTheme";

/**
 * Switches between the dark and light themes.
 * `icon` is a 44px square button; `row` shows the label next to the icon
 * (used inside the mobile menu) and takes its styling from `className`.
 */
export function ThemeToggle({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "row";
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "row") {
    return (
      <button type="button" className={className} onClick={toggleTheme}>
        <SunIcon />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cx(iconStyles.iconButton, className)}
      onClick={toggleTheme}
      aria-label={label}
    >
      <SunIcon />
    </button>
  );
}
