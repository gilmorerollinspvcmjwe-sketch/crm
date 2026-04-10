"use client"

import * as React from "react"
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

// ==========================================
// Accordion 组件封装 (Ant Design Collapse 替代)
// ==========================================
// 支持手风琴模式
// 使用方式:
// <Accordion>
//   <AccordionPanel key="1" title="标题1">内容1</AccordionPanel>
//   <AccordionPanel key="2" title="标题2">内容2</AccordionPanel>
// </Accordion>

export interface AccordionPanelProps {
  /** Panel key */
  key?: string
  /** 面板标题 */
  title?: React.ReactNode
  /** 面板内容 */
  children?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 颢外的 className */
  className?: string
  /** 标题 className */
  titleClassName?: string
  /** 内容 className */
  contentClassName?: string
  /** 标题前的图标 */
  icon?: React.ReactNode
  /** 面板值 */
  value?: string
}

export function AccordionPanel({
  title,
  children,
  disabled,
  className,
  titleClassName,
  contentClassName,
  icon,
  value,
}: AccordionPanelProps) {
  return (
    <AccordionItem value={value || 'default'} className={cn("border-b", className)}>
      <AccordionTrigger
        className={titleClassName}
        disabled={disabled}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </AccordionTrigger>
      <AccordionContent className={contentClassName}>
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

export interface AccordionProps {
  /** 是否手风琴模式 */
  accordion?: boolean
  /** 当前展开的 Panel */
  activeKey?: string | string[]
  /** 默认展开的 Panel */
  defaultActiveKey?: string | string[]
  /** 展开变化回调 */
  onChange?: (key: string | string[]) => void
  /** 包裹 children */
  children?: React.ReactNode
  /** 颢外的 className */
  className?: string
  /** Panel className */
  panelClassName?: string
  /** 标题 className */
  panelTitleClassName?: string
  /** 内容 className */
  panelContentClassName?: string
  /** Panel 的 icon */
  panelIcon?: React.ReactNode
  /** 是否显示边框 */
  bordered?: boolean
}

export function Accordion({
  accordion = false,
  defaultActiveKey,
  className,
  panelClassName,
  panelTitleClassName,
  panelContentClassName,
  panelIcon,
  bordered = true,
  children,
}: AccordionProps) {
  // Map children to add shared classNames and value
  const childrenWithSharedProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement<AccordionPanelProps>(child)) {
      return React.cloneElement(child, {
        className: cn(panelClassName, child.props.className),
        titleClassName: cn(panelTitleClassName, child.props.titleClassName),
        contentClassName: cn(panelContentClassName, child.props.contentClassName),
        icon: panelIcon ?? child.props.icon,
        value: child.props.value || child.props.key || `panel-${index}`,
      })
    }
    return child
  })

  if (accordion) {
    return (
      <ShadcnAccordion
        type="single"
        defaultValue={defaultActiveKey as string | undefined}
        collapsible
        className={cn(bordered ? "border rounded-lg" : "", className)}
      >
        {childrenWithSharedProps}
      </ShadcnAccordion>
    )
  }

  return (
    <ShadcnAccordion
      type="multiple"
      defaultValue={Array.isArray(defaultActiveKey) ? defaultActiveKey : defaultActiveKey ? [defaultActiveKey] : []}
      className={cn(bordered ? "border rounded-lg" : "", className)}
    >
      {childrenWithSharedProps}
    </ShadcnAccordion>
  )
}

export default Accordion
