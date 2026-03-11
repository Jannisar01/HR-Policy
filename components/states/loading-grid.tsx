import { Card } from "@/components/ui/card";

export function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card className="rounded-2xl p-5" key={index}>
          <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mb-2 h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </Card>
      ))}
    </div>
  );
}
