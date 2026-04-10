/**
 * 工作流引擎类型定义
 * Workflow Engine Type Definitions
 * 
 * 使用枚举定义，提供更强的类型安全性和 IDE 自动补全支持
 */

// ============================================
// 工作流状态
// ============================================
export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// ============================================
// 触发类型
// ============================================
export enum TriggerType {
  MANUAL = 'manual',           // 手动触发
  SCHEDULE = 'schedule',       // 定时触发
  EVENT = 'event',             // 事件触发
  CONDITION = 'condition'      // 条件触发
}

// ============================================
// 事件类型
// ============================================
export enum WorkflowEventType {
  RECORD_CREATED = 'record_created',
  RECORD_UPDATED = 'record_updated',
  RECORD_DELETED = 'record_deleted',
  FIELD_CHANGED = 'field_changed',
  DATE_OCCURRED = 'date_occurred',
  FORM_SUBMITTED = 'form_submitted'
}

// ============================================
// 操作类型
// ============================================
export enum ActionType {
  CREATE_TASK = 'create_task',           // 创建任务
  SEND_EMAIL = 'send_email',             // 发送邮件
  UPDATE_FIELD = 'update_field',         // 更新字段
  CREATE_RECORD = 'create_record',       // 创建记录
  DELETE_RECORD = 'delete_record',       // 删除记录
  WEBHOOK = 'webhook',                   // 触发Webhook
  ASSIGN_OWNER = 'assign_owner',        // 分配负责人
  ADD_TAG = 'add_tag',                   // 添加标签
  NOTIFICATION = 'notification'          // 发送通知
}

// ============================================
// 条件运算符
// ============================================
export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IN = 'in',
  NOT_IN = 'not_in'
}

// ============================================
// 逻辑运算符
// ============================================
export enum LogicalOperator {
  AND = 'and',
  OR = 'or'
}

// ============================================
// 条件配置
// ============================================
export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

// ============================================
// 条件组
// ============================================
export interface ConditionGroup {
  logic: LogicalOperator;
  conditions: (Condition | ConditionGroup)[];
}

// ============================================
// 时间触发配置
// ============================================
export interface ScheduleConfig {
  type: 'once' | 'recurring';
  startDate?: string;
  endDate?: string;
  cronExpression?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  timeOfDay?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

// ============================================
// 触发器配置
// ============================================
export interface TriggerConfig {
  type: TriggerType;
  event?: WorkflowEventType;
  objectType?: string;
  schedule?: ScheduleConfig;
  conditions?: ConditionGroup;
  fieldName?: string;
}

// ============================================
// 动作配置基础接口
// ============================================
export interface BaseActionConfig {
  actionType: ActionType;
  delay?: number;  // 延迟执行（秒）
  conditions?: ConditionGroup;
}

// ============================================
// 创建任务动作
// ============================================
export interface CreateTaskAction extends BaseActionConfig {
  actionType: ActionType.CREATE_TASK;
  taskTitle: string;
  taskDescription?: string;
  assignedTo?: string;
  dueDateOffset?: number;
  priority?: 'high' | 'normal' | 'low';
}

// ============================================
// 发送邮件动作
// ============================================
export interface SendEmailAction extends BaseActionConfig {
  actionType: ActionType.SEND_EMAIL;
  templateId?: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
}

// ============================================
// 更新字段动作
// ============================================
export interface UpdateFieldAction extends BaseActionConfig {
  actionType: ActionType.UPDATE_FIELD;
  objectType: string;
  fieldName: string;
  fieldValue: any;
}

// ============================================
// Webhook动作
// ============================================
export interface WebhookAction extends BaseActionConfig {
  actionType: ActionType.WEBHOOK;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

// ============================================
// 通知动作
// ============================================
export interface NotificationAction extends BaseActionConfig {
  actionType: ActionType.NOTIFICATION;
  notificationType: 'in_app' | 'email' | 'sms';
  title: string;
  message: string;
  recipientIds?: string[];
}

// ============================================
// 联合动作类型
// ============================================
export type WorkflowAction = 
  | CreateTaskAction 
  | SendEmailAction 
  | UpdateFieldAction 
  | WebhookAction 
  | NotificationAction;

// ============================================
// 工作流步骤
// ============================================
export interface WorkflowStep {
  id: string;
  name: string;
  trigger: TriggerConfig;
  conditions?: ConditionGroup;
  actions: WorkflowAction[];
  order: number;
}

// ============================================
// 工作流定义
// ============================================
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  objectType: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// ============================================
// 工作流执行记录
// ============================================
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  triggerType: TriggerType;
  triggeredBy?: string;
  recordId?: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  error?: string;
  stepResults?: WorkflowStepResult[];
}

// ============================================
// 步骤执行结果
// ============================================
export interface WorkflowStepResult {
  stepId: string;
  status: 'success' | 'skipped' | 'failed';
  actionResults?: ActionResult[];
  error?: string;
}

// ============================================
// 动作执行结果
// ============================================
export interface ActionResult {
  actionType: ActionType;
  status: 'success' | 'failed';
  output?: any;
  error?: string;
}

// ============================================
// 执行日志
// ============================================
export interface ExecutionLog {
  id: string;
  executionId: string;
  stepId: string;
  actionType: ActionType;
  timestamp: string;
  details: string;
}
