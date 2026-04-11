import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.875rem] text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default: 
          "bg-foreground text-background shadow-[var(--shadow-sm)] hover:bg-foreground/92 hover:shadow-[var(--shadow-md)]",
        destructive: 
          "border border-destructive/18 bg-destructive/10 text-destructive hover:bg-destructive/14 hover:border-destructive/26",
        outline: 
          "border border-border/80 bg-background text-foreground shadow-[var(--shadow-sm)] hover:border-border hover:bg-accent/70",
        secondary: 
          "border border-border/70 bg-secondary/82 text-secondary-foreground hover:bg-secondary hover:text-foreground",
        ghost: 
          "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        link: 
          "text-foreground/88 underline-offset-4 hover:text-foreground hover:underline",
        success:
          "border border-success/20 bg-success/10 text-success hover:bg-success/14",
        warning:
          "border border-warning/24 bg-warning/12 text-warning-foreground hover:bg-warning/18",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-[1rem] px-6",
        xl: "h-12 rounded-[1rem] px-8 text-base",
        icon: "h-10 w-10 rounded-[0.875rem]",
        iconSm: "h-8 w-8 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
