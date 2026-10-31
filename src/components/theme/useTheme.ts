"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  DEFAULT_THEME,
  readTheme,
  subscribeTheme,
  writeTheme,
} from "./theme-store";

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => DEFAULT_THEME,
  );

  const toggleTheme = useCallback(() => {
    writeTheme(readTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}
