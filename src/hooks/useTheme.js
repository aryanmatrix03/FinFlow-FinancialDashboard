/**
 * useTheme — manages dark / light theme preference.
 *
 * Persists the choice to localStorage so it survives page reloads.
 * Reads the OS preference as the default when no stored value exists.
 *
 * Returns:
 *   theme       {"dark"|"light"}
 *   toggleTheme () => void
 *   isDark      boolean
 */

import { useState, useEffect } from "react";

const LS_THEME_KEY = "finflow_theme";

function getInitialTheme() {
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply data-theme attribute to <html> so CSS variables cascade globally
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(LS_THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, isDark: theme === "dark" };
}
