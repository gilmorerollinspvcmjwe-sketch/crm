"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import { Modal } from "@/components/modal/Dialog"
import type { CustomObject, ObjectProperty, ObjectRecord, PropertyOption } from "@/types/customObject"
import { cn } from "@/lib/utils"

// ============ Field Renderers ============

interface FieldInputProps {
  property: ObjectProperty
  control: ReturnType<typeof useForm>["control"]
  errors: Record<string, unknown>
}

function TextField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            placeholder={property.placeholder}
            className={errors[property.name] ? "border-red-500" : ""}
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      )}
    />
  )
}

function TextareaField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            {...field}
            id={property.name}
            placeholder={property.placeholder}
            rows={3}
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function NumberField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as number ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            type="number"
            placeholder={property.placeholder}
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function SelectField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={property.name} className={errors[property.name] ? "border-red-500" : ""}>
              <SelectValue placeholder={property.placeholder || "请选择"} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.filter(o => o.enabled).map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    {opt.color && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} />
                    )}
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  )
}

function RadioField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-wrap gap-3"
          >
            {property.options?.filter(o => o.enabled).map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value={opt.value} />
                {opt.color && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} />
                )}
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}
    />
  )
}

function MultiSelectField({ property, control, errors }: FieldInputProps) {
  const [selected, setSelected] = React.useState<string[]>(
    (property.defaultValue as string[]) ?? []
  )

  const toggleOption = (value: string) => {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <div className="space-y-1.5">
      <Label>
        {property.label}
        {property.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {property.options?.filter(o => o.enabled).map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleOption(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer",
              selected.includes(opt.value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {opt.color && (
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
            )}
            {opt.label}
          </button>
        ))}
      </div>
      {/* Hidden input for form value */}
      <input type="hidden" name={property.name} value={JSON.stringify(selected)} />
    </div>
  )
}

function SwitchField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as boolean ?? false}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Switch
            id={property.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={property.name} className="cursor-pointer">
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      )}
    />
  )
}

function DateField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            type="date"
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function CurrencyField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as number ?? 0}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
            <Input
              {...field}
              id={property.name}
              type="number"
              step="0.01"
              className={cn("pl-7", errors[property.name] ? "border-red-500" : "")}
            />
          </div>
        </div>
      )}
    />
  )
}

function PercentField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as number ?? 0}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <Input
              {...field}
              id={property.name}
              type="number"
              min={0}
              max={100}
              className={cn("pr-7", errors[property.name] ? "border-red-500" : "")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
      )}
    />
  )
}

function EmailField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            type="email"
            placeholder={property.placeholder}
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function PhoneField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            type="tel"
            placeholder={property.placeholder}
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function UrlField({ property, control, errors }: FieldInputProps) {
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            {...field}
            id={property.name}
            type="url"
            placeholder={property.placeholder || "https://"}
            className={errors[property.name] ? "border-red-500" : ""}
          />
        </div>
      )}
    />
  )
}

function UserField({ property, control, errors }: FieldInputProps) {
  const users = ["张明", "李华", "王芳", "刘强", "赵敏", "陈伟"]
  return (
    <Controller
      name={property.name}
      control={control}
      defaultValue={property.defaultValue as string ?? ""}
      render={({ field }) => (
        <div className="space-y-1.5">
          <Label htmlFor={property.name}>
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={property.name} className={errors[property.name] ? "border-red-500" : ""}>
              <SelectValue placeholder="选择用户" />
            </SelectTrigger>
            <SelectContent>
              {users.map(u => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  )
}

// ============ Field Dispatcher ============

interface FieldDispatcherProps {
  property: ObjectProperty
  control: ReturnType<typeof useForm>["control"]
  errors: Record<string, unknown>
}

function FieldDispatcher({ property, control, errors }: FieldDispatcherProps) {
  const type = property.internalType
  switch (type) {
    case "text":
    case "textarea":
      return type === "textarea" ? (
        <TextareaField property={property} control={control} errors={errors} />
      ) : (
        <TextField property={property} control={control} errors={errors} />
      )
    case "number":
    case "decimal":
      return <NumberField property={property} control={control} errors={errors} />
    case "select":
      return <SelectField property={property} control={control} errors={errors} />
    case "radio":
      return <RadioField property={property} control={control} errors={errors} />
    case "multiselect":
      return <MultiSelectField property={property} control={control} errors={errors} />
    case "switch":
    case "checkbox":
      return <SwitchField property={property} control={control} errors={errors} />
    case "date":
    case "datetime":
    case "time":
      return <DateField property={property} control={control} errors={errors} />
    case "currency":
      return <CurrencyField property={property} control={control} errors={errors} />
    case "percent":
      return <PercentField property={property} control={control} errors={errors} />
    case "email":
      return <EmailField property={property} control={control} errors={errors} />
    case "phone":
      return <PhoneField property={property} control={control} errors={errors} />
    case "url":
      return <UrlField property={property} control={control} errors={errors} />
    case "user":
      return <UserField property={property} control={control} errors={errors} />
    case "textarea":
      return <TextareaField property={property} control={control} errors={errors} />
    default:
      return <TextField property={property} control={control} errors={errors} />
  }
}

// ============ Main Form Component ============

interface CustomObjectRecordFormProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => void
  objectDef: CustomObject
  properties: ObjectProperty[]
  record?: ObjectRecord | null
}

export function CustomObjectRecordForm({
  open,
  onClose,
  onSave,
  objectDef,
  properties,
  record,
}: CustomObjectRecordFormProps) {
  const editableProps = properties.filter(p => !p.validation?.readOnly && p.enabled)
  const primaryProp = properties.find(p => p.isPrimary)
  const secondaryProps = editableProps.filter(p => !p.isPrimary)

  const defaultValues: Record<string, unknown> = {}
  properties.forEach(p => {
    if (record?.data[p.name] !== undefined) {
      defaultValues[p.name] = record.data[p.name]
    } else if (p.defaultValue !== undefined) {
      defaultValues[p.name] = p.defaultValue
    } else {
      defaultValues[p.name] = ""
    }
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  })

  React.useEffect(() => {
    if (open) {
      const vals: Record<string, unknown> = {}
      properties.forEach(p => {
        if (record?.data[p.name] !== undefined) {
          vals[p.name] = record.data[p.name]
        } else if (p.defaultValue !== undefined) {
          vals[p.name] = p.defaultValue
        } else {
          vals[p.name] = ""
        }
      })
      reset(vals)
    }
  }, [open, record, properties, reset])

  const onSubmit = (data: Record<string, unknown>) => {
    onSave(data)
  }

  const title = record ? `编辑 ${objectDef.singularName}` : `新建 ${objectDef.singularName}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={`填写 ${objectDef.singularName} 的详细信息`}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
        {/* Primary Field */}
        {primaryProp && (
          <div className="border-b pb-4">
            <FieldDispatcher
              property={primaryProp}
              control={control}
              errors={errors}
            />
          </div>
        )}

        {/* Secondary Fields - Two Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondaryProps.map(prop => (
            <div key={prop.id} className={prop.internalType === "textarea" ? "md:col-span-2" : ""}>
              <FieldDispatcher
                property={prop}
                control={control}
                errors={errors}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {record ? "保存修改" : "创建"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
