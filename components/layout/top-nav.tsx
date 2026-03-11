"use client";

import { Bell, Command, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-script";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="focus-ring group relative flex h-10 w-full max-w-xl items-center rounded-xl border border-border/70 bg-card px-3 text-left shadow-sm transition hover:border-primary/40 hover:shadow-soft"
        >
          <Search className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Search policies, sources, or actions</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/70 px-2 py-1 text-[11px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl border border-border/70 bg-card/80">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <div className="hidden rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-sm font-medium shadow-sm md:block">
            HR Operations
          </div>
        </div>
      </div>
    </header>
  );
}
