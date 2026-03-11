import { cn } from "@/lib/utils";

export function Card({ className, ...props }: import("react").HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-card shadow-sm", className)} {...props} />;
}
