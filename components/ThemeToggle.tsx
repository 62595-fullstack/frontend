"use client";

import { useTheme } from "@/lib/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-brand w-min fixed bottom-4 right-4 z-50"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
