/**
 * 工作流 Mock 数据
 * 包含 8 种触发器类型的示例工作流
 * 
 * 触发器类型:
 * 1. time - 定时触发
 * 2. event - 事件触发
 * 3. condition - 条件触发
 * 4. manual - 手动触发
 * 5. webhook - Webhook 触发
 * 6. api - API 触发
 * 7. schedule - 计划任务触发
 * 8. status - 状态变更触发
 */

import type { WorkflowStatus } from '@/types/workflow-engine'
import type { WorkflowStatus as OldWorkflowStatus } from '@/types/workflow'

// ============ 统一类型定义 ============

export type TriggerType = 
  | 'time'      // 定时触发
  | 'event'     // 事件触发
  | 'condition' // 条件触发
  | 'manual'    // 手动触发
  | 'webhook'   // Webhook 触发
  | 'api'       // API 触发
  | 'schedule'  // 计划任务触发
  | 'status'    // 状态变更触发

export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

// ============ 工作流节点定义 ============

export interface WorkflowNode {
  id: string
  type: 'start' | 'end' | 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'approval'
  name: string
  description?: string
  config?: Record<string, unknown>
}

export interface WorkflowEdge {
  from: string
  to: string
  label?: string
}

// ============ 工作流执行记录 ============

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: ExecutionStatus
  startedAt: string
  completedAt?: string
  duration?: number
  trigger: {
    type: TriggerType
    source?: string
  }
  nodes: {
    nodeId: string
    status: ExecutionStatus
    output?: Record<string, unknown>
    error?: string
    startTime: string
    endTime?: string
  }[]
  result?: Record<string, unknown>
  error?: string
}

// ============ 工作流主体 ============

export interface MockWorkflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus | OldWorkflowStatus
  triggerType: TriggerType
  objectType: string
  category: 'sales' | 'marketing' | 'support' | 'operation' | 'custom'
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
  createdBy: string
  executions: WorkflowExecution[]
  stats: {
    totalExecutions: number
    successCount: number
    failedCount: number
    avgDuration: string
    lastRun: string
  }
}

// ============ Mock 数据 - 8 种触发器类型 ============

