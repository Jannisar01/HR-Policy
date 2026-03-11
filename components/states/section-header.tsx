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
      <div className="space-y-2.5">
        {eyebrow ? (
          <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="max-w-3xl text-[15px] leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </section>
  );
}
