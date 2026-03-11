import type { ComponentType } from "react";
import {
  BarChart3,
  FileSearch,
  FolderKanban,
  LayoutDashboard,
  Settings,
  ShieldCheck
} from "lucide-react";

export type AppNavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Operations and usage overview"
  },
  {
    title: "Policy Assistant",
    href: "/policy-assistant",
    icon: FileSearch,
    description: "Citation-grounded policy Q&A"
  },
  {
    title: "Sources",
    href: "/sources",
    icon: FolderKanban,
    description: "Approved source management"
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    description: "Access and governance controls"
  },
  {
    title: "Evaluations",
    href: "/evaluations",
    icon: BarChart3,
    description: "Quality and model performance"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Workspace configuration"
  }
];
