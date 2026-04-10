import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const checkboxStyles = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "",
        destructive: "data-[state=checked]:bg-destructive data-[state=checked]:border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'>,
    VariantProps<typeof checkboxStyles> {
  type?: 'checkbox' | 'radio'
  checked?: boolean | 'indeterminate'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, variant, type = 'checkbox', checked, onCheckedChange, ...props }, ref) => {
    const isChecked = checked === true || checked === 'indeterminate'
    const isIndeterminate = checked === 'indeterminate'

    return (
      <button
        type="button"
        role={type === 'radio' ? 'radio' : 'checkbox'}
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        data-state={isChecked ? 'checked' : 'unchecked'}
        className={cn(checkboxStyles({ variant, className }))}
        ref={ref}
        onClick={() => {
          if (onCheckedChange) {
            onCheckedChange(!isChecked)
          }
        }}
        {...props}
      >
        {isChecked && (
          type === 'checkbox' ? (
            isIndeterminate ? (
              <div className="h-4 w-4 rounded-sm bg-white/80" />
            ) : (
              <Check className="h-4 w-4 text-white" />
            )
          ) : (
            <Check className="h-4 w-4 text-white" />
          )
        )}
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
