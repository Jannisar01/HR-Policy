import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: import("react").ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col justify-between gap-4 md:flex-row md:items-end", className)}>
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </section>
  );
}
