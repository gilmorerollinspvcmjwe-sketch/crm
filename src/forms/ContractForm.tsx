"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  contractSchema,
  contractTypeOptions,
  paymentMethodOptions,
  currencyOptions,
  type ContractFormValues,
  type ContractType,
  type PaymentMethod,
  type Currency,
} from "@/schemas"
import { cn } from "@/lib/utils"

// ============ ContractForm Props ============

export interface ContractFormProps {
  initialValues?: Partial<ContractFormValues>
  mode?: "create" | "edit"
  loading?: boolean
  onSubmit: (values: ContractFormValues) => void | Promise<void>
  onCancel?: () => void
  className?: string
}

// ============ Default Values ============

const defaultValues: Partial<ContractFormValues> = {
  status: "草稿",
  amount: 0,
}

// ============ ContractForm Component ============

export function ContractForm({
  initialValues,
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
  className,
}: ContractFormProps) {
  const form = useForm<ContractFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contractSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    } as ContractFormValues,
    mode: "onBlur",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({ ...defaultValues, ...initialValues } as ContractFormValues)
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
      {/* Basic Info */}
      <FormSection title="基本信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="name"
            label="合同名称"
            required
            containerClassName="col-span-2"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入合同名称"
                error={!!errors.name}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="code"
            label="合同编码"
            required
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="如：CONTRACT-2024-001"
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
            name="opportunityId"
            label="关联商机"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请选择商机"
                error={!!errors.opportunityId}
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

          <FormField
            control={form.control}
            name="contractType"
            label="合同类型"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择合同类型" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="paymentMethod"
            label="付款方式"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择付款方式" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            control={form.control}
            name="currency"
            label="币种"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择币种" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            label="合同金额"
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
            name="signedAmount"
            label="已签署金额"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                error={!!errors.signedAmount}
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
            label="开始日期"
            required
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
            label="结束日期"
            required
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

      {/* Sign Info */}
      <FormSection title="签署信息">
        <FormGrid cols={2}>
          <FormField
            control={form.control}
            name="signedDate"
            label="签署日期"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                error={!!errors.signedDate}
              />
            )}
          </FormField>

          <FormField
            control={form.control}
            name="signatory"
            label="签署人"
            containerClassName="col-span-1"
          >
            {({ field }) => (
              <Input
                {...field}
                placeholder="请输入签署人姓名"
                error={!!errors.signatory}
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

export type { ContractFormValues }