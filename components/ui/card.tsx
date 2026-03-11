import { cn } from "@/lib/utils";

export function Card({ className, ...props }: import("react").HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface-panel p-0 transition-all duration-200", className)} {...props} />;
}
