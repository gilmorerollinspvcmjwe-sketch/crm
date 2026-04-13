import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-medium tracking-[0.02em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring/45 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary/14 bg-primary/7 text-primary",
        secondary: "border-border/70 bg-secondary/72 text-secondary-foreground",
        destructive: "border-destructive/12 bg-destructive/7 text-destructive",
        outline: "border-border/80 bg-background text-foreground/78",
        info: "border-info/12 bg-info/7 text-info",
        success: "border-success/14 bg-success/7 text-success",
        warning: "border-warning/16 bg-warning/9 text-warning-foreground",
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
