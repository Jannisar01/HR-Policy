import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className
}: {
  children: import("react").ReactNode;
  className?: string;
}) {
  return <main className={cn("mx-auto w-full max-w-7xl space-y-10 px-4 py-8 md:px-8 md:py-10", className)}>{children}</main>;
}
