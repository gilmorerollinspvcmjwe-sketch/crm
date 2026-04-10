"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { pricebookSchema, type PricebookFormValues } from "@/types/pricebook"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import { cn } from "@/lib/utils"

// ============ PricebookForm Props ============

export interface PricebookFormProps {
  initialValues?: Partial<PricebookFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: PricebookFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<PricebookFormValues> = {
  isDefault: false,
  isActive: true,
  currency: "CNY",
  discountType: "percentage",
}

// ============ PricebookForm Component ============

export function PricebookForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: PricebookFormProps) {
  const form = useForm<PricebookFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pricebookSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as PricebookFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as PricebookFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const discountType = watch("discountType")

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
            name="name"
            label="价格手册名称"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：2024 年标准价格手册"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="code"
            label="价格手册编码"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：PRICE-2024"
                error={!!errors.code}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="currency"
            label="货币"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：CNY/USD"
                error={!!errors.currency}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Validity Period */}
      <FormSection title="有效期">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="startDate"
            label="生效日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.startDate}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="endDate"
            label="失效日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.endDate}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Discount Settings */}
      <FormSection title="折扣设置">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="discountType"
            label="折扣类型"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="percentage"
                    checked={field.value === "percentage"}
                    onChange={() => field.onChange("percentage")}
                    disabled={isSubmitting || loading}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">百分比折扣</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="fixed"
                    checked={field.value === "fixed"}
                    onChange={() => field.onChange("fixed")}
                    disabled={isSubmitting || loading}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">固定金额</span>
                </label>
              </div>
            )}
          </FormField>

          {discountType === "percentage" && (
            <FormField
              control={form.control}
              name="defaultDiscount"
              label="默认折扣率"
              containerClassName="col-span-1"
              description="如 0.9 表示九折，范围 0-1"
            >
              {({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.00 - 1.00"
                  error={!!errors.defaultDiscount}
                />
              )}
            </FormField>
          )}
        </FormGrid>
      </FormSection>

      {/* Customer Levels */}
      <FormSection title="适用客户等级">
        <FormGrid cols={2}>
          <div className="col-span-2 space-y-2">
            {(["A", "B", "C", "D"] as const).map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watch("applicableLevels")?.includes(level) ?? false}
                  onChange={(e) => {
                    const current = form.getValues("applicableLevels") || []
                    if (e.target.checked) {
                      setValue("applicableLevels", [...current, level])
                    } else {
                      setValue(
                        "applicableLevels",
                        current.filter((l) => l !== level)
                      )
                    }
                  }}
                  disabled={isSubmitting || loading}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">
                  等级 {level}
                </span>
              </label>
            ))}
          </div>
        </FormGrid>
      </FormSection>

      {/* Status */}
      <FormSection title="状态设置">
        <FormGrid cols={2}>
          <div className="col-span-2 space-y-3">
            <FormField
              control={form.control}
              name="isDefault"
              label="设为默认价格手册"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id="isDefault"
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    默认价格手册将自动应用于新客户
                  </label>
                </div>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="isActive"
              label="启用状态"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id="isActive"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    启用后此价格手册可被使用
                  </label>
                </div>
              )}
            </FormField>
          </div>
        </FormGrid>
      </FormSection>

      {/* Description */}
      <FormSection title="其他信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="description"
            label="描述"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入价格手册描述"
                error={!!errors.description}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="remark"
            label="备注"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="内部备注信息"
                error={!!errors.remark}
              />
            )}
          </FormField>
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

export type { PricebookFormValues }
