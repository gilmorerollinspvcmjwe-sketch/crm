"use client"

import * as React from "react"
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ==========================================
// Modal 组件封装 (Ant Design Modal 替代)
// ==========================================
// 支持 Ant Design Modal 的常用 API
// 使用方式: <Modal open={open} onOpenChange={setOpen} title="标题">内容</Modal>
// 或使用 ConfirmDialog: Modal.confirm({ title: '确认', content: '确定删除？', onOk: () => {} })

export interface ModalProps {
  /** 对话框是否可见 */
  open?: boolean
  /** open 变化的回调 */
  onOpenChange?: (open: boolean) => void
  /** 标题 */
  title?: React.ReactNode
  /** 描述文字 */
  description?: React.ReactNode
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭按钮文案 */
  closeText?: React.ReactNode
  /** 宽度 */
  width?: number | string
  /** 内容区域 className */
  contentClassName?: string
  /** 底部内容，通常传入 Footer 组件 */
  footer?: React.ReactNode
  /** 取消按钮回调 */
  onCancel?: () => void
  /** 关闭回调（兼容 onClose） */
  onClose?: () => void
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
  /** 包裹的内容 */
  children?: React.ReactNode
  /** 额外的 className */
  className?: string
  /** 根元素的 className */
  rootClassName?: string
  /** 是否嵌入在某个元素内 */
  getContainer?: HTMLElement | (() => HTMLElement) | false
  /** 自定义确认按钮 props */
  okButtonProps?: React.ComponentProps<typeof Button>
  /** 自定义取消按钮 props */
  cancelButtonProps?: React.ComponentProps<typeof Button>
}

interface ConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  content?: React.ReactNode
  icon?: React.ReactNode
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  okType?: "primary" | "danger" | "default"
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  /** 关闭回调（兼容 onClose） */
  onClose?: () => void
  confirmLoading?: boolean
  width?: number | string
  className?: string
}

// ------------------------------------------
// Modal 主组件
// ------------------------------------------
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  closable = true,
  closeText,
  width = 520,
  contentClassName,
  footer,
  onCancel,
  onClose,
  onOk,
  cancelText = "取消",
  okText = "确定",
  confirmLoading = false,
  maskClosable = true,
  children,
  className,
  rootClassName,
  okButtonProps,
  cancelButtonProps,
}: ModalProps) {
  // 兼容 onClose 和 onCancel
  const handleCancel = () => {
    onCancel?.()
    onClose?.()
  }
  const widthStyle =
    typeof width === "number" ? { width } : { width };

  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-[90vw]", contentClassName)}
        style={widthStyle}
        onPointerDownOutside={
          maskClosable ? undefined : (e) => e.preventDefault()
        }
      >
        {(title || closable) && (
          <DialogHeader className={cn(!title && "sr-only")}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={cn("py-2", className)}>{children}</div>

        {footer !== undefined ? (
          footer
        ) : (
          <DialogFooter>
            {closable && (
              <Button
                variant="outline"
                onClick={handleCancel}
                {...cancelButtonProps}
              >
                {closeText || cancelText}
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
          </DialogFooter>
        )}

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 [&_svg]:pointer-events-none"
            onClick={handleCancel}
          >
            <span aria-hidden>×</span>
            <span className="sr-only">关闭</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </ShadcnDialog>
  )
}

// ------------------------------------------
// Confirm 确认对话框
// ------------------------------------------
const iconMap = {
  info: (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    </span>
  ),
  success: (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    </span>
  ),
  warning: (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </span>
  ),
  error: (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
    </span>
  ),
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "确认",
  content,
  icon,
  okText = "确定",
  cancelText = "取消",
  okType = "primary",
  onOk,
  onCancel,
  onClose,
  confirmLoading = false,
  width = 420,
  className,
}: ConfirmDialogProps) {
  const widthStyle =
    typeof width === "number" ? { width } : { width };

  const handleCancel = () => {
    onCancel?.()
    onClose?.()
    onOpenChange?.(false)
  }

  const handleOk = async () => {
    try {
      await onOk?.()
    } catch {
      // keep open on error
    }
  }

  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-[90vw]", className)}
        style={widthStyle}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {icon && <div className="shrink-0">{icon}</div>}
          <DialogHeader className="space-y-0">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content && (
            <div className="text-sm text-muted-foreground">{content}</div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={okType === "danger" ? "destructive" : okType === "primary" ? "default" : okType}
            onClick={handleOk}
            disabled={confirmLoading}
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
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  )
}

// ------------------------------------------
// Modal.info / success / error / warning 静态方法
// ------------------------------------------
interface ModalStaticOptions {
  title?: React.ReactNode
  content?: React.ReactNode
  icon?: React.ReactNode
  okText?: React.ReactNode
  cancelText?: React.ReactNode
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  width?: number | string
}

function createConfirmHook(type: "info" | "success" | "warning" | "error" | "confirm") {
  return function useConfirm(options: ModalStaticOptions = {}) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const resolverRef = React.useRef<{ resolve: () => void; reject: () => void } | null>(null)

    const handleOk = async () => {
      setLoading(true)
      try {
        await options.onOk?.()
        resolverRef.current?.resolve()
        setOpen(false)
      } catch {
        resolverRef.current?.reject()
      } finally {
        setLoading(false)
      }
    }

    const handleCancel = () => {
      options.onCancel?.()
      resolverRef.current?.reject()
      setOpen(false)
    }

    const dialog = (
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={options.title}
        content={options.content}
        icon={options.icon ?? (type !== "confirm" ? iconMap[type] : undefined)}
        okText={options.okText ?? (type === "confirm" ? "确定" : type === "info" ? "知道了" : "确定")}
        cancelText={options.cancelText}
        okType={type === "error" || type === "warning" ? "danger" : "primary"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={options.width}
      />
    )

    const show = () => setOpen(true)

    const promise = new Promise<void>((resolve, reject) => {
      resolverRef.current = { resolve, reject }
    })

    return { dialog, show, promise }
  }
}

/** Modal.info - 信息提示对话框 */
Modal.info = createConfirmHook("info")

/** Modal.success - 成功提示对话框 */
Modal.success = createConfirmHook("success")

/** Modal.warning - 警告提示对话框 */
Modal.warning = createConfirmHook("warning")

/** Modal.error - 错误提示对话框 */
Modal.error = createConfirmHook("error")

/** Modal.confirm - 确认对话框 */
Modal.confirm = createConfirmHook("confirm")

export default Modal
