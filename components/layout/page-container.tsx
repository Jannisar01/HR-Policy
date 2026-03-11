import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className
}: {
  children: import("react").ReactNode;
  className?: string;
}) {
  return <main className={cn("mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8", className)}>{children}</main>;
}
