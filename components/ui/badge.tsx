import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: import("react").HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/70 bg-muted/70 px-2.5 py-1 text-xs font-semibold tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
