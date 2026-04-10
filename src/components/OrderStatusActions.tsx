/**
 * 订单状态操作组件
 * Order Status Actions Component
 * 
 * Features:
 * - Display available status transitions based on current status
 * - Confirm order, ship, complete, cancel operations
 * - Support remark input for status changes
 * - Use shadcn/ui components
 */

import React, { useState } from 'react'
import { Check, Truck, PackageCheck, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { OrderStatus } from '@/types/api'
import {
  ORDER_STATUS_TRANSITIONS,
  OrderStatusLabels,
  OrderStatusColors,
  type OrderStatusTransition,
} from '@/types/orderItem'

interface OrderStatusActionsProps {
  /** 当前订单状态 */
  currentStatus: OrderStatus
  /** 是否只读模式 */
  readOnly?: boolean
  /** 状态变更回调 */
  onStatusChange: (newStatus: OrderStatus, remark?: string) => void | Promise<void>
  /** 操作按钮布局 */
  layout?: 'horizontal' | 'vertical' | 'dropdown'
}

/**
 * 状态变更确认对话框属性
 */
interface StatusChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transition: OrderStatusTransition | null
  currentStatus: OrderStatus
  onConfirm: (remark?: string) => void | Promise<void>
}

/**
 * 状态变更确认对话框组件
 */
function StatusChangeDialog({
  open,
  onOpenChange,
  transition,
  currentStatus,
  onConfirm,
}: StatusChangeDialogProps) {
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (open) {
      setRemark('')
      setLoading(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (transition?.requireRemark && !remark.trim()) {
      return
    }
    
    setLoading(true)
    try {
      await onConfirm(remark.trim() || undefined)
      onOpenChange(false)
    } catch (error) {
      console.error('Status change failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!transition) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transition.label}</DialogTitle>
          <DialogDescription>
            {transition.description || `将订单状态从"${OrderStatusLabels[currentStatus]}"变更为"${OrderStatusLabels[transition.to]}"`}
          </DialogDescription>
        </DialogHeader>

        {transition.requireRemark && (
          <div className="py-4 space-y-2">
            <Label htmlFor="remark">备注说明 *</Label>
            <Textarea
              id="remark"
              placeholder="请输入操作说明或原因"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {!transition.requireRemark && remark && (
          <div className="py-4 space-y-2">
            <Label htmlFor="remark-optional">备注说明 (选填)</Label>
            <Textarea
              id="remark-optional"
              placeholder="请输入备注信息"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button
            variant={transition.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading || (transition.requireRemark && !remark.trim())}
          >
            {loading ? '处理中...' : '确认'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * 获取状态图标
 */
function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case '待确认':
      return Clock
    case '已确认':
      return Check
    case '生产中':
      return PackageCheck
    case '已发货':
      return Truck
    case '已完成':
      return Check
    case '已取消':
      return XCircle
    default:
      return Clock
  }
}

/**
 * 订单状态操作组件
 */
export function OrderStatusActions({
  currentStatus,
  readOnly = false,
  onStatusChange,
  layout = 'horizontal',
}: OrderStatusActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTransition, setSelectedTransition] = useState<OrderStatusTransition | null>(null)

  // 获取当前状态可用的流转操作
  const availableTransitions = ORDER_STATUS_TRANSITIONS[currentStatus] || []

  // 处理状态变更
  const handleTransition = (transition: OrderStatusTransition) => {
    if (readOnly) {
      return
    }

    if (transition.requireConfirmation) {
      setSelectedTransition(transition)
      setDialogOpen(true)
    } else {
      onStatusChange(transition.to)
    }
  }

  // 对话框确认处理
  const handleDialogConfirm = async (remark?: string) => {
    if (selectedTransition) {
      await onStatusChange(selectedTransition.to, remark)
      setSelectedTransition(null)
    }
  }

  // 渲染操作按钮
  const renderActionButton = (transition: OrderStatusTransition) => {
    const Icon = getStatusIcon(transition.to)
    
    const button = (
      <Button
        key={transition.to}
        variant={transition.variant || 'default'}
        size="sm"
        onClick={() => handleTransition(transition)}
        disabled={readOnly}
        className="gap-2"
      >
        <Icon className="w-4 h-4" />
        {transition.label}
      </Button>
    )

    // 对于不需要确认的取消操作，直接返回按钮
    if (!transition.requireConfirmation && transition.to === '已取消') {
      return (
        <Button
          key={transition.to}
          variant="destructive"
          size="sm"
          onClick={() => onStatusChange(transition.to)}
        >
          {transition.label}
        </Button>
      )
    }

    return button
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">订单状态</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 当前状态展示 */}
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">当前状态</div>
            <Badge className={`text-sm ${OrderStatusColors[currentStatus]}`}>
              {OrderStatusLabels[currentStatus]}
            </Badge>
          </div>

          {/* 可用操作 */}
          {!readOnly && availableTransitions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">可执行操作</div>
              <div className={`flex ${layout === 'vertical' ? 'flex-col gap-2' : 'flex-wrap gap-2'}`}>
                {availableTransitions.map(renderActionButton)}
              </div>
            </div>
          )}

          {/* 只读模式下显示状态流转说明 */}
          {readOnly && availableTransitions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">可执行操作</div>
              <div className="flex flex-wrap gap-2">
                {availableTransitions.map((transition) => (
                  <Badge
                    key={transition.to}
                    variant="outline"
                    className="text-xs"
                  >
                    {transition.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 无可用操作 */}
          {availableTransitions.length === 0 && (
            <div className="text-sm text-muted-foreground">
              当前状态无可用操作
            </div>
          )}
        </CardContent>
      </Card>

      {/* 状态变更确认对话框 */}
      <StatusChangeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transition={selectedTransition}
        currentStatus={currentStatus}
        onConfirm={handleDialogConfirm}
      />
    </>
  )
}

/**
 * 简化版状态操作按钮组（用于嵌入其他组件）
 */
export interface OrderStatusButtonGroupProps {
  currentStatus: OrderStatus
  readOnly?: boolean
  onStatusChange: (newStatus: OrderStatus, remark?: string) => void | Promise<void>
  size?: 'default' | 'sm' | 'lg'
  showLabel?: boolean
}

export function OrderStatusButtonGroup({
  currentStatus,
  readOnly = false,
  onStatusChange,
  size = 'sm',
  showLabel = true,
}: OrderStatusButtonGroupProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTransition, setSelectedTransition] = useState<OrderStatusTransition | null>(null)

  const availableTransitions = ORDER_STATUS_TRANSITIONS[currentStatus] || []

  const handleTransition = (transition: OrderStatusTransition) => {
    if (readOnly) return

    if (transition.requireConfirmation) {
      setSelectedTransition(transition)
      setDialogOpen(true)
    } else {
      onStatusChange(transition.to)
    }
  }

  const handleDialogConfirm = async (remark?: string) => {
    if (selectedTransition) {
      await onStatusChange(selectedTransition.to, remark)
      setSelectedTransition(null)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableTransitions.map((transition) => {
          const Icon = getStatusIcon(transition.to)
          return (
            <Button
              key={transition.to}
              variant={transition.variant || 'default'}
              size={size}
              onClick={() => handleTransition(transition)}
              disabled={readOnly}
              className="gap-1"
            >
              <Icon className="w-3 h-3" />
              {showLabel && transition.label}
            </Button>
          )
        })}
      </div>

      <StatusChangeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transition={selectedTransition}
        currentStatus={currentStatus}
        onConfirm={handleDialogConfirm}
      />
    </>
  )
}

export default OrderStatusActions
