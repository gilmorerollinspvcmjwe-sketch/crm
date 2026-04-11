"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// ==========================================
// DropdownMenu 组件封装 (Ant Design Dropdown 替代)
// ==========================================
// 使用方式:
// <DropdownMenu trigger={<Button>打开</Button>}>
//   <DropdownMenuItem>选项1</DropdownMenuItem>
//   <DropdownMenuSeparator />
//   <DropdownMenuItem danger>删除</DropdownMenuItem>
// </DropdownMenu>

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuTriggerRoot = DropdownMenuPrimitive.Trigger

export interface DropdownMenuProps {
  /** 触发器 */
  trigger?: React.ReactNode
  /** 菜单内容 */
  children?: React.ReactNode
  /** 菜单位置 */
  align?: "start" | "center" | "end"
  /** 是否禁用 */
  disabled?: boolean
  /** 展开状态 */
  open?: boolean
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 额外的 className */
  className?: string
  /** 内容偏移量 */
  sideOffset?: number
  /** 包裹 trigger 的 className */
  triggerClassName?: string
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  disabled,
  open,
  onOpenChange,
  className,
  sideOffset = 4,
  triggerClassName,
}: DropdownMenuProps) {
  return (
    <DropdownMenuRoot
      open={open}
      onOpenChange={onOpenChange}
    >
      {trigger && (
        <DropdownMenuTriggerRoot asChild className={triggerClassName} disabled={disabled}>
          <div>{trigger}</div>
        </DropdownMenuTriggerRoot>
      )}
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuRoot>
  )
}

// ------------------------------------------
// DropdownMenuItem
// ------------------------------------------
export interface DropdownMenuItemProps {
  /** 危险操作样式 */
  danger?: boolean
  /** 菜单项内容 */
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function DropdownMenuItem({
  danger,
  className,
  children,
  disabled,
  onClick,
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        danger && "text-destructive focus:bg-destructive/10 focus:text-destructive",
        className
      )}
      disabled={disabled}
      onSelect={(e) => {
        e.preventDefault()
        onClick?.()
      }}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

// ------------------------------------------
// DropdownMenuLabel
// ------------------------------------------
export function DropdownMenuLabel({
  children,
  className,
}: { children?: React.ReactNode; className?: string }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  )
}

// ------------------------------------------
// DropdownMenuSeparator
// ------------------------------------------
export function DropdownMenuSeparator({
  className,
}: { className?: string }) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
    />
  )
}

// ------------------------------------------
// DropdownMenuGroup
// ------------------------------------------
export function DropdownMenuGroup({
  children,
}: { children?: React.ReactNode }) {
  return (
    <DropdownMenuPrimitive.Group>
      {children}
    </DropdownMenuPrimitive.Group>
  )
}

// ------------------------------------------
// DropdownMenuSub
// ------------------------------------------
export function DropdownMenuSub({
  children,
}: { children?: React.ReactNode }) {
  return (
    <DropdownMenuPrimitive.Sub>
      {children}
    </DropdownMenuPrimitive.Sub>
  )
}

export function DropdownMenuSubContent({
  children,
  className,
}: { children?: React.ReactNode; className?: string }) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  )
}

export function DropdownMenuSubTrigger({
  children,
  className,
}: { children?: React.ReactNode; className?: string }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        className
      )}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

// ------------------------------------------
// DropdownMenuRadioGroup
// ------------------------------------------
export function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
}: { children?: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  return (
    <DropdownMenuPrimitive.RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </DropdownMenuPrimitive.RadioGroup>
  )
}

// ------------------------------------------
// DropdownMenuCheckboxItem
// ------------------------------------------
export function DropdownMenuCheckboxItem({
  children,
  className,
  checked,
  onCheckedChange,
}: { children?: React.ReactNode; className?: string; checked?: boolean; onCheckedChange?: (checked: boolean) => void }) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

// ------------------------------------------
// DropdownMenuRadioItem
// ------------------------------------------
export function DropdownMenuRadioItem({
  children,
  className,
  value,
}: { children?: React.ReactNode; className?: string; value: string }) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      value={value}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

export default DropdownMenu