export const mockWorkflows: MockWorkflow[] = [
  // ========== 1. 定时触发 (time) ==========
  {
    id: 'wf-time-001',
    name: '客户生日祝福',
    description: '客户生日当天自动发送祝福邮件和优惠信息',
    status: 'active',
    triggerType: 'time',
    objectType: 'customer',
    category: 'marketing',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '每日定时检查', config: { cron: '0 9 * * *' } },
      { id: 'n3', type: 'action', name: '查询生日客户', config: { actionType: 'query_customers' } },
      { id: 'n4', type: 'condition', name: '是否有生日客户' },
      { id: 'n5', type: 'action', name: '发送祝福邮件', config: { actionType: 'send_email', template: 'birthday' } },
      { id: 'n6', type: 'action', name: '创建优惠码', config: { actionType: 'create_coupon', discount: '10%' } },
      { id: 'n7', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '有' },
      { from: 'n4', to: 'n7', label: '无' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: '李四',
    executions: [
      {
        id: 'exec-time-001',
        workflowId: 'wf-time-001',
        status: 'success',
        startedAt: '2024-03-21T09:00:00Z',
        completedAt: '2024-03-21T09:00:05Z',
        duration: 5100,
        trigger: { type: 'time', source: 'cron:0 9 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:02Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-21T09:00:02Z', endTime: '2024-03-21T09:00:02Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-21T09:00:02Z', endTime: '2024-03-21T09:00:04Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-21T09:00:04Z', endTime: '2024-03-21T09:00:05Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-21T09:00:05Z', endTime: '2024-03-21T09:00:05Z' },
        ],
        result: { customersCount: 3, emailsSent: 3, couponsCreated: 3 },
      },
    ],
    stats: {
      totalExecutions: 89,
      successCount: 89,
      failedCount: 0,
      avgDuration: '5.2s',
      lastRun: '今天 09:00',
    },
  },

  // ========== 2. 事件触发 (event) ==========
  {
    id: 'wf-event-001',
    name: '新线索自动分配',
    description: '当新线索创建时，根据来源和评分自动分配给对应销售',
    status: 'active',
    triggerType: 'event',
    objectType: 'lead',
    category: 'sales',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '新线索创建', config: { event: 'lead.created' } },
      { id: 'n3', type: 'action', name: '获取线索信息', config: { actionType: 'get_record' } },
      { id: 'n4', type: 'condition', name: '评分判定', config: { field: 'score', operator: '>=', value: 80 } },
      { id: 'n5', type: 'action', name: '分配A级销售', config: { actionType: 'assign_owner', tier: 'A' } },
      { id: 'n6', type: 'action', name: '分配B级销售', config: { actionType: 'assign_owner', tier: 'B' } },
      { id: 'n7', type: 'action', name: '发送分配通知', config: { actionType: 'send_notification', channel: 'wechat' } },
      { id: 'n8', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '高评分' },
      { from: 'n4', to: 'n6', label: '低评分' },
      { from: 'n5', to: 'n7' },
      { from: 'n6', to: 'n7' },
      { from: 'n7', to: 'n8' },
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-event-001',
        workflowId: 'wf-event-001',
        status: 'success',
        startedAt: '2024-03-20T10:00:00Z',
        completedAt: '2024-03-20T10:00:03Z',
        duration: 3200,
        trigger: { type: 'event', source: 'lead.created' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T10:00:01Z', endTime: '2024-03-20T10:00:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T10:00:01Z', endTime: '2024-03-20T10:00:01Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T10:00:01Z', endTime: '2024-03-20T10:00:02Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-20T10:00:02Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:03Z' },
        ],
        result: { assignedTo: '李四', tier: 'A', notificationSent: true },
      },
      {
        id: 'exec-event-002',
        workflowId: 'wf-event-001',
        status: 'success',
        startedAt: '2024-03-20T14:30:00Z',
        completedAt: '2024-03-20T14:30:02Z',
        duration: 2100,
        trigger: { type: 'event', source: 'lead.created' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T14:30:00Z', endTime: '2024-03-20T14:30:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T14:30:00Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:02Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T14:30:02Z', endTime: '2024-03-20T14:30:02Z' },
        ],
        result: { assignedTo: '王五', tier: 'B', notificationSent: true },
      },
    ],
    stats: {
      totalExecutions: 1256,
      successCount: 1230,
      failedCount: 26,
      avgDuration: '2.8s',
      lastRun: '5分钟前',
    },
  },

  // ========== 3. 条件触发 (condition) ==========
  {
    id: 'wf-condition-001',
    name: '高价值商机自动升级',
    description: '当商机金额超过50万时自动升级并通知销售总监',
    status: 'active',
    triggerType: 'condition',
    objectType: 'opportunity',
    category: 'sales',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '商机更新', config: { event: 'opportunity.updated' } },
      { id: 'n3', type: 'condition', name: '金额>=50万?', config: { field: 'amount', operator: '>=', value: 500000 } },
      { id: 'n4', type: 'action', name: '标记高价值', config: { actionType: 'update_field', field: 'priority', value: 'high' } },
      { id: 'n5', type: 'approval', name: '总监审批', config: { approver: 'director', timeout: 48 } },
      { id: 'n6', type: 'action', name: '发送升级通知', config: { actionType: 'send_notification', channel: 'email' } },
      { id: 'n7', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: '是' },
      { from: 'n3', to: 'n7', label: '否' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6', label: '通过' },
      { from: 'n5', to: 'n7', label: '拒绝' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-condition-001',
        workflowId: 'wf-condition-001',
        status: 'success',
        startedAt: '2024-03-19T11:00:00Z',
        completedAt: '2024-03-19T15:30:00Z',
        duration: 16200000,
        trigger: { type: 'condition', source: 'opportunity.updated' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-19T11:00:00Z', endTime: '2024-03-19T11:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-19T11:00:00Z', endTime: '2024-03-19T11:00:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-19T11:00:01Z', endTime: '2024-03-19T11:00:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-19T11:00:01Z', endTime: '2024-03-19T11:00:02Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-19T11:00:02Z', endTime: '2024-03-19T15:00:00Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-19T15:00:00Z', endTime: '2024-03-19T15:30:00Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-19T15:30:00Z', endTime: '2024-03-19T15:30:00Z' },
        ],
        result: { priority: 'high', approvalResult: 'approved', notificationSent: true },
      },
    ],
    stats: {
      totalExecutions: 45,
      successCount: 42,
      failedCount: 3,
      avgDuration: '4.5h',
      lastRun: '2天前',
    },
  },

  // ========== 4. 手动触发 (manual) ==========
  {
    id: 'wf-manual-001',
    name: '批量发送营销邮件',
    description: '手动选择客户群组，批量发送营销邮件',
    status: 'active',
    triggerType: 'manual',
    objectType: 'customer',
    category: 'marketing',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '手动触发', config: { type: 'manual' } },
      { id: 'n3', type: 'action', name: '获取客户列表', config: { actionType: 'query_customers', filter: 'selected' } },
      { id: 'n4', type: 'condition', name: '客户数量>0?' },
      { id: 'n5', type: 'action', name: '逐个发送邮件', config: { actionType: 'send_email', batchSize: 100 } },
      { id: 'n6', type: 'delay', name: '间隔1秒', config: { delay: 1000 } },
      { id: 'n7', type: 'action', name: '生成发送报告', config: { actionType: 'generate_report' } },
      { id: 'n8', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '是' },
      { from: 'n4', to: 'n8', label: '否' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n5', label: '继续' },
      { from: 'n5', to: 'n7', label: '完成' },
      { from: 'n7', to: 'n8' },
    ],
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-03-18T09:00:00Z',
    createdBy: '市场部-小王',
    executions: [
      {
        id: 'exec-manual-001',
        workflowId: 'wf-manual-001',
        status: 'success',
        startedAt: '2024-03-20T14:00:00Z',
        completedAt: '2024-03-20T14:15:30Z',
        duration: 930000,
        trigger: { type: 'manual', source: 'user:张三' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T14:00:00Z', endTime: '2024-03-20T14:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T14:00:00Z', endTime: '2024-03-20T14:00:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T14:00:01Z', endTime: '2024-03-20T14:00:05Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T14:00:05Z', endTime: '2024-03-20T14:00:05Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T14:00:05Z', endTime: '2024-03-20T14:15:00Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-20T14:15:00Z', endTime: '2024-03-20T14:15:30Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T14:15:30Z', endTime: '2024-03-20T14:15:30Z' },
        ],
        result: { totalCustomers: 500, emailsSent: 498, emailsFailed: 2, duration: '15分30秒' },
      },
    ],
    stats: {
      totalExecutions: 12,
      successCount: 11,
      failedCount: 1,
      avgDuration: '15分钟',
      lastRun: '3天前',
    },
  },

  // ========== 5. Webhook 触发 (webhook) ==========
  {
    id: 'wf-webhook-001',
    name: 'ERP数据同步',
    description: '当CRM客户信息变更时同步到ERP系统',
    status: 'active',
    triggerType: 'webhook',
    objectType: 'customer',
    category: 'operation',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '接收Webhook', config: { type: 'webhook', endpoint: '/webhook/crm-sync' } },
      { id: 'n3', type: 'action', name: '验证签名', config: { actionType: 'verify_signature' } },
      { id: 'n4', type: 'condition', name: '验证通过?' },
      { id: 'n5', type: 'action', name: '转换数据格式', config: { actionType: 'transform_data', format: 'erp' } },
      { id: 'n6', type: 'webhook', name: '推送到ERP', config: { url: 'https://erp.example.com/api/sync', method: 'POST' } },
      { id: 'n7', type: 'condition', name: '同步成功?' },
      { id: 'n8', type: 'action', name: '记录成功日志', config: { actionType: 'log_success' } },
      { id: 'n9', type: 'action', name: '记录失败日志', config: { actionType: 'log_error' } },
      { id: 'n10', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '是' },
      { from: 'n4', to: 'n10', label: '否' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
      { from: 'n7', to: 'n8', label: '成功' },
      { from: 'n7', to: 'n9', label: '失败' },
      { from: 'n8', to: 'n10' },
      { from: 'n9', to: 'n10' },
    ],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    createdBy: '技术部',
    executions: [
      {
        id: 'exec-webhook-001',
        workflowId: 'wf-webhook-001',
        status: 'success',
        startedAt: '2024-03-22T08:30:00Z',
        completedAt: '2024-03-22T08:30:02Z',
        duration: 2100,
        trigger: { type: 'webhook', source: 'crm.customer.updated' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:01Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-22T08:30:01Z', endTime: '2024-03-22T08:30:02Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-22T08:30:02Z', endTime: '2024-03-22T08:30:02Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-22T08:30:02Z', endTime: '2024-03-22T08:30:02Z' },
          { nodeId: 'n10', status: 'success', startTime: '2024-03-22T08:30:02Z', endTime: '2024-03-22T08:30:02Z' },
        ],
        result: { erpResponse: { code: 200, message: '同步成功' }, recordsSynced: 1 },
      },
    ],
    stats: {
      totalExecutions: 156,
      successCount: 152,
      failedCount: 4,
      avgDuration: '1.8s',
      lastRun: '10分钟前',
    },
  },

  // ========== 6. API 触发 (api) ==========
  {
    id: 'wf-api-001',
    name: '外部系统商机录入',
    description: '接收来自ERP系统的商机数据，自动创建商机记录',
    status: 'active',
    triggerType: 'api',
    objectType: 'opportunity',
    category: 'sales',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: 'API调用触发', config: { type: 'api', endpoint: '/api/workflows/erp-opportunity', method: 'POST' } },
      { id: 'n3', type: 'action', name: '验证API密钥', config: { actionType: 'verify_api_key' } },
      { id: 'n4', type: 'condition', name: '验证通过?' },
      { id: 'n5', type: 'action', name: '数据映射', config: { actionType: 'map_fields', mapping: 'erp_to_crm' } },
      { id: 'n6', type: 'action', name: '创建商机', config: { actionType: 'create_record', object: 'opportunity' } },
      { id: 'n7', type: 'action', name: '关联客户', config: { actionType: 'link_customer' } },
      { id: 'n8', type: 'action', name: '返回成功响应', config: { actionType: 'api_response', status: 201 } },
      { id: 'n9', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '是' },
      { from: 'n4', to: 'n8', label: '否' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
      { from: 'n7', to: 'n8' },
      { from: 'n8', to: 'n9' },
    ],
    createdAt: '2024-02-25T11:00:00Z',
    updatedAt: '2024-03-12T14:00:00Z',
    createdBy: '技术部-小李',
    executions: [
      {
        id: 'exec-api-001',
        workflowId: 'wf-api-001',
        status: 'success',
        startedAt: '2024-03-21T16:45:00Z',
        completedAt: '2024-03-21T16:45:02Z',
        duration: 2300,
        trigger: { type: 'api', source: 'erp_system' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T16:45:00Z', endTime: '2024-03-21T16:45:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T16:45:00Z', endTime: '2024-03-21T16:45:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-21T16:45:00Z', endTime: '2024-03-21T16:45:00Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-21T16:45:00Z', endTime: '2024-03-21T16:45:00Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-21T16:45:00Z', endTime: '2024-03-21T16:45:01Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-21T16:45:01Z', endTime: '2024-03-21T16:45:01Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-21T16:45:01Z', endTime: '2024-03-21T16:45:01Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-21T16:45:01Z', endTime: '2024-03-21T16:45:02Z' },
          { nodeId: 'n9', status: 'success', startTime: '2024-03-21T16:45:02Z', endTime: '2024-03-21T16:45:02Z' },
        ],
        result: { opportunityId: 'OPP-20240321-001', customerLinked: true, responseCode: 201 },
      },
    ],
    stats: {
      totalExecutions: 89,
      successCount: 87,
      failedCount: 2,
      avgDuration: '2.1s',
      lastRun: '1小时前',
    },
  },

  // ========== 7. 计划任务触发 (schedule) ==========
  {
    id: 'wf-schedule-001',
    name: '合同到期提醒',
    description: '合同到期前30/7/1天自动发送提醒通知给负责人',
    status: 'active',
    triggerType: 'schedule',
    objectType: 'contract',
    category: 'operation',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '每日10点检查', config: { type: 'schedule', cron: '0 10 * * *' } },
      { id: 'n3', type: 'action', name: '查询即将到期合同', config: { actionType: 'query_contracts', daysLeft: [30, 7, 1] } },
      { id: 'n4', type: 'condition', name: '剩余天数', config: { field: 'daysLeft' } },
      { id: 'n5', type: 'action', name: '30天提醒', config: { actionType: 'send_notification', template: 'reminder_30', channel: 'email' } },
      { id: 'n6', type: 'action', name: '7天提醒', config: { actionType: 'send_notification', template: 'reminder_7', channel: 'sms' } },
      { id: 'n7', type: 'action', name: '1天提醒', config: { actionType: 'send_notification', template: 'reminder_1', channel: 'wechat' } },
      { id: 'n8', type: 'action', name: '记录日志', config: { actionType: 'log_reminder' } },
      { id: 'n9', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '30天' },
      { from: 'n4', to: 'n6', label: '7天' },
      { from: 'n4', to: 'n7', label: '1天' },
      { from: 'n4', to: 'n9', label: '其他' },
      { from: 'n5', to: 'n8' },
      { from: 'n6', to: 'n8' },
      { from: 'n7', to: 'n8' },
      { from: 'n8', to: 'n9' },
    ],
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    createdBy: '赵六',
    executions: [
      {
        id: 'exec-schedule-001',
        workflowId: 'wf-schedule-001',
        status: 'success',
        startedAt: '2024-03-20T10:00:00Z',
        completedAt: '2024-03-20T10:00:08Z',
        duration: 8100,
        trigger: { type: 'schedule', source: 'cron:0 10 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:05Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T10:00:05Z', endTime: '2024-03-20T10:00:08Z' },
          { nodeId: 'n9', status: 'success', startTime: '2024-03-20T10:00:08Z', endTime: '2024-03-20T10:00:08Z' },
        ],
        result: { contractsFound: 5, reminders30: 2, reminders7: 1, reminders1: 0, totalReminders: 3 },
      },
    ],
    stats: {
      totalExecutions: 78,
      successCount: 78,
      failedCount: 0,
      avgDuration: '8.2s',
      lastRun: '今天 10:00',
    },
  },

  // ========== 8. 状态变更触发 (status) ==========
  {
    id: 'wf-status-001',
    name: '商机阶段变更通知',
    description: '当商机阶段变更时自动通知相关人员',
    status: 'active',
    triggerType: 'status',
    objectType: 'opportunity',
    category: 'sales',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '商机阶段变更', config: { type: 'status', event: 'stage_changed' } },
      { id: 'n3', type: 'action', name: '获取阶段信息', config: { actionType: 'get_stage_info' } },
      { id: 'n4', type: 'condition', name: '是否进入赢单阶段?', config: { field: 'newStage', operator: 'equals', value: 'won' } },
      { id: 'n5', type: 'condition', name: '是否进入输单阶段?', config: { field: 'newStage', operator: 'equals', value: 'lost' } },
      { id: 'n6', type: 'action', name: '发送赢单庆祝', config: { actionType: 'send_notification', template: 'win_celebration' } },
      { id: 'n7', type: 'action', name: '创建复盘任务', config: { actionType: 'create_task', title: '商机复盘' } },
      { id: 'n8', type: 'action', name: '发送输单通知', config: { actionType: 'send_notification', template: 'loss_notification' } },
      { id: 'n9', type: 'action', name: '发送常规通知', config: { actionType: 'send_notification', template: 'stage_update' } },
      { id: 'n10', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n6', label: '是' },
      { from: 'n4', to: 'n5', label: '否' },
      { from: 'n5', to: 'n8', label: '是' },
      { from: 'n5', to: 'n9', label: '否' },
      { from: 'n6', to: 'n10' },
      { from: 'n7', to: 'n10' },
      { from: 'n8', to: 'n10' },
      { from: 'n9', to: 'n10' },
    ],
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-status-001',
        workflowId: 'wf-status-001',
        status: 'success',
        startedAt: '2024-03-21T14:30:00Z',
        completedAt: '2024-03-21T14:30:03Z',
        duration: 3200,
        trigger: { type: 'status', source: 'opportunity.stage_changed' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T14:30:00Z', endTime: '2024-03-21T14:30:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T14:30:00Z', endTime: '2024-03-21T14:30:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-21T14:30:01Z', endTime: '2024-03-21T14:30:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-21T14:30:01Z', endTime: '2024-03-21T14:30:01Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-21T14:30:01Z', endTime: '2024-03-21T14:30:02Z' },
          { nodeId: 'n10', status: 'success', startTime: '2024-03-21T14:30:02Z', endTime: '2024-03-21T14:30:03Z' },
        ],
        result: { newStage: 'won', notificationSent: true, celebrationTriggered: true },
      },
      {
        id: 'exec-status-002',
        workflowId: 'wf-status-001',
        status: 'success',
        startedAt: '2024-03-20T11:15:00Z',
        completedAt: '2024-03-20T11:15:02Z',
        duration: 2100,
        trigger: { type: 'status', source: 'opportunity.stage_changed' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T11:15:00Z', endTime: '2024-03-20T11:15:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T11:15:00Z', endTime: '2024-03-20T11:15:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T11:15:00Z', endTime: '2024-03-20T11:15:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T11:15:01Z', endTime: '2024-03-20T11:15:01Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T11:15:01Z', endTime: '2024-03-20T11:15:01Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T11:15:01Z', endTime: '2024-03-20T11:15:01Z' },
          { nodeId: 'n10', status: 'success', startTime: '2024-03-20T11:15:01Z', endTime: '2024-03-20T11:15:02Z' },
        ],
        result: { newStage: 'lost', notificationSent: true },
      },
    ],
    stats: {
      totalExecutions: 234,
      successCount: 230,
      failedCount: 4,
      avgDuration: '2.5s',
      lastRun: '30分钟前',
    },
  },

  // ========== 额外: 草稿状态工作流 ==========
  {
    id: 'wf-draft-001',
    name: '新员工入职流程',
    description: '新员工入职时自动创建账户、分配权限、发送欢迎邮件',
    status: 'draft',
    triggerType: 'manual',
    objectType: 'user',
    category: 'custom',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '手动触发', config: { type: 'manual' } },
      { id: 'n3', type: 'action', name: '创建企业账号', config: { actionType: 'create_account' } },
      { id: 'n4', type: 'action', name: '开通飞书账号', config: { actionType: 'create_feishu_account' } },
      { id: 'n5', type: 'action', name: '分配CRM角色', config: { actionType: 'assign_role', defaultRole: 'sales' } },
      { id: 'n6', type: 'action', name: '发送欢迎邮件', config: { actionType: 'send_email', template: 'welcome' } },
      { id: 'n7', type: 'delay', name: '1天后', config: { delay: 86400000 } },
      { id: 'n8', type: 'action', name: '发送入职体验问卷', config: { actionType: 'send_survey' } },
      { id: 'n9', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
      { from: 'n7', to: 'n8' },
      { from: 'n8', to: 'n9' },
    ],
    createdAt: '2024-03-18T16:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
    createdBy: 'HR-小美',
    executions: [],
    stats: {
      totalExecutions: 0,
      successCount: 0,
      failedCount: 0,
      avgDuration: '-',
      lastRun: '-',
    },
  },

  // ========== 额外: 已暂停工作流 ==========
  {
    id: 'wf-paused-001',
    name: '跟进超时预警',
    description: '销售未在规定时间内跟进线索时发送预警',
    status: 'inactive',
    triggerType: 'schedule',
    objectType: 'lead',
    category: 'sales',
    nodes: [
      { id: 'n1', type: 'start', name: '开始' },
      { id: 'n2', type: 'trigger', name: '每2小时检查', config: { type: 'schedule', cron: '0 */2 * * *' } },
      { id: 'n3', type: 'action', name: '查询超时线索', config: { actionType: 'query_leads', inactivityDays: 7 } },
      { id: 'n4', type: 'condition', name: '有超时线索?' },
      { id: 'n5', type: 'approval', name: '主管确认', config: { approver: 'manager' } },
      { id: 'n6', type: 'action', name: '发送催办通知', config: { actionType: 'send_notification', channel: 'wechat' } },
      { id: 'n7', type: 'end', name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '是' },
      { from: 'n4', to: 'n7', label: '否' },
      { from: 'n5', to: 'n6', label: '通过' },
      { from: 'n5', to: 'n7', label: '拒绝' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-paused-001',
        workflowId: 'wf-paused-001',
        status: 'skipped',
        startedAt: '2024-03-21T14:00:00Z',
        completedAt: '2024-03-21T14:00:01Z',
        duration: 800,
        trigger: { type: 'schedule', source: 'cron:0 */2 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:00Z' },
          { nodeId: 'n3', status: 'skipped', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:01Z' },
        ],
        result: { skippedReason: '无超时线索' },
      },
    ],
    stats: {
      totalExecutions: 156,
      successCount: 120,
      failedCount: 12,
      avgDuration: '5.2s',
      lastRun: '5天前',
    },
  },
]

