"use client"

import * as React from "react"
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ==========================================
// Tooltip 组件封装 (Ant Design Tooltip 替代)
// ==========================================
// 使用方式:
// <Tooltip content="提示文字">
//   <Button>hover me</Button>
// </Tooltip>

export interface TooltipProps {
  /** 提示内容 */
  content?: React.ReactNode
  /** 触发方式 */
  trigger?: "hover" | "click" | "focus" | "manual"
  /** 弹出位置 */
  placement?: "top" | "bottom" | "left" | "right" | "topStart" | "topEnd" | "bottomStart" | "bottomEnd" | "leftStart" | "leftEnd" | "rightStart" | "rightEnd"
  /** 包裹的内容 */
  children: React.ReactNode
  /** 额外的 className */
  className?: string
  /** 内容样式 */
  contentClassName?: string
  /** 延迟显示（ms） */
  mouseEnterDelay?: number
  /** 延迟隐藏（ms） */
  mouseLeaveDelay?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 偏移量 */
  sideOffset?: number
  /** 包裹子元素的 className */
  childrenClassName?: string
  /** 开放状态（trigger=manual 时使用） */
  open?: boolean
  /** 状态变化回调 */
  onOpenChange?: (open: boolean) => void
}

function getSide(placement: TooltipProps["placement"]): "top" | "bottom" | "left" | "right" | undefined {
  if (!placement) return undefined
  if (placement.startsWith("top")) return "top"
  if (placement.startsWith("bottom")) return "bottom"
  if (placement.startsWith("left")) return "left"
  if (placement.startsWith("right")) return "right"
  return undefined
}

function getAlign(placement: TooltipProps["placement"]): "start" | "center" | "end" | undefined {
  if (!placement) return undefined
  if (placement.endsWith("Start")) return "start"
  if (placement.endsWith("End")) return "end"
  if (placement === "top" || placement === "bottom" || placement === "left" || placement === "right") return "center"
  return undefined
}

export function Tooltip({
  content,
  placement = "top",
  children,
  className,
  contentClassName,
  mouseEnterDelay = 0,
  mouseLeaveDelay = 0,
  disabled,
  sideOffset = 4,
  childrenClassName,
  open,
  onOpenChange,
}: TooltipProps) {
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

  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>

  return (
    <ShadcnTooltip
      delayDuration={mouseEnterDelay * 1000}
      disableHoverableContent={mouseLeaveDelay === 0}
      open={isControlled ? open : undefined}
      onOpenChange={handleOpenChange}
    >
      <TooltipTrigger asChild>
        {React.cloneElement(child, {
          className: cn(childrenClassName, child.props.className),
        })}
      </TooltipTrigger>
      <TooltipContent
        side={getSide(placement)}
        align={getAlign(placement)}
        sideOffset={sideOffset}
        className={cn(contentClassName, !content && "hidden")}
        style={{
          transitionDelay: mouseLeaveDelay > 0 ? `${mouseLeaveDelay}ms` : undefined,
        }}
      >
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  )
}

// ------------------------------------------
// Tooltip Provider 包装器（带延迟）
// ------------------------------------------
export interface TooltipWrapperProps {
  children: React.ReactNode
  /** 全局延迟 */
  delayDuration?: number
  className?: string
}

export function TooltipWrapper({
  children,
  delayDuration = 300,
}: TooltipWrapperProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      {children}
    </TooltipProvider>
  )
}

export { TooltipProvider, TooltipTrigger, TooltipContent }
export default Tooltip
