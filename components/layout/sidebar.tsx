"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { APP_NAV_ITEMS } from "@/components/layout/nav-config";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-card/80 px-5 py-6 backdrop-blur xl:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">HR Policy Platform</p>
          <p className="text-xs text-muted-foreground">Enterprise Workspace</p>
        </div>
      </div>

      <nav className="space-y-1">
        {APP_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
