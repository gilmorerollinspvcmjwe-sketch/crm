"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FormGrid,
  FormSection,
  FormActions,
  FormField,
} from "@/components/form"
import {
  paymentSchema,
  type PaymentFormValues,
} from "@/schemas"
import { cn } from "@/lib/utils"

// ============ PaymentForm Props ============

export interface PaymentFormProps {
  initialValues?: Partial<PaymentFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: PaymentFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<PaymentFormValues> = {
  status: "待支付",
  method: "银行转账",
  paidAmount: 0,
  amount: 0,
}

// ============ PaymentForm Component ============

export function PaymentForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as PaymentFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as PaymentFormValues)
    }
  }, [initialValues, form])

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const status = watch("status")

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
            name="code"
            label="支付编码"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：PAY-2024-001"
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
            required
            containerClassName="col-span-2"
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

      {/* Amount */}
      <FormSection title="金额信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="amount"
            label="应付金额"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.amount}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="paidAmount"
            label="已付金额"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.paidAmount}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Payment Method */}
      <FormSection title="支付方式">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="method"
            label="支付方式"
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <div className="flex gap-4">
                {(["银行转账", "现金", "支票", "支付宝", "微信", "其他"] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={method}
                      checked={field.value === method}
                      onChange={() => field.onChange(method)}
                      disabled={isSubmitting || loading}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="bankAccount"
            label="银行账户"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入银行账户"
                error={!!errors.bankAccount}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="receiptNo"
            label="收据编号"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入收据编号"
                error={!!errors.receiptNo}
              />
            )}
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Date */}
      <FormSection title="日期信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="dueDate"
            label="应付日期"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.dueDate}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="paidDate"
            label="实付日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.paidDate}
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

export type { PaymentFormValues }