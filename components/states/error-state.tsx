import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-2xl border-red-200/70 bg-red-50/70 p-6 dark:border-red-900 dark:bg-red-950/40">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </p>
      <p className="mt-2 text-sm text-red-700/80 dark:text-red-200/80">{description}</p>
    </Card>
  );
}
