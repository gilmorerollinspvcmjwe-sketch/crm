import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed md:text-sm transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-9",
        lg: "h-10",
      },
      variant: {
        default: "border-input focus-visible:ring-ring",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, variant, error, success, ...props }, ref) => {
    const resolvedVariant = error ? "error" : success ? "success" : variant
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, variant: resolvedVariant, className }))}
        ref={ref}
        aria-invalid={error || undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
