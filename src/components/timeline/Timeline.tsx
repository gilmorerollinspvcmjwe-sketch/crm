"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ==========================================
// Timeline 组件 (shadcn/ui 无此组件，需自定义实现)
// ==========================================
// 垂直时间线，支持自定义节点图标/颜色
// 使用方式:
// <Timeline>
//   <TimelineItem>2024-01-01 事件1</TimelineItem>
//   <TimelineItem color="green">2024-01-02 事件2</TimelineItem>
// </Timeline>

export type TimelineItemColor =
  | "default"
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "gray"

const colorMap: Record<TimelineItemColor, { dot: string; line: string; text: string }> = {
  default: {
    dot: "bg-primary border-primary",
    line: "bg-border",
    text: "text-foreground",
  },
  blue: {
    dot: "bg-blue-500 border-blue-500",
    line: "bg-blue-200",
    text: "text-blue-600",
  },
  green: {
    dot: "bg-green-500 border-green-500",
    line: "bg-green-200",
    text: "text-green-600",
  },
  red: {
    dot: "bg-red-500 border-red-500",
    line: "bg-red-200",
    text: "text-red-600",
  },
  yellow: {
    dot: "bg-yellow-500 border-yellow-500",
    line: "bg-yellow-200",
    text: "text-yellow-600",
  },
  purple: {
    dot: "bg-purple-500 border-purple-500",
    line: "bg-purple-200",
    text: "text-purple-600",
  },
  gray: {
    dot: "bg-gray-400 border-gray-400",
    line: "bg-gray-200",
    text: "text-gray-500",
  },
}

export interface TimelineItemProps {
  /** 时间标签 */
  label?: React.ReactNode
  /** 节点颜色 */
  color?: TimelineItemColor
  /** 节点图标（优先级高于 color） */
  dot?: React.ReactNode
  /** 节点大小 */
  dotSize?: "sm" | "md" | "lg"
  /** 内容 */
  children?: React.ReactNode
  /** 额外 className */
  className?: string
  /** 内容区 className */
  contentClassName?: string
  /** 是否最后一项 */
  isLast?: boolean
  /** 连接线是否使用 color */
  lineColored?: boolean
}

export function TimelineItem({
  label,
  color = "default",
  dot,
  dotSize = "md",
  children,
  className,
  contentClassName,
  isLast = false,
  lineColored = false,
}: TimelineItemProps) {
  const colors = colorMap[color]
  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  return (
    <div className={cn("relative flex gap-4", !isLast && "pb-6", className)}>
      {/* 垂直线 */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[7px] top-4 w-px flex-1",
            lineColored ? colors.line : "bg-border"
          )}
        />
      )}

      {/* 节点 */}
      <div className="relative z-10 mt-1 shrink-0">
        {dot ? (
          <div
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full",
              dot
            )}
          >
            {dot}
          </div>
        ) : (
          <div
            className={cn(
              "rounded-full border-2",
              dotSizes[dotSize],
              colors.dot
            )}
          />
        )}
      </div>

      {/* 内容区 */}
      <div className={cn("min-w-0 flex-1 pt-0.5", contentClassName)}>
        {label && (
          <div className={cn("mb-1 text-xs font-medium text-muted-foreground", colors.text)}>
            {label}
          </div>
        )}
        {children && (
          <div className={cn("text-sm text-foreground", colors.text)}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export interface TimelineProps {
  /** 内容 */
  children?: React.ReactNode
  /** 排列方向 */
  mode?: "left" | "right" | "alternate"
  /** 额外的 className */
  className?: string
  /** 每个 item 的 className */
  itemClassName?: string
  /** 每个 item 的 content className */
  itemContentClassName?: string
  /** 节点大小 */
  dotSize?: TimelineItemProps["dotSize"]
  /** 垂直线是否使用 color */
  lineColored?: boolean
}

export function Timeline({
  children,
  mode = "left",
  className,
  itemClassName,
  itemContentClassName,
  dotSize = "md",
  lineColored = false,
}: TimelineProps) {
  const items = React.Children.toArray(children)

  const childrenWithProps = React.Children.map(items, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<TimelineItemProps>, {
        isLast: index === items.length - 1,
        dotSize: (child.props as TimelineItemProps).dotSize ?? dotSize,
        lineColored: (child.props as TimelineItemProps).lineColored ?? lineColored,
        className: cn(itemClassName, (child.props as TimelineItemProps).className),
        contentClassName: cn(itemContentClassName, (child.props as TimelineItemProps).contentClassName),
      })
    }
    return child
  })

  return (
    <div
      className={cn(
        "flex flex-col",
        mode === "left" && "items-start",
        mode === "right" && "items-end",
        mode === "alternate" && "items-center",
        className
      )}
    >
      {childrenWithProps}
    </div>
  )
}

export default Timeline