// ============ 辅助函数 ============

/**
 * 根据 ID 获取工作流
 */
export function getWorkflowById(id: string): MockWorkflow | undefined {
  return mockWorkflows.find((wf) => wf.id === id)
}

/**
 * 获取所有工作流
 */
export function getAllWorkflows(): MockWorkflow[] {
  return [...mockWorkflows]
}

/**
 * 根据触发器类型获取工作流
 */
export function getWorkflowsByTriggerType(triggerType: TriggerType): MockWorkflow[] {
  return mockWorkflows.filter((wf) => wf.triggerType === triggerType)
}

/**
 * 根据状态获取工作流
 */
export function getWorkflowsByStatus(status: WorkflowStatus | OldWorkflowStatus): MockWorkflow[] {
  return mockWorkflows.filter((wf) => wf.status === status)
}

/**
 * 获取活跃工作流
 */
export function getActiveWorkflows(): MockWorkflow[] {
  return mockWorkflows.filter((wf) => wf.status === 'active')
}

/**
 * 根据对象类型获取工作流
 */
export function getWorkflowsByObjectType(objectType: string): MockWorkflow[] {
  return mockWorkflows.filter((wf) => wf.objectType === objectType)
}

/**
 * 获取最近执行记录
 */
export function getRecentExecutions(limit = 10): WorkflowExecution[] {
  const allExecutions: (WorkflowExecution & { workflowName?: string })[] = []
  
  mockWorkflows.forEach((wf) => {
    wf.executions.forEach((exec) => {
      allExecutions.push({
        ...exec,
        workflowName: wf.name,
      })
    })
  })
  
  return allExecutions
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit)
}

