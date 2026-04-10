"use client"

import * as React from "react"
import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ==========================================
// Tabs 组件封装 (Ant Design Tabs 替代)
// ==========================================
// 支持 default/card 两种类型
// 使用方式:
// <Tabs defaultActiveKey="1">
//   <TabPane key="1" title="标签1">内容1</TabPane>
//   <TabPane key="2" title="标签2">内容2</TabPane>
// </Tabs>

export interface TabPaneProps {
  /** Tab key */
  key?: string
  /** Tab 标题 */
  title?: React.ReactNode
  /** Tab 内容 */
  children?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 额外内容 */
  extra?: React.ReactNode
  /** 隐藏 Tab */
  hidden?: boolean
  className?: string
}

export function TabPane({ children, className, hidden }: TabPaneProps) {
  if (hidden) return null
  return <div className={cn("mt-2", className)}>{children}</div>
}
TabPane.displayName = "TabPane"

export interface TabsProps {
  /** 当前激活的 Tab */
  activeKey?: string
  /** 默认激活的 Tab */
  defaultActiveKey?: string
  /** Tab 变化回调 */
  onChange?: (key: string) => void
  /** Tab 类型: default | card | editable-card */
  type?: "line" | "card" | "editable-card"
  /** Tab 位置 */
  tabPosition?: "top" | "bottom" | "left" | "right"
  /** 隐藏 Tab 切换箭头 */
  hideAdd?: boolean
  /** 额外的 Tab 内容 */
  extra?: React.ReactNode
  /** 包裹 Tab 内容的额外 className */
  className?: string
  /** TabsList 的 className */
  tabListClassName?: string
  /** Tab 内容区的 className */
  contentClassName?: string
  /** 包裹 children */
  children?: React.ReactNode
  /** 是否使用动画 */
  animated?: boolean
}

export function Tabs({
  activeKey,
  defaultActiveKey,
  onChange,
  type = "line",
  tabPosition = "top",
  className,
  tabListClassName,
  contentClassName,
  children,
  animated = true,
}: TabsProps) {
  const isCard = type === "card" || type === "editable-card"

  // Collect all TabPane children and their keys
  const panes = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabPaneProps> =>
      React.isValidElement(child) && (child.props as TabPaneProps).key !== undefined
  )

  const [internalActiveKey, setInternalActiveKey] = React.useState(
    activeKey ?? defaultActiveKey ?? (panes[0]?.props?.key as string)
  )

  const currentActive = activeKey ?? internalActiveKey

  const handleValueChange = (value: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(value)
    }
    onChange?.(value)
  }

  const isVertical = tabPosition === "left" || tabPosition === "right"

  return (
    <ShadcnTabs
      value={currentActive}
      onValueChange={handleValueChange}
      className={cn(
        "flex",
        isVertical && "flex-row",
        className
      )}
    >
      <TabsList
        className={cn(
          isCard && "bg-muted/50 border",
          isVertical && "flex-col h-auto",
          tabListClassName
        )}
      >
        {panes.map((pane) => {
          const { key, title, disabled } = pane.props as TabPaneProps
          return (
            <TabsTrigger
              key={key}
              value={key as string}
              disabled={disabled}
              className={cn(
                isCard && "bg-background border border-b-0 rounded-t-md -mb-px data-[state=active]:bg-background data-[state=active]:z-10",
                isVertical && "justify-start rounded-md mb-1",
                pane.props?.className
              )}
            >
              {title}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {panes.map((pane) => {
        const { key, children: paneChildren, className: paneClass } = pane.props as TabPaneProps
        return (
          <TabsContent
            key={key}
            value={key as string}
            className={cn(
              !animated && "animate-none",
              contentClassName,
              paneClass
            )}
          >
            {paneChildren}
          </TabsContent>
        )
      })}
    </ShadcnTabs>
  )
}

export default Tabs
