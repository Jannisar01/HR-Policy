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
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/90 text-muted-foreground transition hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
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
