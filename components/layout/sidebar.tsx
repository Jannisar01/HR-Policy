"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { APP_NAV_ITEMS } from "@/components/layout/nav-config";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-border/70 bg-surface px-5 py-6 xl:flex">
      <div className="mb-8 surface-elevated p-3">
        <div className="flex items-center gap-3 px-1">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">HR Policy Platform</p>
            <p className="text-xs text-muted-foreground">Enterprise Workspace</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {APP_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring group flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200",
                active
                  ? "border-primary/30 bg-primary/95 text-primary-foreground shadow-soft"
                  : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-card hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg transition",
                  active ? "bg-primary-foreground/20" : "bg-muted/70 text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
