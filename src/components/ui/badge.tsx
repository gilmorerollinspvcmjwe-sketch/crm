import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-medium tracking-[0.02em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring/45 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary/18 bg-primary/10 text-primary",
        secondary: "border-border/70 bg-secondary text-secondary-foreground",
        destructive: "border-destructive/16 bg-destructive/9 text-destructive",
        outline: "border-border/80 bg-background text-foreground/82",
        info: "border-info/16 bg-info/9 text-info",
        success: "border-success/18 bg-success/9 text-success",
        warning: "border-warning/22 bg-warning/13 text-warning-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-[11px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  "aria-label"?: string
}

function Badge({ className, variant, size, "aria-label": ariaLabel, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      aria-label={ariaLabel}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
