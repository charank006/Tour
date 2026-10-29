import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary/10 text-primary hover:bg-primary/15",
        secondary:
          "border border-transparent bg-secondary/15 text-secondary hover:bg-secondary/20",
        destructive:
          "border border-transparent bg-destructive/10 text-destructive",
        outline:
          "border border-border bg-background/80 text-foreground/80 hover:bg-muted",
        wax:
          "bg-primary text-primary-foreground shadow-sm font-bold tracking-tight px-3 py-1 border border-white/20",
        stamp:
          "border border-dashed border-primary/40 bg-primary/5 text-primary tracking-wide uppercase text-[10px] px-2.5 py-0.5",
        tip:
          "bg-accent/15 text-accent-text border border-accent/20 font-medium",
        sky:
          "bg-sky-surface text-sky border border-sky/20 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
