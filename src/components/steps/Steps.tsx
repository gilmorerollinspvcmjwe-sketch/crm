"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// ==========================================
// Steps 组件 (Ant Design Steps 替代)
// ==========================================
// 支持水平/垂直方向，支持点击切换
// 使用方式:
// <Steps current={1}>
//   <StepsStep title="步骤1" description="描述1" />
//   <StepsStep title="步骤2" description="描述2" />
//   <StepsStep title="步骤3" description="描述3" />
// </Steps>

export type StepsStatus = "wait" | "process" | "finish" | "error"

export interface StepProps {
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 图标（优先级最高） */
  icon?: React.ReactNode
  /** 状态（由父组件控制） */
  status?: StepsStatus
  /** 是否可点击 */
  disabled?: boolean
  /** 子标题 */
  subTitle?: React.ReactNode
  /** 额外的 tail */
  tail?: React.ReactNode
  className?: string
}

const statusColors: Record<StepsStatus, { dot: string; text: string; bg: string; border: string }> = {
  wait: {
    dot: "bg-muted border-muted-foreground/30",
    text: "text-muted-foreground",
    bg: "bg-background border-border",
    border: "border-border",
  },
  process: {
    dot: "bg-primary border-primary",
    text: "text-primary",
    bg: "bg-primary/10 border-primary",
    border: "border-primary",
  },
  finish: {
    dot: "bg-primary border-primary",
    text: "text-foreground",
    bg: "bg-background border-border",
    border: "border-primary",
  },
  error: {
    dot: "bg-destructive border-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10 border-destructive",
    border: "border-destructive",
  },
}

function StepNode({
  status = "wait",
  icon,
  stepNumber,
  clickable,
  onClick,
}: {
  status?: StepsStatus
  icon?: React.ReactNode
  stepNumber?: number
  clickable?: boolean
  onClick?: () => void
}) {
  const colors = statusColors[status]

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={cn(
        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
        colors.bg,
        colors.border,
        clickable && "cursor-pointer hover:ring-2 hover:ring-ring/20",
        !clickable && "cursor-default",
        colors.text
      )}
    >
      {icon ?? (status === "finish" ? <Check className="h-4 w-4" /> : stepNumber)}
    </button>
  )
}

export function StepsStep({
  title,
  description,
  subTitle,
  tail,
  className,
}: StepProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {title && <div className="text-sm font-medium">{title}</div>}
      {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      {subTitle && <div className="text-xs text-muted-foreground">{subTitle}</div>}
      {tail && <div className="mt-1">{tail}</div>}
    </div>
  )
}
StepsStep.displayName = "StepsStep"

export interface StepsProps {
  /** 当前步骤（从 0 开始） */
  current?: number
  /** 当前步骤状态 */
  status?: StepsStatus
  /** 方向 */
  direction?: "horizontal" | "vertical"
  /** 步骤变化回调 */
  onChange?: (current: number) => void
  /** 是否可点击切换 */
  clickable?: boolean
  /** 标签位置 */
  labelPlacement?: "horizontal" | "vertical"
  /** 子组件 */
  children?: React.ReactNode
  className?: string
  /** 步骤节点大小 */
  size?: "default" | "small"
  /** 进度条大小 */
  progressDot?: boolean
  /** 初始步骤 */
  initial?: number
}

export function Steps({
  current = 0,
  status = "process",
  direction = "horizontal",
  onChange,
  clickable = false,
  labelPlacement = "horizontal",
  children,
  className,
}: StepsProps) {
  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps & { key?: React.Key }> =>
      React.isValidElement(child) && (child.type as React.ComponentType)?.displayName === "StepsStep"
  )

  const computeStatus = (index: number): StepsStatus => {
    if (index < current) return "finish"
    if (index === current) return status
    return "wait"
  }

  const isVertical = direction === "vertical"
  const isLabelVertical = labelPlacement === "vertical"

  return (
    <div
      className={cn(
        "flex gap-4",
        isVertical ? "flex-col" : "flex-row items-start",
        className
      )}
    >
      {steps.map((step, index) => {
        const stepStatus = computeStatus(index)
        const stepProps = step.props as StepProps

        return (
          <div
            key={step.key ?? index}
            className={cn(
              "flex",
              isVertical
                ? "flex-row gap-4"
                : isLabelVertical
                ? "flex-col items-center"
                : "flex-col items-start",
              "flex-1"
            )}
            onClick={() => clickable && onChange?.(index)}
          >
            {/* 连接线和节点 */}
            <div
              className={cn(
                "flex items-center",
                isVertical ? "flex-row gap-2" : isLabelVertical ? "flex-col gap-2" : "flex-row gap-2"
              )}
            >
              <StepNode
                status={stepStatus}
                icon={stepProps.icon}
                stepNumber={index + 1}
                clickable={clickable}
                onClick={() => onChange?.(index)}
              />
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 bg-border",
                    stepStatus === "finish" && "bg-primary",
                    isVertical
                      ? "h-8 w-px"
                      : isLabelVertical
                      ? "h-8 w-px"
                      : "h-px w-8"
                  )}
                />
              )}
            </div>

            {/* 内容 */}
            <div
              className={cn(
                !isVertical && !isLabelVertical && "pt-2",
                !isVertical && isLabelVertical && "pt-2"
              )}
            >
              <StepsStep {...stepProps} status={stepStatus} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Steps
