"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean
  /** Show optional text instead of required asterisk */
  optional?: boolean
}

export function FormLabel({
  required,
  optional,
  children,
  className,
  ...props
}: FormLabelProps) {
  return (
    <Label
      className={cn(
        required && "after:content-['*'] after:text-red-500 after:ml-0.5",
        optional && "after:content-['(可选)'] after:text-muted-foreground after:ml-1 after:text-xs",
        className
      )}
      {...props}
    >
      {children}
    </Label>
  )
}
