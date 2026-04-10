"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ==========================================
// ConfirmPopover 确认气泡 (Ant Design Popconfirm 替代)
// ==========================================
// 使用方式:
// <ConfirmPopover
//   title="确认删除？"
//   confirmText="删除"
//   cancelText="取消"
//   onConfirm={() => handleDelete()}
// >
//   <Button>删除</Button>
// </ConfirmPopover>

export interface ConfirmPopoverProps {
  /** 触发器 */
  children: React.ReactNode
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 确认按钮文字 */
  confirmText?: React.ReactNode
  /** 取消按钮文字 */
  cancelText?: React.ReactNode
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 确认按钮类型 */
  confirmType?: "primary" | "danger" | "default"
  /** 气泡是否打开 */
  open?: boolean
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 弹出位置 */
  placement?: "top" | "bottom" | "left" | "right" | "topStart" | "topEnd" | "bottomStart" | "bottomEnd" | "leftStart" | "leftEnd" | "rightStart" | "rightEnd"
  /** 触发方式 */
  trigger?: "click" | "hover" | "focus"
  /** 是否禁用 */
  disabled?: boolean
  /** 额外的 className */
  className?: string
  /** 内容的 className */
  contentClassName?: string
  /** 包裹 trigger 的 className */
  triggerClassName?: string
  /** 取消按钮 props */
  cancelButtonProps?: React.ComponentProps<typeof Button>
  /** 确认按钮 props */
  confirmButtonProps?: React.ComponentProps<typeof Button>
}

function getSide(placement: ConfirmPopoverProps["placement"]) {
  if (!placement) return "top" as const
  if (placement.startsWith("top")) return "top" as const
  if (placement.startsWith("bottom")) return "bottom" as const
  if (placement.startsWith("left")) return "left" as const
  if (placement.startsWith("right")) return "right" as const
  return "top" as const
}

function getAlign(placement: ConfirmPopoverProps["placement"]) {
  if (!placement) return "center" as const
  if (placement.endsWith("Start")) return "start" as const
  if (placement.endsWith("End")) return "end" as const
  return "center" as const
}

export function ConfirmPopover({
  children,
  title,
  description,
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
  confirmType = "primary",
  open,
  onOpenChange,
  placement = "top",
  trigger = "click",
  disabled,
  className,
  contentClassName,
  triggerClassName,
  cancelButtonProps,
  confirmButtonProps,
}: ConfirmPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (disabled) return
      if (!isControlled) setInternalOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [disabled, isControlled, onOpenChange]
  )

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await onConfirm?.()
    } catch {
      // keep open on error
    }
    handleOpenChange(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel?.()
    handleOpenChange(false)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (trigger === "click" || trigger === undefined) {
      handleOpenChange(!isOpen)
    }
  }

  const triggerProps =
    trigger === "click"
      ? { onClick: handleTriggerClick }
      : trigger === "hover"
      ? {
          onMouseEnter: () => handleOpenChange(true),
          onMouseLeave: () => handleOpenChange(false),
        }
      : { onFocus: () => handleOpenChange(true), onBlur: () => handleOpenChange(false) }

  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild className={triggerClassName} disabled={disabled}>
        {React.cloneElement(child, triggerProps)}
      </PopoverTrigger>
      <PopoverContent
        side={getSide(placement)}
        align={getAlign(placement)}
        sideOffset={8}
        className={cn("w-72 p-4", contentClassName, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="mb-4 space-y-1">
            {title && (
              <div className="text-sm font-medium text-foreground">{title}</div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmType === "danger" ? "destructive" : confirmType === "primary" ? "default" : confirmType}
            size="sm"
            onClick={handleConfirm}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ConfirmPopover
