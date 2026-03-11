import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-2xl border-rose-200/80 bg-gradient-to-b from-rose-50 to-rose-50/70 p-6 dark:border-rose-900/70 dark:from-rose-950/50 dark:to-rose-950/30">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-rose-700/85 dark:text-rose-200/85">{description}</p>
    </Card>
  );
}
