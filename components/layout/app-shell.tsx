import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export function AppShell({ children }: { children: import("react").ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNav />
          {children}
        </div>
      </div>
    </div>
  );
}
