"use client"

import * as React from "react"
import { Plus, Edit, Trash2, Calendar, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { PaymentPlan, PaymentPlanStatus } from "@/types"
import { paymentPlanStatusOptions } from "@/schemas/paymentPlanSchema"
import { useForm } from "react-hook-form"

// ============ Status Badge ============

const statusConfig: Record<PaymentPlanStatus, { label: string; className: string }> = {
  "待回款": { label: "待回款", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "部分回款": { label: "部分回款", className: "bg-blue-100 text-blue-800 border-blue-200" },
  "已完成": { label: "已完成", className: "bg-green-100 text-green-800 border-green-200" },
  "逾期": { label: "逾期", className: "bg-red-100 text-red-800 border-red-200" },
}

function StatusBadge({ status }: { status: PaymentPlanStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

// ============ Format Currency ============

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount)
}

// ============ PaymentPlan Form ============

interface PaymentPlanFormData {
  planCode: string
  planAmount: number
  planDate: string
  actualAmount?: number
  actualDate?: string
  status?: PaymentPlanStatus
  remark?: string
}

interface PaymentPlanFormProps {
  initialValues?: Partial<PaymentPlanFormData>
  mode?: "create" | "edit" | "record"
  onSubmit: (values: PaymentPlanFormData) => void | Promise<void>
  onCancel: () => void
}

function PaymentPlanForm({
  initialValues,
  mode = "create",
  onSubmit,
  onCancel,
}: PaymentPlanFormProps) {
  const form = useForm({
    defaultValues: {
      planCode: initialValues?.planCode || "",
      planAmount: initialValues?.planAmount || 0,
      planDate: initialValues?.planDate || "",
      actualAmount: initialValues?.actualAmount || 0,
      actualDate: initialValues?.actualDate || "",
      status: initialValues?.status || "待回款",
      remark: initialValues?.remark || "",
    },
  })

  const { handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">计划编号</label>
          <Input
            {...form.register("planCode")}
            placeholder="如：PP-2024-001"
            disabled={mode === "record"}
          />
          {errors.planCode && <p className="text-sm text-destructive">{errors.planCode.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">计划金额</label>
          <Input
            {...form.register("planAmount", { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            disabled={mode === "record"}
          />
          {errors.planAmount && <p className="text-sm text-destructive">{errors.planAmount.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">计划日期</label>
          <Input
            {...form.register("planDate")}
            type="date"
            disabled={mode === "record"}
          />
          {errors.planDate && <p className="text-sm text-destructive">{errors.planDate.message}</p>}
        </div>

        {(mode === "edit" || mode === "record") && (
          <>
            <div>
              <label className="text-sm font-medium">实际金额</label>
              <Input
                {...form.register("actualAmount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
              {errors.actualAmount && <p className="text-sm text-destructive">{errors.actualAmount.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">实际回款日期</label>
              <Input
                {...form.register("actualDate")}
                type="date"
              />
              {errors.actualDate && <p className="text-sm text-destructive">{errors.actualDate.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">状态</label>
              <Select
                onValueChange={(value) => setValue("status", value as PaymentPlanStatus)}
                defaultValue={watch("status")}
                disabled={mode === "record"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {paymentPlanStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium">备注</label>
          <Input
            {...form.register("remark")}
            placeholder="请输入备注"
          />
          {errors.remark && <p className="text-sm text-destructive">{errors.remark.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {mode === "record" ? "关闭" : mode === "edit" ? "保存" : "创建"}
        </Button>
      </div>
    </form>
  )
}

// ============ PaymentPlanList Props ============

export interface PaymentPlanListProps {
  contractId: string
  contractAmount?: number
  paymentPlans?: PaymentPlan[]
  onCreatePlan?: (plan: Omit<PaymentPlan, "id" | "createdAt" | "updatedAt">) => void | Promise<void>
  onUpdatePlan?: (plan: PaymentPlan) => void | Promise<void>
  onDeletePlan?: (planId: string) => void | Promise<void>
  className?: string
}

// ============ PaymentPlanList Component ============

export function PaymentPlanList({
  contractId,
  contractAmount,
  paymentPlans: initialPlans = [],
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  className,
}: PaymentPlanListProps) {
  const { toast } = useToast()
  const [paymentPlans, setPaymentPlans] = React.useState<PaymentPlan[]>(initialPlans)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<PaymentPlan | null>(null)
  const [viewingPlan, setViewingPlan] = React.useState<PaymentPlan | null>(null)

  // 计算回款统计
  const totalPlanned = paymentPlans.reduce((sum, p) => sum + p.planAmount, 0)
  const totalActual = paymentPlans.reduce((sum, p) => sum + (p.actualAmount || 0), 0)
  const completionRate = contractAmount ? ((totalActual / contractAmount) * 100).toFixed(1) : "0.0"

  const handleCreate = async (values: PaymentPlanFormData) => {
    if (!onCreatePlan) {
      // Mock create
      const newPlan: PaymentPlan = {
        id: `PP-${Date.now()}`,
        contractId,
        planCode: values.planCode,
        planAmount: values.planAmount,
        planDate: values.planDate,
        actualAmount: values.actualAmount,
        actualDate: values.actualDate,
        status: values.status || "待回款",
        remark: values.remark,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPaymentPlans(prev => [...prev, newPlan])
      setShowCreateDialog(false)
      toast({ title: "回款计划已创建" })
      return
    }

    await onCreatePlan({
      contractId,
      planCode: values.planCode,
      planAmount: values.planAmount,
      planDate: values.planDate,
      actualAmount: values.actualAmount,
      actualDate: values.actualDate,
      status: values.status || "待回款",
      remark: values.remark,
    })
    setShowCreateDialog(false)
    toast({ title: "回款计划已创建" })
  }

  const handleUpdate = async (values: PaymentPlanFormData) => {
    if (!editingPlan || !onUpdatePlan) {
      // Mock update
      if (editingPlan) {
        setPaymentPlans(prev =>
          prev.map(p =>
            p.id === editingPlan.id
              ? {
                  ...p,
                  ...values,
                  updatedAt: new Date().toISOString(),
                }
              : p
          )
        )
        setEditingPlan(null)
        toast({ title: "回款计划已更新" })
      }
      return
    }

    await onUpdatePlan({
      ...editingPlan,
      ...values,
      updatedAt: new Date().toISOString(),
    })
    setEditingPlan(null)
    toast({ title: "回款计划已更新" })
  }

  const handleDelete = async (planId: string) => {
    if (!onDeletePlan) {
      // Mock delete
      setPaymentPlans(prev => prev.filter(p => p.id !== planId))
      toast({ title: "回款计划已删除" })
      return
    }

    await onDeletePlan(planId)
    toast({ title: "回款计划已删除" })
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          回款计划
        </CardTitle>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新建计划
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建回款计划</DialogTitle>
            </DialogHeader>
            <PaymentPlanForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">计划总额</p>
            <p className="text-lg font-semibold">{formatCurrency(totalPlanned)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">已回款</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalActual)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">回款完成率</p>
            <p className="text-lg font-semibold">{completionRate}%</p>
          </div>
        </div>

        {/* Plan List */}
        {paymentPlans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无回款计划，请点击上方按钮创建
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>计划编号</TableHead>
                <TableHead>计划金额</TableHead>
                <TableHead>计划日期</TableHead>
                <TableHead>实际金额</TableHead>
                <TableHead>实际日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.planCode}</TableCell>
                  <TableCell>{formatCurrency(plan.planAmount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {plan.planDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.actualAmount ? (
                      <span className="text-green-600">{formatCurrency(plan.actualAmount)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {plan.actualDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {plan.actualDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPlan(plan)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingPlan(plan)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑回款计划</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <PaymentPlanForm
              mode="edit"
              initialValues={editingPlan}
              onSubmit={handleUpdate}
              onCancel={() => setEditingPlan(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingPlan} onOpenChange={(open) => !open && setViewingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>查看回款计划</DialogTitle>
          </DialogHeader>
          {viewingPlan && (
            <PaymentPlanForm
              mode="record"
              initialValues={viewingPlan}
              onSubmit={() => setViewingPlan(null)}
              onCancel={() => setViewingPlan(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PaymentPlanList
