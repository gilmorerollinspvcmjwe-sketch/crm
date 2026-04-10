"use client"

import type { ReactNode } from "react"
import {
  type FieldValues,
  type UseFormReturn,
  FormProvider as RHFProvider,
} from "react-hook-form"

import { cn } from "@/lib/utils"

// Re-export for convenience
export { type UseFormReturn, type FieldValues } from "react-hook-form"

// ============ Typed Form Provider Props ============

export interface FormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
> {
  children: ReactNode
  form: UseFormReturn<TFieldValues, TContext>
}

// ============ Form Provider ============

export function FormProvider<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
>({ children, form }: FormProviderProps<TFieldValues, TContext>) {
  return <RHFProvider {...form}>{children}</RHFProvider>
}

// ============ Form Layout Grid ============

export interface FormGridProps {
  cols?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
}

export function FormGrid({ cols = 2, className, children }: FormGridProps) {
  const gridCols: Record<1 | 2 | 3 | 4, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4", gridCols[cols], className)}>
      {children}
    </div>
  )
}

// ============ Form Section ============

export interface FormSectionProps {
  title?: string
  description?: string
  className?: string
  children: ReactNode
}

export function FormSection({
  title,
  description,
  className,
  children,
}: FormSectionProps) {
  return (
    <fieldset className={cn("space-y-4", className)}>
      {title && (
        <legend className="text-lg font-semibold text-foreground">
          {title}
        </legend>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

// ============ Form Actions (Footer) ============

export interface FormActionsProps {
  className?: string
  children: ReactNode
  align?: "left" | "center" | "right"
}

export function FormActions({
  className,
  children,
  align = "right",
}: FormActionsProps) {
  const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }

  return (
    <div className={cn("flex gap-3 pt-4", alignMap[align], className)}>
      {children}
    </div>
  )
}

// ============ Form - Full Page Wrapper ============

export interface FormRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
> {
  form: UseFormReturn<TFieldValues, TContext>
  onSubmit: (values: TFieldValues) => void | Promise<void>
  onError?: (errors: Record<string, unknown>) => void
  className?: string
  children: ReactNode
}

export function FormRoot<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown
>({
  form,
  onSubmit,
  onError,
  className,
  children,
}: FormRootProps<TFieldValues, TContext>) {
  return (
    <RHFProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("space-y-6", className)}
      >
        {children}
      </form>
    </RHFProvider>
  )
}
