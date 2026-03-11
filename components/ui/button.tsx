import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-glow active:translate-y-0",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary/12 text-secondary hover:bg-secondary/20"
      },
      size: {
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

type ButtonProps = import("react").ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
