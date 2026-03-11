import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-2xl border-dashed border-border/80 bg-gradient-to-b from-card to-surface p-8 text-center">
      <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-muted/70 text-muted-foreground shadow-sm">
        <Inbox className="h-5 w-5" />
      </span>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
