"use client"

import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  Controller,
} from "react-hook-form"
import type { ReactNode } from "react"

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFieldValues = any

// ============ Extended FormField Props ============

export interface FormFieldExtendedProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  /** Field label text */
  label?: string
  /** Mark field as required (adds red asterisk) */
  required?: boolean
  /** Help text shown below the input */
  description?: string
  /** Custom class for the container */
  containerClassName?: string
  /** Custom class for the label */
  labelClassName?: string
  /** Custom class for the control wrapper */
  controlClassName?: string
  /** Custom class for the description */
  descriptionClassName?: string
  /** Custom class for the error message */
  messageClassName?: string
  /** Hide the error message */
  hideError?: boolean
  /**
   * Render prop that receives the field object.
   *
   * @example
   * {({ field }) => <Input {...field} placeholder="..." />}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (field: GenericFieldValues) => ReactNode
}

// ============ FormField ============

/**
 * Smart FormField that auto-connects to RHF controller
 * and renders label, description, and error messages automatically.
 *
 * @example
 * <FormField
 *   control={form.control}
 *   name="email"
 *   label="邮箱"
 *   required
 *   description="用于登录"
 * >
 *   {({ field }) => <Input {...field} placeholder="请输入邮箱" />}
 * </FormField>
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  required,
  description,
  containerClassName,
  labelClassName,
  controlClassName,
  descriptionClassName,
  messageClassName,
  hideError,
  children,
  ...props
}: FormFieldExtendedProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render={({ field }: any) => (
        <FormItem className={cn("space-y-1", containerClassName)}>
          {label && (
            <FormLabel className={labelClassName} required={required}>
              {label}
            </FormLabel>
          )}
          {description && !hideError && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
          <FormControl className={controlClassName}>
            {children({ field })}
          </FormControl>
          {!hideError && <FormMessage className={messageClassName} />}
        </FormItem>
      )}
    />
  )
}
