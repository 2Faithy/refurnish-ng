"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme, type ThemeMode } from "@/components/ThemeProvider";

type ThemeSelectorProps = {
  onThemeChange?: (theme: ThemeMode) => void;
};

const themeOptions: {
  id: ThemeMode;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    id: "light",
    label: "Light",
    description: "Warm and bright",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark",
    description: "Low-light dashboard",
    icon: Moon,
  },
  {
    id: "system",
    label: "System",
    description: "Use device setting",
    icon: Monitor,
  },
];

export default function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleSelect = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    onThemeChange?.(nextTheme);
  };

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
        Theme
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const active = theme === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`relative rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                  : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)] hover:border-[#B66B44]/40"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="theme-active-indicator"
                  className="absolute top-3 right-3 size-2 rounded-full bg-[#B66B44]"
                />
              )}

              <Icon
                className={`size-5 mb-3 ${
                  active ? "text-[#E8CEB0]" : "text-[#B66B44]"
                }`}
              />

              <p className="text-sm font-bold">{option.label}</p>
              <p
                className={`text-[11px] mt-0.5 font-medium ${
                  active ? "text-[var(--bg-primary)]/70" : "text-[var(--text-muted)]"
                }`}
              >
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] font-medium mt-3">
        Current appearance:{" "}
        <span className="font-bold text-[#B66B44] capitalize">
          {resolvedTheme}
        </span>
      </p>
    </div>
  );
}