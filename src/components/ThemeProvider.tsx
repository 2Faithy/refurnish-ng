"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "refurnish_theme";
const SETTINGS_KEY = "refurnish_settings";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSavedTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;

    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      return savedTheme;
    }

    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

    if (
      settings?.theme &&
      ["light", "dark", "system"].includes(settings.theme)
    ) {
      return settings.theme;
    }
  } catch {}

  return "light";
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolvedTheme);
  document.documentElement.setAttribute("data-theme", resolvedTheme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getSavedTheme();
    const resolved = saved === "system" ? getSystemTheme() : saved;

    setThemeState(saved);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const syncSystemTheme = () => {
        const resolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(resolved);
        applyTheme(resolved);
      };

      syncSystemTheme();

      mediaQuery.addEventListener("change", syncSystemTheme);
      return () => mediaQuery.removeEventListener("change", syncSystemTheme);
    }

    setResolvedTheme(theme);
    applyTheme(theme);
  }, [theme, mounted]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);

    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          ...settings,
          theme: nextTheme,
        })
      );
    } catch {}
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}