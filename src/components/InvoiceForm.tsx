/**
 * 发票表单
 * 用于创建/编辑发票信息
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useCreateInvoice, useUpdateInvoice } from '@/hooks/useReconciliation'
import { FormField } from '@/components/form/FormField'
import type { Invoice, InvoiceType, InvoiceStatus } from '@/types/paymentRecord'

// ============ Constants ============

const INVOICE_TYPES: { value: InvoiceType; label: string }[] = [
  { value: '专票', label: '增值税专用发票' },
  { value: '普票', label: '增值税普通发票' },
  { value: '无', label: '无需发票' },
]

const INVOICE_STATUSES: { value: InvoiceStatus; label: string }[] = [
  { value: '未开票', label: '未开票' },
  { value: '已开票', label: '已开票' },
  { value: '已寄送', label: '已寄送' },
  { value: '已签收', label: '已签收' },
  { value: '已退回', label: '已退回' },
]

// ============ Validation Schema ============

const invoiceSchema = z.object({
  type: z.enum(['专票', '普票', '无']).describe('请选择发票类型'),
  status: z.enum(['未开票', '已开票', '已寄送', '已签收', '已退回']).optional(),
  invoiceNo: z.string().optional(),
  invoiceCode: z.string().optional(),
  amount: z.number().positive('开票金额必须大于 0'),
  invoiceDate: z.string().optional(),
  sentDate: z.string().optional(),
  recipient: z.string().optional(),
  address: z.string().optional(),
  courier: z.string().optional(),
  trackingNo: z.string().optional(),
  remark: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

// ============ Props ============

export interface InvoiceFormProps {
  /** 回款记录 ID */
  paymentId: string
  /** 现有发票信息（编辑模式） */
  existingInvoice?: Invoice | null
  /** 表单提交成功回调 */
  onSuccess?: () => void
  /** 只读模式 */
  readOnly?: boolean
}

// ============ Component ============

