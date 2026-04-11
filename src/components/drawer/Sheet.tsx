"use client"

import * as React from "react"
import {
  Sheet as ShadcnSheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// ==========================================
// Drawer 组件封装 (Ant Design Drawer 替代)
// ==========================================
// 替代 Ant Design Drawer，支持左侧/右侧/顶部/底部弹出
// 使用方式: <Drawer open={open} onOpenChange={setOpen} title="标题">内容</Drawer>

export type DrawerPlacement = "left" | "right" | "top" | "bottom"

export interface DrawerProps {
  /** 对话框是否可见 */
  open?: boolean
  /** open 变化的回调 */
  onOpenChange?: (open: boolean) => void
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 弹出位置 */
  placement?: DrawerPlacement
  /** 宽度（左右弹出时） */
  width?: number | string
  /** 高度（上下弹出时） */
  height?: number | string
  /** 底部内容 */
  footer?: React.ReactNode
  /** 取消按钮回调 */
  onCancel?: () => void
  /** 确定按钮回调 */
  onOk?: () => void
  /** 取消按钮文字 */
  cancelText?: React.ReactNode
  /** 确定按钮文字 */
  okText?: React.ReactNode
  /** 是否显示确认按钮 Loading */
  confirmLoading?: boolean
  /** 是否点击遮罩层可以关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 包裹的内容 */
  children?: React.ReactNode
  /** 额外的 className */
  className?: string
  /** 内容的 className */
  contentClassName?: string
  /** z-index 层级 */
  zIndex?: number
  /** 销毁子元素 */
  destroyOnClose?: boolean
  /** 自定义确认按钮 props */
  okButtonProps?: React.ComponentProps<typeof Button>
  /** 自定义取消按钮 props */
  cancelButtonProps?: React.ComponentProps<typeof Button>
}

function getSizeStyle(
  placement: DrawerPlacement,
  size?: number | string
): React.CSSProperties {
  if (!size) return {}
  if (typeof size === "number") {
    return placement === "left" || placement === "right"
      ? { width: size }
      : { height: size }
  }
  return placement === "left" || placement === "right"
    ? { width: size }
    : { height: size }
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  placement = "right",
  width,
  height,
  footer,
  onCancel,
  onOk,
  cancelText = "取消",
  okText = "确定",
  confirmLoading = false,
  maskClosable = true,
  closable = true,
  children,
  className,
  contentClassName,
  zIndex,
  destroyOnClose = false,
  okButtonProps,
  cancelButtonProps,
}: DrawerProps) {
  const sizeStyle = getSizeStyle(placement, placement === "left" || placement === "right" ? width : height)
  const side = placement === "top" || placement === "bottom" ? undefined : placement

  return (
    <ShadcnSheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(contentClassName, className)}
        style={{ ...sizeStyle, zIndex }}
        onPointerDownOutside={
          maskClosable ? undefined : (e) => e.preventDefault()
        }
      >
        {(title || closable) && (
          <SheetHeader className={cn(!title && "sr-only")}>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        <div className={cn("flex-1 overflow-y-auto py-4", destroyOnClose && !open && "hidden")}>
          {children}
        </div>

        {footer !== undefined ? (
          footer
        ) : (
          <SheetFooter>
            {closable && (
              <Button variant="outline" onClick={onCancel} disabled={confirmLoading} {...cancelButtonProps}>
                {cancelText}
              </Button>
            )}
            {onOk && (
              <Button
                variant="default"
                onClick={onOk}
                disabled={confirmLoading}
                {...okButtonProps}
              >
                {confirmLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>处理中...</span>
                  </>
                ) : (
                  okText
                )}
              </Button>
            )}
          </SheetFooter>
        )}

        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 [&_svg]:pointer-events-none"
            onClick={onCancel}
          >
            ×
          </Button>
        </SheetClose>
      </SheetContent>
    </ShadcnSheet>
  )
}

export default Drawer
