"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { z } from "zod"

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

// ============ PricebookEntry Schema ============

export const pricebookEntrySchema = z.object({
  pricebookId: z
    .string()
    .min(1, "请选择价格手册"),

  productId: z
    .string()
    .min(1, "请选择产品"),

  productCode: z
    .string()
    .max(50)
    .optional(),

  productName: z
    .string()
    .max(200)
    .optional(),

  unitPrice: z
    .number()
    .positive("销售价格必须大于0"),

  costPrice: z
    .number()
    .nonnegative()
    .optional(),

  discount: z
    .number()
    .min(0, "折扣不能小于0")
    .max(1, "折扣不能大于1")
    .optional(),

  minPrice: z
    .number()
    .nonnegative()
    .optional(),

  maxPrice: z
    .number()
    .nonnegative()
    .optional(),

  startDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "请输入有效的日期"
    ),

  minQuantity: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  maxQuantity: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  isActive: z.boolean().default(true),

  priority: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  remark: z
    .string()
    .max(500)
    .optional(),
})

export type PricebookEntryFormValues = z.infer<typeof pricebookEntrySchema>

// ============ PricebookEntryForm Props ============

export interface PricebookEntryFormProps {
  initialValues?: Partial<PricebookEntryFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: PricebookEntryFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<PricebookEntryFormValues> = {
  isActive: true,
  priority: 0,
}

// ============ PricebookEntryForm Component ============

export function PricebookEntryForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: PricebookEntryFormProps) {
  const form = useForm<PricebookEntryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pricebookEntrySchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as PricebookEntryFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as PricebookEntryFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Product Selection */}
      <FormSection title="产品信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="productId"
            label="产品"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择产品"
                error={!!errors.productId}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="productCode"
            label="产品编码"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="产品编码（自动填充）"
                error={!!errors.productCode}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="productName"
            label="产品名称"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="产品名称（自动填充）"
                error={!!errors.productName}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Pricing */}
      <FormSection title="价格设置">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="unitPrice"
            label="销售价格"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.unitPrice}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="costPrice"
            label="成本价"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.costPrice}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="discount"
            label="折扣率"
            containerClassName="col-span-1"
            description="如 0.9 表示九折"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.00 - 1.00"
                error={!!errors.discount}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="priority"
            label="优先级"
            containerClassName="col-span-1"
            description="数字越大优先级越高"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="0"
                error={!!errors.priority}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Price Range */}
      <FormSection title="价格区间">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="minPrice"
            label="最低价格"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={!!errors.minPrice}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="maxPrice"
            label="最高价格"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                error={!!errors.maxPrice}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Quantity Range */}
      <FormSection title="数量区间">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="minQuantity"
            label="最小数量"
            containerClassName="col-span-1"
            description="此价格适用的最小订购数量"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="1"
                error={!!errors.minQuantity}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="maxQuantity"
            label="最大数量"
            containerClassName="col-span-1"
            description="此价格适用的最大订购数量"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="999"
                error={!!errors.maxQuantity}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Validity */}
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

      {/* Status */}
      <FormSection title="状态">
        <FormGrid cols={2}>
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
                  启用后此价格条目可被使用
                </label>
              </div>
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
                placeholder="备注信息"
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


