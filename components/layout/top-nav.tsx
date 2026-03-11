"use client";

import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-script";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
            placeholder="Search policies, sources, or actions"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted"
          >
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <div className="hidden rounded-lg border border-border bg-card px-3 py-1.5 text-sm md:block">
            HR Operations
          </div>
        </div>
      </div>
    </header>
  );
}
