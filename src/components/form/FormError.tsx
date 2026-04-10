"use client"

import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FormErrorProps {
  /** Error message to display */
  message?: string
  /** Custom className */
  className?: string
  /** Show icon */
  showIcon?: boolean
}

export function FormError({
  message,
  className,
  showIcon = false,
}: FormErrorProps) {
  if (!message) return null

  return (
    <p className={cn("flex items-center gap-1 text-sm font-medium text-red-500", className)}>
      {showIcon && <AlertCircle className="h-3.5 w-3.5" />}
      {message}
    </p>
  )
}

// ============ Inline Error ============

export interface FormInlineErrorProps extends FormErrorProps {}

export function FormInlineError({ message, className, showIcon = true }: FormInlineErrorProps) {
  return (
    <FormError
      message={message}
      className={cn("mt-1 text-xs", className)}
      showIcon={showIcon}
    />
  )
}

// ============ Form Help Text ============

export interface FormHelpTextProps {
  text?: string
  className?: string
}

export function FormHelpText({ text, className }: FormHelpTextProps) {
  if (!text) return null

  return (
    <p className={cn("mt-1 text-xs text-muted-foreground", className)}>
      {text}
    </p>
  )
}
