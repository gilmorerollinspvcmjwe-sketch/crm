/**
 * PropertyPanel - 右侧属性配置面板
 * 配置工作流元数据和节点属性
 */
"use client"

import React, { useState, useEffect } from "react"
import {
  X,
  Settings,
  Trash2,
  ChevronDown,
  Bot,
  Zap,
  GitBranch,
  Clock,
  Play,
} from "lucide-react"
import type { WorkflowNode } from "@/types/workflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ============ Constants ============

const triggerTypeOptions = [
  { value: "record_created", label: "记录创建时" },
  { value: "record_updated", label: "记录更新时" },
  { value: "field_changed", label: "特定字段变更时" },
  { value: "stage_changed", label: "阶段变更时" },
  { value: "scheduled", label: "定时执行" },
  { value: "no_activity", label: "超过X天无活动" },
  { value: "date_reached", label: "到达指定日期" },
  { value: "manual", label: "手动触发" },
]

const actionTypeOptions = [
  { value: "update_field", label: "更新字段值" },
  { value: "send_notification", label: "发送站内通知" },
  { value: "send_email", label: "发送邮件" },
  { value: "create_record", label: "创建关联记录" },
  { value: "assign_owner", label: "分配负责人" },
  { value: "advance_stage", label: "推进阶段" },
  { value: "create_task", label: "创建任务" },
  { value: "call_webhook", label: "调用 Webhook" },
  { value: "delay", label: "延迟等待" },
  { value: "ai_generate", label: "AI 生成内容" },
  { value: "end_workflow", label: "终止工作流" },
]

const delayTypeOptions = [
  { value: "minutes", label: "分钟" },
  { value: "hours", label: "小时" },
  { value: "days", label: "天" },
]

const conditionOperatorOptions = [
  { value: "equals", label: "等于" },
  { value: "not_equals", label: "不等于" },
  { value: "contains", label: "包含" },
  { value: "not_contains", label: "不包含" },
  { value: "greater_than", label: "大于" },
  { value: "less_than", label: "小于" },
  { value: "is_empty", label: "为空" },
  { value: "is_not_empty", label: "不为空" },
]

const priorityOptions = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
  { value: "urgent", label: "紧急" },
]

const nodeTypeConfig: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
  trigger: { label: "触发器", icon: <Zap className="h-3 w-3" />, badgeClass: "bg-blue-100 text-blue-700 border-blue-200" },
  condition: { label: "条件", icon: <GitBranch className="h-3 w-3" />, badgeClass: "bg-amber-100 text-amber-700 border-amber-200" },
  action: { label: "动作", icon: <Play className="h-3 w-3" />, badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  delay: { label: "延迟", icon: <Clock className="h-3 w-3" />, badgeClass: "bg-purple-100 text-purple-700 border-purple-200" },
}

// ============ Props ============

export interface PropertyPanelProps {
  /** 选中的节点 */
  node: WorkflowNode | null
  /** 工作流名称 */
  workflowName: string
  /** 工作流描述 */
  workflowDescription: string
  /** 选中的对象 */
  selectedObject: string
  /** 可用对象列表 */
  objects: { id: string; name: string; pluralName?: string }[]
  /** 更新节点回调 */
  onUpdateNode: (node: WorkflowNode) => void
  /** 更新工作流元数据回调 */
  onUpdateWorkflowMeta: (name: string, description: string, objectId: string) => void
  /** 关闭面板回调 */
  onClose: () => void
  /** 删除节点回调 */
  onDeleteNode?: (nodeId: string) => void
}

// ============ Main Component ============

