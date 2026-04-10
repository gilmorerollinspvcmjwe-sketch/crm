"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  orderSchema,
  type OrderFormValues,
} from "@/schemas"
import { cn } from "@/lib/utils"
import { useOrderFormStore } from "@/store"
import { useToast } from "@/hooks/use-toast"

// ============ OrderForm Props ============

export interface OrderFormProps {
  initialValues?: Partial<OrderFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: OrderFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<OrderFormValues> = {
  status: "待确认",
  items: [],
  totalAmount: 0,
}

// ============ OrderForm Component ============

export function OrderForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: OrderFormProps) {
  const { toast } = useToast()
  const {
    formData: storeFormData,
    setFormData,
    clearFormData,
    isDirty,
    setIsDirty,
    orderItems,
    setOrderItems,
    addOrderItem,
    removeOrderItem,
    savedDraft,
    saveDraft,
    loadDraft,
    clearDraft,
  } = useOrderFormStore()

  const form = useForm<OrderFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      ...storeFormData,
      items: orderItems.length > 0 ? orderItems : (initialValues?.items || []),
    } as OrderFormValues,
    mode: "onBlur",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // 同步表单数据到 store
  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormData(values as Record<string, unknown>)
      if (values.items) {
        setOrderItems(values.items as typeof orderItems)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, setFormData, setOrderItems])

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as OrderFormValues)
      setFormData(initialValues as Record<string, unknown>)
      if (initialValues.items) {
        setOrderItems(initialValues.items as typeof orderItems)
      }
    }
  }, [initialValues, form, setFormData, setOrderItems])

  // Calculate total amount
  useEffect(() => {
    const items = form.getValues("items")
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0)
    form.setValue("totalAmount", total)
  }, [form.watch("items")])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  // 处理草稿
  const handleSaveDraft = () => {
    saveDraft()
    toast({
      title: "草稿已保存",
      description: "下次打开时可以恢复此草稿",
    })
  }

  const handleLoadDraft = () => {
    if (savedDraft) {
      loadDraft()
      form.reset({ ...defaultValues, ...savedDraft } as OrderFormValues)
      toast({
        title: "草稿已恢复",
      })
    }
  }

  const handleClearDraft = () => {
    clearDraft()
    clearFormData()
    form.reset({ ...defaultValues, ...initialValues } as OrderFormValues)
    toast({
      title: "草稿已清除",
    })
  }

  // 提交后清除状态
  const handleFormSubmit = async (values: OrderFormValues) => {
    await onSubmit(values)
    clearFormData()
    clearDraft()
    setIsDirty(false)
  }

  // 添加订单项
  const handleAddItem = () => {
    const newItem = {
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      amount: 0,
    }
    append(newItem)
    addOrderItem(newItem)
  }

  // 移除订单项
  const handleRemoveItem = (index: number) => {
    remove(index)
    removeOrderItem(index)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn("space-y-6", className)}
        noValidate
      >
        {/* Basic Info */}
        <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="code"
            label="订单编码"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：ORDER-2024-001"
                error={!!errors.code}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="customerId"
            label="客户"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择客户"
                error={!!errors.customerId}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="contractId"
            label="关联合同"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择合同"
                error={!!errors.contractId}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="assignee"
            label="负责人"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择负责人"
                error={!!errors.assignee}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Order Items */}
      <FormSection title="订单明细">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">产品 {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  disabled={isSubmitting || loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormGrid cols={4}>
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  label="产品"
                  required
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请选择产品"
                      error={!!errors.items?.[index]?.productId}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name={`items.${index}.productName`}
                  label="产品名称"
                  required
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="产品名称"
                      error={!!errors.items?.[index]?.productName}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  label="数量"
                  required
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="1"
                      error={!!errors.items?.[index]?.quantity}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  label="单价"
                  required
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      error={!!errors.items?.[index]?.unitPrice}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name={`items.${index}.discount`}
                  label="折扣"
                  containerClassName="col-span-1"
                  description="0-1 之间"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="0.00"
                      error={!!errors.items?.[index]?.discount}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name={`items.${index}.amount`}
                  label="金额"
                  containerClassName="col-span-1"
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      error={!!errors.items?.[index]?.amount}
                    />
                  )}
                </FormField>
              </FormGrid>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            disabled={isSubmitting || loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加产品
          </Button>

          {errors.items && typeof errors.items.message === "string" && (
            <p className="text-sm text-destructive">{errors.items.message}</p>
          )}
        </div>
      </FormSection>

      {/* Total */}
      <FormSection title="金额汇总">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="totalAmount"
            label="订单总额"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.totalAmount}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Shipping */}
      <FormSection title="发货信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="shippingAddress"
            label="收货地址"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入收货地址"
                error={!!errors.shippingAddress}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="shippingDate"
            label="发货日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.shippingDate}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="receivedDate"
            label="收货日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.receivedDate}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Remark */}
      <FormSection title="备注">
        <FormField
          control={form.control}
          name="remark"
          label="备注"
          containerClassName="col-span-2"
        >
          {({ field }) => (
            <Input
              {...field}
              placeholder="请输入备注信息"
              error={!!errors.remark}
            />
          )}
        </FormField>
      </FormSection>

      {/* Actions */}
      <FormActions>
        {/* 草稿操作 */}
        {mode === "create" && (
          <div className="flex items-center gap-2 mr-auto">
            {savedDraft && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadDraft}
                  disabled={isSubmitting || loading}
                >
                  恢复草稿
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDraft}
                  disabled={isSubmitting || loading}
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  清除草稿
                </Button>
              </>
            )}
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSubmitting || loading}
              >
                <Save className="mr-1 h-3 w-3" />
                保存草稿
              </Button>
            )}
          </div>
        )}
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
    </FormProvider>
  )
}

export type { OrderFormValues }