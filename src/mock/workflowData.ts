/**
 * 工作流 Mock 数据
 * 包含 5-8 个示例工作流及执行记录
 */

// ============ 枚举定义 ============

export enum WorkflowNodeType {
  START = 'start',
  END = 'end',
  TASK = 'task',
  CONDITION = 'condition',
  APPROVAL = 'approval',
  WEBHOOK = 'webhook',
  DELAY = 'delay',
  SCHEDULE = 'schedule',
}

export enum TriggerType {
  MANUAL = 'manual',
  SCHEDULE = 'schedule',
  EVENT = 'event',
  WEBHOOK = 'webhook',
}

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

// ============ 接口定义 ============

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // ms
  nodes: {
    nodeId: string;
    status: ExecutionStatus;
    output?: Record<string, unknown>;
    error?: string;
    startTime: string;
    endTime?: string;
  }[];
  trigger?: {
    type: TriggerType;
    source?: string;
  };
  result?: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'support' | 'operation' | 'custom';
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: { from: string; to: string; label?: string }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  executions: WorkflowExecution[];
}

// ============ 工作流定义 ============

export const workflows: Workflow[] = [
  // 工作流 1: 线索自动分配
  {
    id: 'wf-lead-assign-001',
    name: '线索自动分配',
    description: '当 CRM 新增线索时，根据来源和评分自动分配给对应销售',
    category: 'sales',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.TASK, name: '获取线索信息', config: { source: 'form' } },
      { id: 'n3', type: WorkflowNodeType.CONDITION, name: '评分判定', config: { field: 'score', operator: '>=', value: 80 } },
      { id: 'n4', type: WorkflowNodeType.TASK, name: '分配 A 级销售', config: { tier: 'A' } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '分配 B 级销售', config: { tier: 'B' } },
      { id: 'n6', type: WorkflowNodeType.TASK, name: '发送分配通知', config: { channel: 'wechat' } },
      { id: 'n7', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: '高评分' },
      { from: 'n3', to: 'n5', label: '低评分' },
      { from: 'n4', to: 'n6' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-001',
        workflowId: 'wf-lead-assign-001',
        status: 'success',
        startedAt: '2024-03-20T10:00:00Z',
        completedAt: '2024-03-20T10:00:03Z',
        duration: 3200,
        trigger: { type: TriggerType.EVENT, source: 'lead.created' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T10:00:01Z', endTime: '2024-03-20T10:00:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T10:00:01Z', endTime: '2024-03-20T10:00:02Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-20T10:00:02Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:03Z' },
        ],
        result: { assignedTo: '李四', tier: 'A', notificationSent: true },
      },
      {
        id: 'exec-002',
        workflowId: 'wf-lead-assign-001',
        status: 'success',
        startedAt: '2024-03-20T14:30:00Z',
        completedAt: '2024-03-20T14:30:02Z',
        duration: 2100,
        trigger: { type: TriggerType.EVENT, source: 'lead.created' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T14:30:00Z', endTime: '2024-03-20T14:30:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T14:30:00Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:01Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-20T14:30:01Z', endTime: '2024-03-20T14:30:02Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-20T14:30:02Z', endTime: '2024-03-20T14:30:02Z' },
        ],
        result: { assignedTo: '王五', tier: 'B', notificationSent: true },
      },
    ],
  },

  // 工作流 2: 客户生日祝福
  {
    id: 'wf-birthday-greet-002',
    name: '客户生日祝福',
    description: '客户生日当天自动发送祝福邮件/短信',
    category: 'marketing',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.SCHEDULE, name: '定时检查', config: { cron: '0 9 * * *' } },
      { id: 'n3', type: WorkflowNodeType.TASK, name: '查询今日生日客户' },
      { id: 'n4', type: WorkflowNodeType.CONDITION, name: '有无生日客户' },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '发送祝福', config: { channel: 'email' } },
      { id: 'n6', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '有' },
      { from: 'n4', to: 'n6', label: '无' },
      { from: 'n5', to: 'n6' },
    ],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
    createdBy: '李四',
    executions: [
      {
        id: 'exec-003',
        workflowId: 'wf-birthday-greet-002',
        status: 'success',
        startedAt: '2024-03-21T09:00:00Z',
        completedAt: '2024-03-21T09:00:05Z',
        duration: 5100,
        trigger: { type: TriggerType.SCHEDULE, source: 'cron:0 9 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-21T09:00:00Z', endTime: '2024-03-21T09:00:02Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-21T09:00:02Z', endTime: '2024-03-21T09:00:02Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-21T09:00:02Z', endTime: '2024-03-21T09:00:04Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-21T09:00:04Z', endTime: '2024-03-21T09:00:05Z' },
        ],
        result: { customersCount: 3, sentCount: 3, failedCount: 0 },
      },
    ],
  },

  // 工作流 3: 商机审批流程
  {
    id: 'wf-opportunity-approval-003',
    name: '商机审批流程',
    description: '大于 5 万的商机需总监审批后方可推进',
    category: 'sales',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.TASK, name: '提交商机' },
      { id: 'n3', type: WorkflowNodeType.CONDITION, name: '金额>=5 万？' },
      { id: 'n4', type: WorkflowNodeType.APPROVAL, name: '总监审批', config: { approver: 'director', timeout: 48 } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '创建订单' },
      { id: 'n6', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: '是' },
      { from: 'n3', to: 'n5', label: '否' },
      { from: 'n4', to: 'n5', label: '通过' },
      { from: 'n4', to: 'n6', label: '拒绝' },
      { from: 'n5', to: 'n6' },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-004',
        workflowId: 'wf-opportunity-approval-003',
        status: 'success',
        startedAt: '2024-03-19T11:00:00Z',
        completedAt: '2024-03-19T15:30:00Z',
        duration: 16200000,
        trigger: { type: TriggerType.MANUAL },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-19T11:00:00Z', endTime: '2024-03-19T11:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-19T11:00:00Z', endTime: '2024-03-19T11:00:01Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-19T11:00:01Z', endTime: '2024-03-19T11:00:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-19T11:00:01Z', endTime: '2024-03-19T15:00:00Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-19T15:00:00Z', endTime: '2024-03-19T15:30:00Z' },
          { nodeId: 'n6', status: 'success', startTime: '2024-03-19T15:30:00Z', endTime: '2024-03-19T15:30:00Z' },
        ],
        result: { approvalResult: 'approved', orderId: 'ORD-20240319-001' },
      },
    ],
  },

  // 工作流 4: 工单自动分配
  {
    id: 'wf-ticket-assign-004',
    name: '工单自动分配',
    description: '根据工单类型和优先级分配给对应客服',
    category: 'support',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.TASK, name: '获取工单' },
      { id: 'n3', type: WorkflowNodeType.CONDITION, name: '优先级', config: { field: 'priority' } },
      { id: 'n4', type: WorkflowNodeType.TASK, name: 'P0 优先分配', config: { sla: 1 } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '正常分配', config: { sla: 24 } },
      { id: 'n6', type: WorkflowNodeType.TASK, name: '通知待处理', config: { channel: 'dingtalk' } },
      { id: 'n7', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: 'P0' },
      { from: 'n3', to: 'n5', label: '其他' },
      { from: 'n4', to: 'n6' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-03-18T09:00:00Z',
    createdBy: '王五',
    executions: [
      {
        id: 'exec-005',
        workflowId: 'wf-ticket-assign-004',
        status: 'failed',
        startedAt: '2024-03-22T10:00:00Z',
        completedAt: '2024-03-22T10:00:01Z',
        duration: 1200,
        trigger: { type: TriggerType.EVENT, source: 'ticket.created' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-22T10:00:00Z', endTime: '2024-03-22T10:00:00Z' },
          { nodeId: 'n2', status: 'failed', startTime: '2024-03-22T10:00:00Z', endTime: '2024-03-22T10:00:01Z', error: '工单服务连接超时' },
        ],
        result: { error: '工单服务连接超时' },
      },
    ],
  },

  // 工作流 5: 合同到期提醒
  {
    id: 'wf-contract-reminder-005',
    name: '合同到期提醒',
    description: '合同到期前 30/7/1 天自动发送提醒通知',
    category: 'operation',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.SCHEDULE, name: '每日检查', config: { cron: '0 10 * * *' } },
      { id: 'n3', type: WorkflowNodeType.TASK, name: '查询即将到期合同' },
      { id: 'n4', type: WorkflowNodeType.CONDITION, name: '剩余天数', config: { field: 'daysLeft' } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '30 天提醒', config: { template: 'reminder_30' } },
      { id: 'n6', type: WorkflowNodeType.TASK, name: '7 天提醒', config: { template: 'reminder_7' } },
      { id: 'n7', type: WorkflowNodeType.TASK, name: '1 天提醒', config: { template: 'reminder_1' } },
      { id: 'n8', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: '30 天' },
      { from: 'n4', to: 'n6', label: '7 天' },
      { from: 'n4', to: 'n7', label: '1 天' },
      { from: 'n4', to: 'n8', label: '其他' },
      { from: 'n5', to: 'n8' },
      { from: 'n6', to: 'n8' },
      { from: 'n7', to: 'n8' },
    ],
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    createdBy: '赵六',
    executions: [
      {
        id: 'exec-006',
        workflowId: 'wf-contract-reminder-005',
        status: 'success',
        startedAt: '2024-03-20T10:00:00Z',
        completedAt: '2024-03-20T10:00:08Z',
        duration: 8100,
        trigger: { type: TriggerType.SCHEDULE, source: 'cron:0 10 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:03Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-20T10:00:03Z', endTime: '2024-03-20T10:00:05Z' },
          { nodeId: 'n8', status: 'success', startTime: '2024-03-20T10:00:05Z', endTime: '2024-03-20T10:00:08Z' },
        ],
        result: { contractsFound: 5, reminders30: 2, reminders7: 1, reminders1: 0 },
      },
    ],
  },

  // 工作流 6: 数据同步 (Webhooks)
  {
    id: 'wf-data-sync-006',
    name: 'ERP 数据同步',
    description: '当 CRM 客户信息变更时同步到 ERP 系统',
    category: 'operation',
    status: 'active',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.WEBHOOK, name: '接收变更事件' },
      { id: 'n3', type: WorkflowNodeType.TASK, name: '转换数据格式' },
      { id: 'n4', type: WorkflowNodeType.WEBHOOK, name: '推送到 ERP', config: { url: 'https://erp.example.com/api/sync' } },
      { id: 'n5', type: WorkflowNodeType.CONDITION, name: '同步成功？' },
      { id: 'n6', type: WorkflowNodeType.TASK, name: '记录失败日志' },
      { id: 'n7', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n7', label: '成功' },
      { from: 'n5', to: 'n6', label: '失败' },
      { from: 'n6', to: 'n7' },
    ],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    createdBy: '技术部',
    executions: [
      {
        id: 'exec-007',
        workflowId: 'wf-data-sync-006',
        status: 'success',
        startedAt: '2024-03-22T08:30:00Z',
        completedAt: '2024-03-22T08:30:02Z',
        duration: 2100,
        trigger: { type: TriggerType.WEBHOOK, source: 'crm.customer.updated' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:00Z' },
          { nodeId: 'n3', status: 'success', startTime: '2024-03-22T08:30:00Z', endTime: '2024-03-22T08:30:01Z' },
          { nodeId: 'n4', status: 'success', startTime: '2024-03-22T08:30:01Z', endTime: '2024-03-22T08:30:02Z' },
          { nodeId: 'n5', status: 'success', startTime: '2024-03-22T08:30:02Z', endTime: '2024-03-22T08:30:02Z' },
          { nodeId: 'n7', status: 'success', startTime: '2024-03-22T08:30:02Z', endTime: '2024-03-22T08:30:02Z' },
        ],
        result: { erpResponse: { code: 200, message: '同步成功' } },
      },
    ],
  },

  // 工作流 7: 跟进超时预警
  {
    id: 'wf-followup-alert-007',
    name: '跟进超时预警',
    description: '销售未在规定时间内跟进线索时发送预警',
    category: 'sales',
    status: 'paused',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.SCHEDULE, name: '每 2 小时检查', config: { cron: '0 */2 * * *' } },
      { id: 'n3', type: WorkflowNodeType.TASK, name: '查询超时线索' },
      { id: 'n4', type: WorkflowNodeType.APPROVAL, name: '主管确认', config: { approver: 'manager' } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '发送催办通知', config: { channel: 'wechat' } },
      { id: 'n6', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6' },
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
    createdBy: '张三',
    executions: [
      {
        id: 'exec-008',
        workflowId: 'wf-followup-alert-007',
        status: 'skipped',
        startedAt: '2024-03-21T14:00:00Z',
        completedAt: '2024-03-21T14:00:01Z',
        duration: 800,
        trigger: { type: TriggerType.SCHEDULE, source: 'cron:0 */2 * * *' },
        nodes: [
          { nodeId: 'n1', status: 'success', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:00Z' },
          { nodeId: 'n2', status: 'success', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:00Z' },
          { nodeId: 'n3', status: 'skipped', startTime: '2024-03-21T14:00:00Z', endTime: '2024-03-21T14:00:01Z' },
        ],
        result: { skippedReason: '无超时线索' },
      },
    ],
  },

  // 工作流 8: 新员工入职流程 (Draft)
  {
    id: 'wf-onboarding-008',
    name: '新员工入职流程',
    description: '新员工入职时自动创建账户、分配权限、发送欢迎邮件',
    category: 'custom',
    status: 'draft',
    nodes: [
      { id: 'n1', type: WorkflowNodeType.START, name: '开始' },
      { id: 'n2', type: WorkflowNodeType.TASK, name: '创建企业账号' },
      { id: 'n3', type: WorkflowNodeType.TASK, name: '开通飞书账号' },
      { id: 'n4', type: WorkflowNodeType.TASK, name: '分配 CRM 角色', config: { defaultRole: 'sales' } },
      { id: 'n5', type: WorkflowNodeType.TASK, name: '发送欢迎邮件', config: { template: 'welcome' } },
      { id: 'n6', type: WorkflowNodeType.DELAY, name: '1 天后发送问卷', config: { delay: 86400000 } },
      { id: 'n7', type: WorkflowNodeType.TASK, name: '发送入职体验问卷' },
      { id: 'n8', type: WorkflowNodeType.END, name: '结束' },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' },
      { from: 'n7', to: 'n8' },
    ],
    createdAt: '2024-03-18T16:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
    createdBy: 'HR-小美',
    executions: [],
  },
];

// ============ 辅助函数 ============

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((wf) => wf.id === id);
}

export function getExecutionsByWorkflowId(workflowId: string): WorkflowExecution[] {
  const wf = getWorkflowById(workflowId);
  return wf?.executions ?? [];
}

export function getActiveWorkflows(): Workflow[] {
  return workflows.filter((wf) => wf.status === 'active');
}

export function getRecentExecutions(limit = 10): WorkflowExecution[] {
  const all = workflows.flatMap((wf) =>
    wf.executions.map((exec) => ({ ...exec, workflowName: wf.name, workflowCategory: wf.category }))
  );
  return all.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
}

export const workflowStats = {
  total: workflows.length,
  active: workflows.filter((wf) => wf.status === 'active').length,
  paused: workflows.filter((wf) => wf.status === 'paused').length,
  draft: workflows.filter((wf) => wf.status === 'draft').length,
  totalExecutions: workflows.reduce((sum, wf) => sum + wf.executions.length, 0),
  successRate: (() => {
    const total = workflows.reduce((sum, wf) => sum + wf.executions.length, 0);
    const success = workflows.reduce(
      (sum, wf) => sum + wf.executions.filter((e) => e.status === 'success').length,
      0
    );
    return total > 0 ? Math.round((success / total) * 100) : 0;
  })(),
};
