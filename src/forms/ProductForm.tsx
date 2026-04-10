"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  productSchema,
  type ProductFormValues,
} from "@/types/product"
import { cn } from "@/lib/utils"

// ============ ProductForm Props ============

export interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: ProductFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<ProductFormValues> = {
  unit: "个",
  isActive: true,
  isSellable: true,
}

// ============ ProductForm Component ============

export function ProductForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as ProductFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as ProductFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const isActive = watch("isActive")
  const isSellable = watch("isSellable")

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
            label="产品名称"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入产品名称"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="code"
            label="产品编码"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：PROD-001"
                error={!!errors.code}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="categoryId"
            label="产品分类"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择产品分类"
                error={!!errors.categoryId}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="unit"
            label="单位"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：个/件/台"
                error={!!errors.unit}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="brand"
            label="品牌"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入品牌名称"
                error={!!errors.brand}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="model"
            label="型号"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入产品型号"
                error={!!errors.model}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="spec"
            label="规格"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入产品规格"
                error={!!errors.spec}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="color"
            label="颜色"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入产品颜色"
                error={!!errors.color}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Pricing */}
      <FormSection title="价格信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="standardPrice"
            label="标准价格"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0.00"
                error={!!errors.standardPrice}
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
                placeholder="0.00"
                error={!!errors.costPrice}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="minDiscount"
            label="最低折扣"
            containerClassName="col-span-1"
            description="如 0.8 表示最低八折"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.00 - 1.00"
                error={!!errors.minDiscount}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Inventory */}
      <FormSection title="库存信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="stock"
            label="当前库存"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0"
                error={!!errors.stock}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="safetyStock"
            label="安全库存"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0"
                error={!!errors.safetyStock}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="weight"
            label="重量（kg）"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.weight}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="shelfLife"
            label="保质期（天）"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="0"
                error={!!errors.shelfLife}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="origin"
            label="产地"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入产地"
                error={!!errors.origin}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="size"
            label="尺寸"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：10x20x30cm"
                error={!!errors.size}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Status */}
      <FormSection title="状态设置">
        <FormGrid cols={2}>
          <div className="col-span-2 space-y-3">
            <FormField
              control={form.control}
              name="isActive"
              label="是否上架"
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
                    上架后客户可在目录中看到此产品
                  </label>
                </div>
              )}
            </FormField>

            <FormField
              control={form.control}
              name="isSellable"
              label="是否可销售"
            >
              {({ field }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id="isSellable"
                  />
                  <label
                    htmlFor="isSellable"
                    className="ml-2 text-sm text-muted-foreground cursor-pointer"
                  >
                    可销售的产品可以添加到报价单
                  </label>
                </div>
              )}
            </FormField>
          </div>
        </FormGrid>
      </FormSection>

      {/* Description */}
      <FormSection title="产品描述">
        <FormField
          control={form.control}
          name="description"
          label="产品描述"
          containerClassName="col-span-2"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="请输入产品详细描述"
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

export type { ProductFormValues }
