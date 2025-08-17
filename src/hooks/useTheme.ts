import { useState, useEffect } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ao-blog-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Apply theme to document
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
