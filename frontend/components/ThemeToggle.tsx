"use client";
import { useEffect, useState } from "react";

const THEMES = ["corporate", "dark"] as const;

type Theme = typeof THEMES[number];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored && THEMES.includes(stored)) return stored;
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" as Theme : "corporate" as Theme;
    }
    return "corporate";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  function toggle() {
    setTheme((prev) => (prev === "corporate" ? "dark" : "corporate"));
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="btn btn-circle btn-ghost"
      onClick={toggle}
    >
      {theme === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M21.64 13.65a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.4-10.4 1 1 0 0 0-.14-1.05A1 1 0 0 0 8 2a10 10 0 1 0 14 14 1 1 0 0 0-.36-2.35Z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-14a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.22 5.64a1 1 0 0 1-.7-1.7l.7-.7a1 1 0 1 1 1.4 1.4l-.7.7a1 1 0 0 1-.7.3Zm14.14 12.72a1 1 0 0 1 .7 1.7l-.7.7a1 1 0 0 1-1.4-1.4l.7-.7a1 1 0 0 1 .7-.3ZM2 13a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm18 0a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM5.64 19.78a1 1 0 0 1-.7-.3l-.7-.7a1 1 0 0 1 1.4-1.4l.7.7a1 1 0 0 1-.7 1.7Zm12.72-14.14a1 1 0 0 1-.7-.3l-.7-.7a1 1 0 0 1 1.4-1.4l.7.7a1 1 0 0 1-.7 1.7Z"/></svg>
      )}
    </button>
  );
}