/**
 * 获取工作流统计
 */
export function getWorkflowStats() {
  const total = mockWorkflows.length
  const active = mockWorkflows.filter((wf) => wf.status === 'active').length
  const inactive = mockWorkflows.filter((wf) => wf.status === 'inactive').length
  const draft = mockWorkflows.filter((wf) => wf.status === 'draft').length
  
  const totalExecutions = mockWorkflows.reduce((sum, wf) => sum + wf.stats.totalExecutions, 0)
  const totalSuccess = mockWorkflows.reduce((sum, wf) => sum + wf.stats.successCount, 0)
  const totalFailed = mockWorkflows.reduce((sum, wf) => sum + wf.stats.failedCount, 0)
  
  return {
    total,
    active,
    inactive,
    draft,
    totalExecutions,
    totalSuccess,
    totalFailed,
    successRate: totalExecutions > 0 ? Math.round((totalSuccess / totalExecutions) * 100) : 0,
  }
}

/**
 * 触发器类型配置
 */
export const triggerTypeConfig: Record<TriggerType, { label: string; icon: string; color: string }> = {
  time: { label: '定时触发', icon: '🕐', color: 'bg-blue-500' },
  event: { label: '事件触发', icon: '⚡', color: 'bg-yellow-500' },
  condition: { label: '条件触发', icon: '🔀', color: 'bg-purple-500' },
  manual: { label: '手动触发', icon: '👆', color: 'bg-green-500' },
  webhook: { label: 'Webhook触发', icon: '🔗', color: 'bg-orange-500' },
  api: { label: 'API触发', icon: '🔌', color: 'bg-cyan-500' },
  schedule: { label: '计划任务', icon: '📅', color: 'bg-pink-500' },
  status: { label: '状态变更', icon: '📊', color: 'bg-indigo-500' },
}

/**
 * 状态配置
 */
export const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: '运行中', className: 'bg-green-500' },
  inactive: { label: '已暂停', className: 'bg-gray-400' },
  draft: { label: '草稿', className: 'bg-yellow-500' },
  archived: { label: '已归档', className: 'bg-slate-400' },
}
