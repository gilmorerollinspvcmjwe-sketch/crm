/**
 * 核销对话框
 * 用于选择回款计划、输入核销金额、提交核销/驳回
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  usePaymentPlanList,
  useSubmitReconciliation,
  useRejectReconciliation,
} from '@/hooks/useReconciliation'
import type { PaymentPlan, Reconciliation } from '@/types/paymentRecord'

// ============ Validation Schema ============

const reconciliationSchema = z.object({
  paymentPlanIds: z.array(z.string()).min(1, '请至少选择一个回款计划'),
  amount: z.number().positive('核销金额必须大于 0'),
  remark: z.string().optional(),
})

type ReconciliationFormValues = z.infer<typeof reconciliationSchema>

// ============ Props ============

export interface ReconciliationDialogProps {
  /** 回款记录 ID */
  paymentId: string
  /** 是否打开对话框 */
  open: boolean
  /** 关闭对话框 */
  onOpenChange: (open: boolean) => void
  /** 核销成功回调 */
  onSuccess?: () => void
}

// ============ Component ============

export function ReconciliationDialog({
  paymentId,
  open,
  onOpenChange,
  onSuccess,
}: ReconciliationDialogProps) {
  const submitMutation = useSubmitReconciliation()

  // 获取回款计划列表
  const { data: plansData, isLoading: isLoadingPlans } = usePaymentPlanList({ paymentId, status: '待核销' })
  const availablePlans = plansData?.data || []

  // 表单
  const form = useForm<ReconciliationFormValues>({
    resolver: zodResolver(reconciliationSchema),
    defaultValues: {
      paymentPlanIds: [],
      amount: 0,
      remark: '',
    },
  })

  const selectedPlanIds = form.watch('paymentPlanIds')
  const selectedPlans = availablePlans.filter(p => selectedPlanIds.includes(p.id))
  const maxAmount = selectedPlans.reduce((sum, p) => sum + p.pendingAmount, 0)

  // 更新最大金额限制
  React.useEffect(() => {
    const currentAmount = form.getValues('amount')
    if (currentAmount > maxAmount && maxAmount > 0) {
      form.setValue('amount', maxAmount)
    }
  }, [maxAmount, form])

  // 提交核销
  const onSubmit = async (values: ReconciliationFormValues) => {
    try {
      await submitMutation.mutateAsync({
        paymentId,
        paymentPlanIds: values.paymentPlanIds,
        amount: values.amount,
        remark: values.remark,
      })
      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      // 错误已在 hook 中处理
    }
  }

  // 关闭时重置表单
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>回款核销</DialogTitle>
          <DialogDescription>
            选择要核销的回款计划，输入核销金额并提交
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 选择回款计划 */}
          <div className="space-y-2">
            <Label>选择回款计划 <span className="text-destructive">*</span></Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {isLoadingPlans ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  加载中...
                </div>
              ) : availablePlans.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  暂无待核销的回款计划
                </div>
              ) : (
                <div className="space-y-3">
                  {availablePlans.map(plan => (
                    <div
                      key={plan.id}
                      className={cn(
                        'flex items-start space-x-3 rounded-lg border p-3 transition-colors',
                        selectedPlanIds.includes(plan.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Checkbox
                        id={plan.id}
                        checked={selectedPlanIds.includes(plan.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue('paymentPlanIds', [...selectedPlanIds, plan.id])
                          } else {
                            form.setValue(
                              'paymentPlanIds',
                              selectedPlanIds.filter(id => id !== plan.id)
                            )
                          }
                        }}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor={plan.id}
                            className="cursor-pointer font-medium"
                          >
                            {plan.planCode}
                          </Label>
                          <Badge variant={plan.status === '已核销' ? 'secondary' : 'default'}>
                            {plan.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>计划金额：¥{plan.plannedAmount.toLocaleString()}</span>
                          <span>待核销：¥{plan.pendingAmount.toLocaleString()}</span>
                        </div>
                        {plan.dueDate && (
                          <div className="text-xs text-muted-foreground">
                            应付日期：{plan.dueDate}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {form.formState.errors.paymentPlanIds && (
              <p className="text-sm text-destructive">
                {form.formState.errors.paymentPlanIds.message}
              </p>
            )}
          </div>

          {/* 已选计划汇总 */}
          {selectedPlans.length > 0 && (
            <>
              <Separator />
              <div className="rounded-lg bg-muted p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">已选计划数</span>
                  <span className="font-medium">{selectedPlans.length} 个</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">最大可核销金额</span>
                  <span className="font-medium text-primary">
                    ¥{maxAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* 核销金额 */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              核销金额 <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ¥
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={maxAmount}
                placeholder="请输入核销金额"
                className="pl-7"
                {...form.register('amount', { valueAsNumber: true })}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
            {selectedPlans.length > 0 && (
              <p className="text-xs text-muted-foreground">
                最大可核销金额：¥{maxAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              placeholder="请输入备注信息（可选）"
              className="min-h-[80px]"
              {...form.register('remark')}
            />
            {form.formState.errors.remark && (
              <p className="text-sm text-destructive">
                {form.formState.errors.remark.message}
              </p>
            )}
          </div>

          {/* 操作按钮 */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              取消
            </Button>
            <Button type="submit" disabled={submitMutation.isPending || selectedPlans.length === 0}>
              {submitMutation.isPending ? '提交中...' : '确认核销'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============ Reject Dialog (驳回对话框) ============

const rejectSchema = z.object({
  rejectReason: z.string().min(1, '请输入驳回原因'),
  remark: z.string().optional(),
})

type RejectFormValues = z.infer<typeof rejectSchema>

export interface RejectDialogProps {
  /** 核销记录 */
  reconciliation: Reconciliation
  /** 是否打开对话框 */
  open: boolean
  /** 关闭对话框 */
  onOpenChange: (open: boolean) => void
  /** 驳回成功回调 */
  onSuccess?: () => void
}

export function RejectDialog({
  reconciliation,
  open,
  onOpenChange,
  onSuccess,
}: RejectDialogProps) {
  const rejectMutation = useRejectReconciliation()

  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      rejectReason: '',
      remark: '',
    },
  })

  const onSubmit = async (values: RejectFormValues) => {
    try {
      await rejectMutation.mutateAsync({
        reconciliationId: reconciliation.id,
        rejectReason: values.rejectReason,
        remark: values.remark,
      })
      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      // 错误已在 hook 中处理
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>驳回核销</DialogTitle>
          <DialogDescription>
            驳回后将恢复回款计划的待核销状态
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 核销记录信息 */}
          <div className="rounded-lg bg-muted p-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">核销记录 ID</span>
              <span className="font-medium">{reconciliation.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">核销金额</span>
              <span className="font-medium text-primary">
                ¥{reconciliation.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">核销时间</span>
              <span>{new Date(reconciliation.operatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 驳回原因 */}
          <div className="space-y-2">
            <Label htmlFor="rejectReason">
              驳回原因 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejectReason"
              placeholder="请详细说明驳回原因"
              className="min-h-[100px]"
              {...form.register('rejectReason')}
            />
            {form.formState.errors.rejectReason && (
              <p className="text-sm text-destructive">
                {form.formState.errors.rejectReason.message}
              </p>
            )}
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              placeholder="其他补充信息（可选）"
              className="min-h-[80px]"
              {...form.register('remark')}
            />
          </div>

          {/* 操作按钮 */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={rejectMutation.isPending}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? '处理中...' : '确认驳回'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReconciliationDialog
