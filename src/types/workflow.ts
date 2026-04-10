/**
 * 工作流类型定义
 * Workflow Type Definitions
 */

// ============ 触发器类型 ============

/**
 * 触发器类型
 */
export type TriggerType =
  | 'record_created' // 记录创建时
  | 'record_updated' // 记录更新时
  | 'field_changed' // 特定字段变更时
  | 'stage_changed' // 阶段变更时
  | 'scheduled' // 定时执行
  | 'no_activity' // 超过X天无活动
  | 'date_reached' // 到达指定日期
  | 'manual' // 手动触发

/**
 * 触发器配置
 */
export interface TriggerConfig {
  type: TriggerType
  // 对象触发配置
  objectId?: string
  // 字段变更配置
  fieldId?: string
  oldValue?: unknown
  newValue?: unknown
  // 阶段变更配置
  fromStage?: string
  toStage?: string
  // 定时配置
  cronExpression?: string
  timezone?: string
  // 活动超时配置
  inactivityDays?: number
  activityTypes?: string[]
  // 日期触发配置
  dateField?: string
  offsetDays?: number
  offsetDirection?: 'before' | 'after' | 'on'
  executeTime?: string
  // 筛选条件
  filters?: WorkflowCondition[]
}

// ============ 条件类型 ============

/**
 * 条件运算符
 */
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'greater_than_or_equals'
  | 'less_than'
  | 'less_than_or_equals'
  | 'is_empty'
  | 'is_not_empty'
  | 'is_before'
  | 'is_after'
  | 'is_within_last'
  | 'is_not_within_last'

/**
 * 工作流条件
 */
export interface WorkflowCondition {
  id: string
  field: string
  operator: ConditionOperator
  value: unknown
  logic?: 'AND' | 'OR'
}

/**
 * 条件组
 */
export interface ConditionGroup {
  id: string
  logic: 'AND' | 'OR'
  conditions: (WorkflowCondition | ConditionGroup)[]
}

/**
 * 条件配置
 */
export interface ConditionConfig {
  type: 'simple' | 'group'
  // 简单条件
  condition?: WorkflowCondition
  // 条件组
  group?: ConditionGroup
  // 分支标签
  trueLabel?: string
  falseLabel?: string
}

// ============ 动作类型 ============

/**
 * 动作类型
 */
export type ActionType =
  | 'update_field' // 更新字段值
  | 'send_notification' // 发送站内通知
  | 'send_email' // 发送邮件
  | 'create_record' // 创建关联记录
  | 'assign_owner' // 分配负责人
  | 'advance_stage' // 推进阶段
  | 'create_task' // 创建任务
  | 'call_webhook' // 调用 Webhook
  | 'delay' // 延迟等待
  | 'ai_generate' // AI 生成内容
  | 'go_to_workflow' // 跳转到其他工作流
  | 'end_workflow' // 终止工作流

/**
 * 更新字段动作配置
 */
export interface UpdateFieldConfig {
  type: 'update_field'
  targetObjectId?: string // 目标对象ID，支持跨对象操作
  fieldId: string
  updateType: 'set' | 'clear' | 'append' | 'remove' | 'increment' | 'decrement'
  value?: unknown
}

/**
 * 发送通知配置
 */
export interface SendNotificationConfig {
  type: 'send_notification'
  title: string
  content: string
  recipients: {
    type: 'owner' | 'user' | 'role' | 'field'
    value: string
  }[]
  priority: 'normal' | 'high' | 'urgent'
  link?: string
}

/**
 * 发送邮件配置
 */
export interface SendEmailConfig {
  type: 'send_email'
  templateId?: string
  subject: string
  body: string
  recipients: {
    type: 'contact' | 'owner' | 'email' | 'field'
    value: string
  }[]
  sendTime: 'immediate' | 'delayed' | 'scheduled'
  delayMinutes?: number
  scheduledTime?: string
  preventDuplicate?: boolean
}

/**
 * 创建记录配置
 */
export interface CreateRecordConfig {
  type: 'create_record'
  targetObject: string
  fieldMappings: {
    sourceField: string
    targetField: string
  }[]
  createRelation?: boolean
  relationType?: string
}

/**
 * 分配负责人配置
 */
export interface AssignOwnerConfig {
  type: 'assign_owner'
  assignType: 'specific' | 'round_robin' | 'load_balance' | 'rule'
  userId?: string
  userPool?: string[]
  rules?: {
    field: string
    operator: string
    value: string
    assignTo: string
  }[]
}

/**
 * 推进阶段配置
 */
export interface AdvanceStageConfig {
  type: 'advance_stage'
  direction: 'next' | 'previous' | 'specific'
  targetStage?: string
  reason?: string
}

/**
 * 创建任务配置
 */
export interface CreateTaskConfig {
  type: 'create_task'
  title: string
  description?: string
  assignee: {
    type: 'owner' | 'user' | 'field'
    value: string
  }
  dueDate: {
    type: 'immediate' | 'delayed' | 'field'
    delayDays?: number
    field?: string
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reminder?: {
    type: 'minutes' | 'hours' | 'days'
    value: number
  }
}

/**
 * 调用 Webhook 配置
 */
export interface CallWebhookConfig {
  type: 'call_webhook'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  headers?: Record<string, string>
  body?: string
  authType?: 'none' | 'basic' | 'bearer' | 'api_key'
  authValue?: string
  retryCount?: number
  timeout?: number
}

/**
 * 延迟配置
 */
export interface DelayConfig {
  type: 'delay'
  delayType: 'minutes' | 'hours' | 'days' | 'until_date' | 'until_time'
  value?: number
  dateField?: string
  timeRange?: {
    start: string
    end: string
  }
  skipWeekends?: boolean
}

/**
 * AI 生成配置
 */
export interface AIGenerateConfig {
  type: 'ai_generate'
  generateType: 'email' | 'summary' | 'tags' | 'score' | 'recommendation'
  targetField?: string
  prompt?: string
  style?: 'formal' | 'friendly' | 'urgent'
  maxLength?: number
}

/**
 * 动作配置联合类型
 */
export type ActionConfig =
  | UpdateFieldConfig
  | SendNotificationConfig
  | SendEmailConfig
  | CreateRecordConfig
  | AssignOwnerConfig
  | AdvanceStageConfig
  | CreateTaskConfig
  | CallWebhookConfig
  | DelayConfig
  | AIGenerateConfig
  | { type: 'go_to_workflow'; workflowId: string }
  | { type: 'end_workflow'; reason?: string }

// ============ 节点类型 ============

/**
 * 节点类型
 */
export type NodeType = 'trigger' | 'condition' | 'action' | 'delay'

/**
 * 节点位置
 */
export interface NodePosition {
  x: number
  y: number
}

/**
 * 工作流节点
 */
export interface WorkflowNode {
  id: string
  type: NodeType
  name: string
  description?: string
  position: NodePosition
  config: TriggerConfig | ConditionConfig | ActionConfig | DelayConfig
  // 分支信息（仅条件节点）
  branches?: {
    true: string // true 分支连接的节点 ID
    false: string // false 分支连接的节点 ID
  }
}

/**
 * 工作流连线
 */
export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  type?: 'default' | 'true' | 'false'
}

// ============ 工作流主体 ============

/**
 * 工作流状态
 */
export type WorkflowStatus = 'active' | 'inactive' | 'draft'

/**
 * 工作流版本
 */
export interface WorkflowVersion {
  id: string
  version: number
  publishedAt: string
  publishedBy: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  changeLog?: string
}

/**
 * 工作流执行（兼容旧代码）
 * @deprecated 使用 WorkflowExecutionLog 代替
 */
export type WorkflowExecution = WorkflowExecutionLog

/**
 * 工作流统计（兼容旧代码）
 * @deprecated 使用 WorkflowStats 代替
 */
export interface WorkflowStats {
  total: number
  active: number
  inactive: number
  draft: number
  totalExecutions: number
  successExecutions: number
  failedExecutions: number
  avgDuration: number
}

/**
 * 执行统计（兼容旧代码）
 * @deprecated 使用 WorkflowStats 代替
 */
export type ExecutionStats = WorkflowStats

/**
 * 工作流执行日志
 */
export interface WorkflowExecutionLog {
  id: string
  workflowId: string
  status: 'success' | 'failed' | 'running' | 'pending'
  triggeredAt: string
  completedAt?: string
  triggeredBy: string
  triggerType: TriggerType
  recordId: string
  recordName?: string
  duration?: number // 毫秒
  error?: string
  nodeExecutions: NodeExecutionLog[]
}

/**
 * 节点执行日志
 */
export interface NodeExecutionLog {
  nodeId: string
  nodeName: string
  nodeType: NodeType
  status: 'success' | 'failed' | 'skipped'
  startedAt: string
  completedAt?: string
  duration?: number
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
}

/**
 * 工作流
 */
export interface Workflow {
  id: string
  objectId: string // 所属对象
  name: string
  description: string
  status: WorkflowStatus
  trigger: TriggerConfig
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
  createdBy: string
  lastRunAt?: string
  runCount: number
  successCount: number
  failedCount: number
  versions?: WorkflowVersion[]
  currentVersion?: number
}

/**
 * 工作流模板
 */
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  objectId: string
  objectName: string
  icon: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  trigger: TriggerConfig
  isBuiltIn: boolean
}

/**
 * 工作流列表参数
 */
export interface WorkflowListParams {
  objectId?: string
  status?: WorkflowStatus
  search?: string
}

/**
 * 执行日志列表参数
 */
export interface ExecutionLogListParams {
  workflowId?: string
  status?: 'success' | 'failed' | 'running' | 'pending'
  page?: number
  pageSize?: number
}