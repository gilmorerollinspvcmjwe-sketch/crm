import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// ============ Form Root ============

const Form = FormProvider

// ============ Form Field ============

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
        formItemId: `${props.name}-form-item`,
        formDescriptionId: `${props.name}-form-description`,
        formMessageId: `${props.name}-form-message`,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// ============ Form Item ============

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
})
FormItem.displayName = "FormItem"

// ============ Form Label ============

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean
  }
>(({ className, required, children, ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext)

  return (
    <Label
      ref={ref}
      className={cn(required && "after:content-['*'] after:text-red-500 after:ml-0.5", className)}
      htmlFor={fieldContext?.formItemId}
      {...props}
    >
      {children}
    </Label>
  )
})
FormLabel.displayName = "FormLabel"

// ============ Form Control ============

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const formContext = useFormContext()
  const fieldContext = React.useContext(FormFieldContext)
  
  if (!fieldContext) {
    throw new Error("FormControl must be used within a FormField")
  }

  // Safe fallback if not within FormProvider
  if (!formContext) {
    return (
      <Slot
        ref={ref}
        id={fieldContext.formItemId}
        {...props}
      />
    )
  }

  const { formState } = formContext!
  const fieldError = formState?.errors?.[fieldContext.name]

  return (
    <Slot
      ref={ref}
      id={fieldContext.formItemId}
      aria-describedby={
        fieldError
          ? `${fieldContext.formDescriptionId} ${fieldContext.formMessageId}`
          : `${fieldContext.formDescriptionId}`
      }
      aria-invalid={!!fieldError}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

// ============ Form Description ============

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext)

  return (
    <p
      ref={ref}
      id={fieldContext?.formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// ============ Form Message (Error) ============

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const formContext = useFormContext()
  const fieldContext = React.useContext(FormFieldContext)

  // Safe fallback if not within FormProvider
  if (!formContext || !fieldContext) {
    return null
  }

  const { formState } = formContext || {}
  if (!formState?.errors) {
    return null
  }
  
  const fieldError = formState.errors[fieldContext.name]

  const body = fieldError
    ? String(fieldError.message)
    : children

  if (!body || !fieldError) {
    return null
  }

  return (
    <p
      ref={ref}
      id={fieldContext?.formMessageId}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormContext,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
