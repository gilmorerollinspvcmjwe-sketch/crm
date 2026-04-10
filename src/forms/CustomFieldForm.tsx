"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import { cn } from "@/lib/utils"

// ============ CustomField Types ============

export type CustomFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "textarea"
  | "phone"
  | "email"
  | "url"

export interface CustomFieldOption {
  label: string
  value: string
}

// ============ CustomField Schema ============

export const customFieldSchema = z.object({
  fieldName: z
    .string()
    .min(1, "字段名称不能为空")
    .max(50, "字段名称不能超过50个字符"),

  fieldKey: z
    .string()
    .min(1, "字段标识不能为空")
    .max(50, "字段标识不能超过50个字符")
    .regex(/^[a-z][a-z0-9_]*$/, "字段标识必须以小写字母开头，只能包含小写字母、数字和下划线"),

  fieldType: z.enum(
    ["text", "number", "date", "select", "multiselect", "checkbox", "radio", "textarea", "phone", "email", "url"]
  ).describe("请选择字段类型"),

  label: z
    .string()
    .min(1, "字段标签不能为空")
    .max(100, "字段标签不能超过100个字符"),

  placeholder: z
    .string()
    .max(200, "占位文本不能超过200个字符")
    .optional(),

  helpText: z
    .string()
    .max(500, "帮助文本不能超过500个字符")
    .optional(),

  required: z.boolean().default(false),

  isActive: z.boolean().default(true),

  showInList: z.boolean().default(false),

  searchable: z.boolean().default(false),

  defaultValue: z
    .string()
    .max(500, "默认值不能超过500个字符")
    .optional(),

  options: z
    .array(
      z.object({
        label: z.string().min(1, "选项标签不能为空"),
        value: z.string().min(1, "选项值不能为空"),
      })
    )
    .optional(),

  sort: z.number().int().optional(),

  maxLength: z.number().int().positive().optional(),

  minValue: z.number().optional(),

  maxValue: z.number().optional(),

  pattern: z
    .string()
    .max(200, "正则表达式不能超过200个字符")
    .optional(),

  width: z.enum(["1", "2"]).default("1"),
})

export type CustomFieldFormValues = z.infer<typeof customFieldSchema>

// ============ CustomFieldForm Props ============

export interface CustomFieldFormProps {
  initialValues?: Partial<CustomFieldFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: CustomFieldFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<CustomFieldFormValues> = {
  required: false,
  isActive: true,
  showInList: false,
  searchable: false,
  width: "1",
  fieldType: "text",
}

// ============ CustomFieldForm Component ============

export function CustomFieldForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: CustomFieldFormProps) {
  const form = useForm<CustomFieldFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customFieldSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as CustomFieldFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as CustomFieldFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const fieldType = watch("fieldType")

  const showOptions = ["select", "multiselect", "radio", "checkbox"].includes(fieldType)
  const showValidation = ["text", "textarea", "number"].includes(fieldType)

  const addOption = () => {
    const currentOptions = form.getValues("options") || []
    setValue("options", [
      ...currentOptions,
      { label: "", value: "" },
    ])
  }

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options") || []
    setValue(
      "options",
      currentOptions.filter((_, i) => i !== index)
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Basic Info */}
      <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="fieldName"
            label="字段名称"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：客户编号"
                error={!!errors.fieldName}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="fieldKey"
            label="字段标识"
            required
            containerClassName="col-span-1"
            description="用于 API 调用，建议使用英文下划线命名"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：customer_no"
                error={!!errors.fieldKey}
                onChange={(e) => {
                  field.onChange(e.target.value.toLowerCase())
                }}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="label"
            label="字段标签"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="显示在前端的标签"
                error={!!errors.label}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="fieldType"
            label="字段类型"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择字段类型"
                error={!!errors.fieldType}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="placeholder"
            label="占位文本"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="输入框占位提示"
                error={!!errors.placeholder}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="defaultValue"
            label="默认值"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="字段的默认值"
                error={!!errors.defaultValue}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Options */}
      {showOptions && (
        <FormSection title="选项配置">
          <div className="space-y-3">
            {(form.watch("options") || []).map((option, index) => (
              <FormGrid key={index} cols={3}>
                <Input
                  placeholder="选项标签"
                  value={option.label}
                  onChange={(e) => {
                    const options = form.getValues("options") || []
                    options[index].label = e.target.value
                    setValue("options", options)
                  }}
                  disabled={isSubmitting || loading}
                />
                <Input
                  placeholder="选项值"
                  value={option.value}
                  onChange={(e) => {
                    const options = form.getValues("options") || []
                    options[index].value = e.target.value
                    setValue("options", options)
                  }}
                  disabled={isSubmitting || loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={isSubmitting || loading}
                >
                  删除
                </Button>
              </FormGrid>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={isSubmitting || loading}
            >
              添加选项
            </Button>
          </div>
        </FormSection>
      )}

      {/* Validation */}
      {showValidation && (
        <FormSection title="验证规则">
          <FormGrid cols={2}>
            {fieldType === "text" || fieldType === "textarea" ? (
              <FormField
                control={form.control}
                name="maxLength"
                label="最大长度"
                containerClassName="col-span-1"
              >
                {({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="字符数上限"
                    error={!!errors.maxLength}
                  />
                )}
              </FormField>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="minValue"
                  label="最小值"
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="数值下限"
                      error={!!errors.minValue}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="maxValue"
                  label="最大值"
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="数值上限"
                      error={!!errors.maxValue}
                    />
                  )}
                </FormField>
              </>
            )}

            <FormField
              control={form.control}
              name="pattern"
              label="正则表达式"
              containerClassName="col-span-2"
              description="用于高级验证，如手机号"
            >
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="请输入正则表达式"
                  error={!!errors.pattern}
                />
              )}
            </FormField>
          </FormGrid>
        </FormSection>
      )}

      {/* Settings */}
      <FormSection title="显示设置">
        <FormGrid cols={2}>
          <div className="col-span-2 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.watch("required") ?? false}
                onChange={(e) => setValue("required", e.target.checked)}
                disabled={isSubmitting || loading}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">必填字段</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.watch("showInList") ?? false}
                onChange={(e) => setValue("showInList", e.target.checked)}
                disabled={isSubmitting || loading}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">在列表中显示</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.watch("searchable") ?? false}
                onChange={(e) => setValue("searchable", e.target.checked)}
                disabled={isSubmitting || loading}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">可搜索</span>
            </label>
          </div>
        </FormGrid>
      </FormSection>

      {/* Actions */}
      <FormActions>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            取消
          </Button>
        )}
        <Button type="submit" variant="default" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提交中...
            </>
          ) : mode === "create" ? (
            "创建"
          ) : (
            "保存"
          )}
        </Button>
      </FormActions>
    </form>
  )
}


