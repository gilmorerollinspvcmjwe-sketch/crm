/**
 * NodePanel - 左侧节点库面板
 * 提供可拖拽的工作流节点模板
 */
"use client"

import React, { useState } from "react"
import {
  Zap,
  Clock,
  CheckSquare,
  Mail,
  Bell,
  UserPlus,
  FileText,
  GitBranch,
  StopCircle,
  Bot,
  GripVertical,
  Edit2,
  Database,
  ArrowRight,
  Search,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react"
import type { NodeType } from "@/types/workflow"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ============ Types ============

interface NodeItem {
  type: NodeType
  subType?: string
  label: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
  description?: string
}

// ============ Node Data ============

const triggerNodes: NodeItem[] = [
  { type: "trigger", subType: "record_created", label: "记录创建时", icon: <Zap className="h-4 w-4" />, bgColor: "bg-blue-50", borderColor: "border-blue-300", textColor: "text-blue-600", description: "当新记录被创建时触发" },
  { type: "trigger", subType: "record_updated", label: "记录更新时", icon: <Edit2 className="h-4 w-4" />, bgColor: "bg-blue-50", borderColor: "border-blue-300", textColor: "text-blue-600", description: "当记录被修改时触发" },
  { type: "trigger", subType: "scheduled", label: "定时执行", icon: <Clock className="h-4 w-4" />, bgColor: "bg-blue-50", borderColor: "border-blue-300", textColor: "text-blue-600", description: "按 cron 表达式定时触发" },
  { type: "trigger", subType: "field_changed", label: "字段变更时", icon: <Database className="h-4 w-4" />, bgColor: "bg-blue-50", borderColor: "border-blue-300", textColor: "text-blue-600", description: "特定字段值变化时触发" },
]

const conditionNodes: NodeItem[] = [
  { type: "condition", label: "条件分支", icon: <GitBranch className="h-4 w-4" />, bgColor: "bg-amber-50", borderColor: "border-amber-300", textColor: "text-amber-600", description: "根据条件决定执行路径" },
]

const actionNodes: NodeItem[] = [
  { type: "action", subType: "send_notification", label: "发送通知", icon: <Bell className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "send_email", label: "发送邮件", icon: <Mail className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "create_task", label: "创建任务", icon: <CheckSquare className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "update_field", label: "更新字段", icon: <Edit2 className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "assign_owner", label: "分配负责人", icon: <UserPlus className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "create_record", label: "创建记录", icon: <FileText className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
  { type: "action", subType: "advance_stage", label: "推进阶段", icon: <ArrowRight className="h-4 w-4" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-300", textColor: "text-emerald-600" },
]

const controlNodes: NodeItem[] = [
  { type: "delay", label: "延迟等待", icon: <Clock className="h-4 w-4" />, bgColor: "bg-purple-50", borderColor: "border-purple-300", textColor: "text-purple-600", description: "等待指定时间后继续" },
  { type: "action", subType: "end_workflow", label: "终止流程", icon: <StopCircle className="h-4 w-4" />, bgColor: "bg-gray-50", borderColor: "border-gray-300", textColor: "text-gray-600" },
]

const aiNodes: NodeItem[] = [
  { type: "action", subType: "ai_generate", label: "AI 生成内容", icon: <Bot className="h-4 w-4" />, bgColor: "bg-indigo-50", borderColor: "border-indigo-300", textColor: "text-indigo-600", description: "使用 AI 生成文本内容" },
]

// ============ Section Component ============

interface NodeSectionProps {
  title: string
  items: NodeItem[]
  accentColor: string
  defaultOpen?: boolean
  onDragStart: (e: React.DragEvent, item: NodeItem) => void
}

function NodeSection({ title, items, accentColor, defaultOpen = true, onDragStart }: NodeSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className={cn("text-xs font-semibold uppercase tracking-wide", accentColor)}>{title}</span>
        <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
          {items.length}
        </Badge>
      </button>
      {isOpen && (
        <div className="space-y-1 pl-2">
          {items.map((item, idx) => (
            <NodeItemComponent key={`${item.type}-${item.subType || idx}`} item={item} onDragStart={onDragStart} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============ Node Item Component ============

interface NodeItemComponentProps {
  item: NodeItem
  onDragStart: (e: React.DragEvent, item: NodeItem) => void
}

function NodeItemComponent({ item, onDragStart }: NodeItemComponentProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:shadow-sm group",
        item.bgColor,
        item.borderColor
      )}
    >
      <div className={cn("p-1.5 rounded-md", item.bgColor, item.textColor)}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{item.label}</span>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  )
}

// ============ Main Component ============

export interface NodePanelProps {
  onDragStart: (e: React.DragEvent, item: NodeItem) => void
}

export function NodePanel({ onDragStart }: NodePanelProps) {
  const [search, setSearch] = React.useState("")

  const allNodes = [...triggerNodes, ...conditionNodes, ...actionNodes, ...controlNodes, ...aiNodes]
  const filtered = search.trim()
    ? allNodes.filter(
        (n) =>
          n.label.toLowerCase().includes(search.toLowerCase()) ||
          n.description?.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <div className="w-64 border-r bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold text-sidebar-foreground flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-blue-500" />
          节点库
        </h3>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索节点..."
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <Separator />

      {/* Node Sections */}
      <ScrollArea className="flex-1 px-3 py-3">
        {filtered ? (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground mb-2 px-2">找到 {filtered.length} 个节点</p>
            {filtered.map((item, idx) => (
              <NodeItemComponent key={`filtered-${idx}`} item={item} onDragStart={onDragStart} />
            ))}
          </div>
        ) : (
          <>
            <NodeSection title="触发器" items={triggerNodes} accentColor="text-blue-600" onDragStart={onDragStart} />
            <Separator className="my-2" />
            <NodeSection title="条件" items={conditionNodes} accentColor="text-amber-600" onDragStart={onDragStart} />
            <Separator className="my-2" />
            <NodeSection title="动作" items={actionNodes} accentColor="text-emerald-600" onDragStart={onDragStart} />
            <Separator className="my-2" />
            <NodeSection title="控制" items={controlNodes} accentColor="text-purple-600" onDragStart={onDragStart} />
            <Separator className="my-2" />
            <NodeSection title="AI 功能" items={aiNodes} accentColor="text-indigo-600" defaultOpen={false} onDragStart={onDragStart} />
          </>
        )}
      </ScrollArea>

      {/* Footer Tip */}
      <div className="px-4 py-3 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 拖拽节点到画布，然后连接节点创建工作流
        </p>
      </div>
    </div>
  )
}

export type { NodeItem }
export { triggerNodes, conditionNodes, actionNodes, controlNodes, aiNodes }