export function PropertyPanel({
  node,
  workflowName,
  workflowDescription,
  selectedObject,
  objects,
  onUpdateNode,
  onUpdateWorkflowMeta,
  onClose,
  onDeleteNode,
}: PropertyPanelProps) {
  // Node state
  const [nodeName, setNodeName] = useState("")
  const [nodeDescription, setNodeDescription] = useState("")
  const [triggerType, setTriggerType] = useState("record_created")
  const [actionType, setActionType] = useState("send_notification")
  const [delayType, setDelayType] = useState("days")
  const [delayValue, setDelayValue] = useState("1")
  const [conditionField, setConditionField] = useState("")
  const [conditionOperator, setConditionOperator] = useState("equals")
  const [conditionValue, setConditionValue] = useState("")
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationBody, setNotificationBody] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskPriority, setTaskPriority] = useState("medium")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  // Workflow meta state
  const [wfName, setWfName] = useState(workflowName)
  const [wfDescription, setWfDescription] = useState(workflowDescription)
  const [wfObjectId, setWfObjectId] = useState(selectedObject)

  // Sync node state
  useEffect(() => {
    if (node) {
      setNodeName(node.name)
      setNodeDescription(node.description || "")
      const config = (node.config || {}) as Record<string, unknown>
      if (node.type === "trigger") {
        setTriggerType((config.type as string) || "record_created")
      } else if (node.type === "action") {
        setActionType((config.type as string) || "send_notification")
        setNotificationTitle((config.title as string) || "")
        setNotificationBody((config.body as string) || "")
        setTaskTitle((config.taskTitle as string) || "")
        setTaskPriority((config.priority as string) || "medium")
        setEmailSubject((config.emailSubject as string) || "")
        setEmailBody((config.emailBody as string) || "")
      } else if (node.type === "delay") {
        setDelayType((config.delayType as string) || "days")
        setDelayValue(String(config.value ?? "1"))
      } else if (node.type === "condition") {
        const cond = (config.condition as Record<string, unknown>) || {}
        setConditionField((cond.field as string) || "")
        setConditionOperator((cond.operator as string) || "equals")
        setConditionValue(String(cond.value ?? ""))
      }
    }
  }, [node])

  // Sync workflow state
  useEffect(() => {
    setWfName(workflowName)
    setWfDescription(workflowDescription)
    setWfObjectId(selectedObject)
  }, [workflowName, workflowDescription, selectedObject])

  const handleSaveNode = () => {
    if (!node) return
    let config: any = {}

    if (node.type === "trigger") {
      config = { ...config, type: triggerType }
    } else if (node.type === "action") {
      config = { ...config, type: actionType }
      if (actionType === "send_notification" || actionType === "send_email") {
        config = { ...config, title: notificationTitle, body: notificationBody }
      }
      if (actionType === "create_task") {
        config = { ...config, taskTitle, priority: taskPriority }
      }
      if (actionType === "send_email") {
        config = { ...config, emailSubject, emailBody }
      }
    } else if (node.type === "delay") {
      config = { ...config, delayType, value: parseInt(delayValue) || 1 }
    } else if (node.type === "condition") {
      config = {
        ...config,
        condition: {
          id: "cond_1",
          field: conditionField,
          operator: conditionOperator,
          value: conditionValue,
        },
      }
    }

    onUpdateNode({ ...node, name: nodeName, description: nodeDescription, config } as WorkflowNode)
  }

  const handleSaveWorkflow = () => {
    onUpdateWorkflowMeta(wfName, wfDescription, wfObjectId)
  }

  const cfg = node ? nodeTypeConfig[node.type] : null

  return (
    <div className="w-72 border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Settings className="h-4 w-4 text-muted-foreground" />
          {node ? "节点属性" : "工作流属性"}
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {!node ? (
            // Workflow properties
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  工作流名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  placeholder="输入工作流名称"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">描述</Label>
                <Input
                  value={wfDescription}
                  onChange={(e) => setWfDescription(e.target.value)}
                  placeholder="输入描述"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  触发对象 <span className="text-red-500">*</span>
                </Label>
                <Select value={wfObjectId} onValueChange={setWfObjectId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="选择对象" />
                  </SelectTrigger>
                  <SelectContent>
                    {objects.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id}>
                        {obj.pluralName || obj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">基本信息</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">创建者</p>
                    <p className="font-medium">当前用户</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">状态</p>
                    <Badge variant="secondary">草稿</Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Node properties
            <div className="space-y-4">
              {/* Node type badge */}
              <div className="flex items-center gap-2">
                {cfg && (
                  <Badge className={cn("gap-1", cfg.badgeClass)}>
                    {cfg.icon}
                    {cfg.label}
                  </Badge>
                )}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  节点名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="输入节点名称"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">描述</Label>
                <Input
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                  placeholder="输入描述"
                />
              </div>

              {/* Trigger config */}
              {node.type === "trigger" && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground">触发器配置</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">触发类型</Label>
                    <Select value={triggerType} onValueChange={setTriggerType}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {triggerType === "scheduled" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">执行时间 (Cron)</Label>
                      <Input placeholder="0 9 * * * (每天 9:00)" />
                    </div>
                  )}

                  {triggerType === "no_activity" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">无活动天数</Label>
                      <Input type="number" value="60" placeholder="输入天数" />
                    </div>
                  )}
                </div>
              )}

              {/* Condition config */}
              {node.type === "condition" && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground">条件配置</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">字段</Label>
                    <Input
                      value={conditionField}
                      onChange={(e) => setConditionField(e.target.value)}
                      placeholder="输入字段名或选择"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">运算符</Label>
                    <Select value={conditionOperator} onValueChange={setConditionOperator}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOperatorOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {conditionOperator !== "is_empty" && conditionOperator !== "is_not_empty" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">值</Label>
                      <Input
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        placeholder="输入比较值"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action config */}
              {node.type === "action" && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground">动作配置</p>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">动作类型</Label>
                    <Select value={actionType} onValueChange={setActionType}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(actionType === "send_notification" || actionType === "send_email") && (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">标题</Label>
                        <Input
                          value={notificationTitle}
                          onChange={(e) => setNotificationTitle(e.target.value)}
                          placeholder="输入通知标题"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">内容</Label>
                        <Textarea
                          value={notificationBody}
                          onChange={(e) => setNotificationBody(e.target.value)}
                          placeholder="输入通知内容"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {actionType === "create_task" && (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">任务标题</Label>
                        <Input
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="输入任务标题"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">优先级</Label>
                        <Select value={taskPriority} onValueChange={setTaskPriority}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Delay config */}
              {node.type === "delay" && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground">延迟配置</p>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs font-medium">时长</Label>
                      <Input
                        type="number"
                        value={delayValue}
                        onChange={(e) => setDelayValue(e.target.value)}
                        min={1}
                      />
                    </div>
                    <div className="w-24 space-y-1.5">
                      <Label className="text-xs font-medium">单位</Label>
                      <Select value={delayType} onValueChange={setDelayType}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {delayTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t bg-muted/30 flex gap-2">
        {node && onDeleteNode && (
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onDeleteNode(node.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1"
          onClick={node ? handleSaveNode : handleSaveWorkflow}
        >
          保存
        </Button>
      </div>
    </div>
  )
}