export function InvoiceForm({
  paymentId,
  existingInvoice,
  onSuccess,
  readOnly = false,
}: InvoiceFormProps) {
  const { toast } = useToast()
  const createMutation = useCreateInvoice()
  const updateMutation = useUpdateInvoice()

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      type: existingInvoice?.type || '专票',
      status: existingInvoice?.status || '未开票',
      invoiceNo: existingInvoice?.invoiceNo || '',
      invoiceCode: existingInvoice?.invoiceCode || '',
      amount: existingInvoice?.amount || 0,
      invoiceDate: existingInvoice?.invoiceDate || '',
      sentDate: existingInvoice?.sentDate || '',
      recipient: existingInvoice?.recipient || '',
      address: existingInvoice?.address || '',
      courier: existingInvoice?.courier || '',
      trackingNo: existingInvoice?.trackingNo || '',
      remark: existingInvoice?.remark || '',
    },
  })

  const invoiceType = form.watch('type')
  const invoiceStatus = form.watch('status')

  // 提交表单
  const onSubmit = async (values: InvoiceFormValues) => {
    try {
      if (existingInvoice?.id) {
        await updateMutation.mutateAsync({
          id: existingInvoice.id,
          updates: values,
        })
      } else {
        await createMutation.mutateAsync({
          ...values,
          paymentId,
        })
      }
      toast({
        title: '保存成功',
        description: '发票信息已保存',
        variant: 'success',
      })
      onSuccess?.()
    } catch (error) {
      // 错误已在 hook 中处理
    }
  }

  // 判断是否需要显示发票号码字段
  const showInvoiceNo = invoiceType !== '无' && invoiceStatus === '已开票'

  // 判断是否需要显示寄送信息
  const showShippingInfo = invoiceStatus === '已寄送' || invoiceStatus === '已签收'

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 发票类型 */}
          <FormField
            control={form.control}
            name="type"
            label="发票类型"
            required
            disabled={readOnly}
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择发票类型" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          {/* 发票状态 */}
          <FormField
            control={form.control}
            name="status"
            label="发票状态"
            disabled={readOnly}
          >
            {({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择发票状态" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          {/* 发票号码和代码 */}
          {showInvoiceNo && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNo"
                  label="发票号码"
                  disabled={readOnly}
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入发票号码"
                      disabled={readOnly}
                    />
                  )}
                </FormField>

                <FormField
                  control={form.control}
                  name="invoiceCode"
                  label="发票代码"
                  disabled={readOnly}
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入发票代码"
                      disabled={readOnly}
                    />
                  )}
                </FormField>
              </div>
            </>
          )}

          {/* 开票金额 */}
          <FormField
            control={form.control}
            name="amount"
            label="开票金额"
            required
            disabled={readOnly}
          >
            {({ field }) => (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ¥
                </span>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="请输入开票金额"
                  className="pl-7"
                  disabled={readOnly}
                />
              </div>
            )}
          </FormField>

          {/* 开票日期 */}
          <FormField
            control={form.control}
            name="invoiceDate"
            label="开票日期"
            disabled={readOnly}
          >
            {({ field }) => (
              <Input
                {...field}
                type="date"
                disabled={readOnly}
              />
            )}
          </FormField>

          {/* 寄送信息 */}
          {showShippingInfo && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">寄送信息</h4>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sentDate"
                    label="寄送日期"
                    disabled={readOnly}
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        disabled={readOnly}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="courier"
                    label="快递公司"
                    disabled={readOnly}
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="例如：顺丰、圆通"
                        disabled={readOnly}
                      />
                    )}
                  </FormField>
                </div>

                <FormField
                  control={form.control}
                  name="trackingNo"
                  label="快递单号"
                  disabled={readOnly}
                >
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入快递单号"
                      disabled={readOnly}
                    />
                  )}
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipient"
                    label="收件人"
                    disabled={readOnly}
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入收件人姓名"
                        disabled={readOnly}
                      />
                    )}
                  </FormField>

                  <FormField
                    control={form.control}
                    name="address"
                    label="收件地址"
                    disabled={readOnly}
                  >
                    {({ field }) => (
                      <Input
                        {...field}
                        placeholder="请输入收件地址"
                        disabled={readOnly}
                      />
                    )}
                  </FormField>
                </div>
              </div>
            </>
          )}

          {/* 备注 */}
          <FormField
            control={form.control}
            name="remark"
            label="备注"
            disabled={readOnly}
          >
            {({ field }) => (
              <Textarea
                {...field}
                placeholder="请输入备注信息（可选）"
                className="min-h-[80px]"
                disabled={readOnly}
              />
            )}
          </FormField>

          {/* 状态标签 */}
          {existingInvoice && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">当前状态：</span>
              <Badge variant={existingInvoice.status === '已签收' ? 'success' : 'default'}>
                {existingInvoice.status}
              </Badge>
              {existingInvoice.invoiceNo && (
                <Badge variant="outline">
                  发票号：{existingInvoice.invoiceNo}
                </Badge>
              )}
            </div>
          )}

          {/* 提交按钮 */}
          {!readOnly && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                重置
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? '保存中...' : '保存发票信息'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

// ============ Invoice List Item (用于展示) ============

export interface InvoiceListItemProps {
  invoice: Invoice
  onEdit?: () => void
}

export function InvoiceListItem({ invoice, onEdit }: InvoiceListItemProps) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={invoice.type === '专票' ? 'default' : 'secondary'}>
            {invoice.type}
          </Badge>
          <Badge variant={invoice.status === '已签收' ? 'success' : 'outline'}>
            {invoice.status}
          </Badge>
        </div>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            编辑
          </Button>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2 text-sm">
        {invoice.invoiceNo && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">发票号码：</span>
            <span className="font-medium">{invoice.invoiceNo}</span>
          </div>
        )}
        {invoice.invoiceCode && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">发票代码：</span>
            <span>{invoice.invoiceCode}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">开票金额：</span>
          <span className="font-medium text-primary">¥{invoice.amount.toLocaleString()}</span>
        </div>
        {invoice.invoiceDate && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">开票日期：</span>
            <span>{invoice.invoiceDate}</span>
          </div>
        )}
        {invoice.trackingNo && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">快递单号：</span>
            <span>{invoice.trackingNo}</span>
          </div>
        )}
      </div>

      {invoice.remark && (
        <div className="text-sm text-muted-foreground">
          备注：{invoice.remark}
        </div>
      )}
    </div>
  )
}

export default InvoiceForm
