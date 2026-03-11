import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  trend
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <Card className="rounded-2xl p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="h-3 w-3" />
        {trend}
      </p>
    </Card>
  );
}
