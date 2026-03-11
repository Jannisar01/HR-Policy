"use client";

import { useEffect, useState } from "react";

export function ThemeScript() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const persisted = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = persisted ? persisted === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  return null;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted"
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        window.localStorage.setItem("theme", next ? "dark" : "light");
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
