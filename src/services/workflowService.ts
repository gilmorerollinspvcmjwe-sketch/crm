/**
 * 工作流服务层 (Workflow Service Layer)
 * 提供工作流和执行的 CRUD + 统计功能
 * 使用 mock 数据 + 模拟延迟
 */

import type {
  Workflow,
  WorkflowExecution,
  WorkflowNode,
  WorkflowStats,
  ExecutionStats,
} from '../types/workflow';

// ============ Mock 数据 ============

const mockNodes: WorkflowNode[] = [
  { id: 'node1', type: 'trigger', name: '触发器', position: { x: 0, y: 0 }, config: { type: 'record_created', objectId: 'lead' } },
  { id: 'node2', type: 'action', name: '分配销售', position: { x: 0, y: 0 }, config: { type: 'assign_owner', assignType: 'specific', userId: 'sales_team' } },
  { id: 'node3', type: 'condition', name: '条件判断', position: { x: 0, y: 0 }, config: { type: 'simple', condition: { id: 'c1', field: 'amount', operator: 'greater_than', value: 10000 } } },
  { id: 'node4', type: 'action', name: '发送邮件', position: { x: 0, y: 0 }, config: { type: 'send_email', subject: '欢迎', body: '欢迎邮件内容', recipients: [{ type: 'owner', value: '' }], sendTime: 'immediate' } },
];

const mockWorkflows: Workflow[] = [
  {
    id: 'wf001',
    objectId: 'lead',
    name: '新线索自动分配',
    description: '当有新线索创建时，自动分配给空闲销售',
    status: 'active',
    trigger: { type: 'record_created', objectId: 'lead' },
    nodes: mockNodes,
    edges: [
      { id: 'e1', source: 'node1', target: 'node2' },
      { id: 'e2', source: 'node2', target: 'node3' },
      { id: 'e3', source: 'node3', target: 'node4', label: '金额>10000' },
    ],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    createdBy: 'user001',
    runCount: 10,
    successCount: 8,
    failedCount: 2,
  },
  {
    id: 'wf002',
    objectId: 'customer',
    name: '客户生日祝福',
    description: '客户生日当天自动发送祝福邮件',
    status: 'active',
    trigger: { type: 'scheduled', cronExpression: '0 9 * * *' },
    nodes: [
      { id: 'n1', type: 'trigger', name: '定时触发', position: { x: 0, y: 0 }, config: { type: 'scheduled', cronExpression: '0 9 * * *' } },
      { id: 'n2', type: 'action', name: '发送祝福', position: { x: 0, y: 0 }, config: { type: 'send_email', subject: '生日祝福', body: '祝您生日快乐！', recipients: [{ type: 'owner', value: '' }], sendTime: 'immediate' } },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z',
    createdBy: 'user002',
    runCount: 5,
    successCount: 5,
    failedCount: 0,
  },
  {
    id: 'wf003',
    objectId: 'customer',
    name: '流失预警流程',
    description: '检测客户活跃度下降，触发挽回流程',
    status: 'draft',
    trigger: { type: 'no_activity', objectId: 'customer', inactivityDays: 30 },
    nodes: [
      { id: 'n1', type: 'trigger', name: '触发器', position: { x: 0, y: 0 }, config: { type: 'no_activity', objectId: 'customer', inactivityDays: 30 } },
      { id: 'n2', type: 'condition', name: '流失风险', position: { x: 0, y: 0 }, config: { type: 'simple', condition: { id: 'c1', field: 'score', operator: 'less_than', value: 30 } } },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
    createdAt: '2024-03-10T16:00:00Z',
    updatedAt: '2024-03-10T16:00:00Z',
    createdBy: 'user001',
    runCount: 0,
    successCount: 0,
    failedCount: 0,
  },
];

const mockExecutions: WorkflowExecution[] = [
  {
    id: 'exec001',
    workflowId: 'wf001',
    triggeredAt: '2024-03-15T10:00:00Z',
    completedAt: '2024-03-15T10:00:02Z',
    triggeredBy: 'system',
    triggerType: 'record_created',
    recordId: 'lead123',
    recordName: '张三',
    status: 'success',
    duration: 2000,
    nodeExecutions: [
      { nodeId: 'node1', nodeName: '触发器', nodeType: 'trigger', status: 'success', startedAt: '2024-03-15T10:00:00Z', completedAt: '2024-03-15T10:00:00Z', duration: 100 },
      { nodeId: 'node2', nodeName: '分配销售', nodeType: 'action', status: 'success', startedAt: '2024-03-15T10:00:00Z', completedAt: '2024-03-15T10:00:01Z', duration: 500, output: { assignee: 'sales_001' } },
      { nodeId: 'node3', nodeName: '条件判断', nodeType: 'condition', status: 'success', startedAt: '2024-03-15T10:00:01Z', completedAt: '2024-03-15T10:00:01Z', duration: 200 },
      { nodeId: 'node4', nodeName: '发送邮件', nodeType: 'action', status: 'success', startedAt: '2024-03-15T10:00:01Z', completedAt: '2024-03-15T10:00:02Z', duration: 1200 },
    ],
    error: undefined,
  },
  {
    id: 'exec002',
    workflowId: 'wf001',
    triggeredAt: '2024-03-15T11:30:00Z',
    completedAt: '2024-03-15T11:30:01Z',
    triggeredBy: 'system',
    triggerType: 'record_created',
    recordId: 'lead456',
    recordName: '李四',
    status: 'failed',
    duration: 1000,
    nodeExecutions: [
      { nodeId: 'node1', nodeName: '触发器', nodeType: 'trigger', status: 'success', startedAt: '2024-03-15T11:30:00Z', completedAt: '2024-03-15T11:30:00Z', duration: 100 },
      { nodeId: 'node2', nodeName: '分配销售', nodeType: 'action', status: 'failed', startedAt: '2024-03-15T11:30:00Z', completedAt: '2024-03-15T11:30:01Z', duration: 900, error: '销售团队成员均忙' },
    ],
    error: '销售团队成员均忙',
  },
  {
    id: 'exec003',
    workflowId: 'wf002',
    triggeredAt: '2024-03-18T09:00:00Z',
    completedAt: undefined,
    triggeredBy: 'system',
    triggerType: 'scheduled',
    recordId: 'wf002',
    status: 'running',
    duration: 0,
    nodeExecutions: [
      { nodeId: 'n1', nodeName: '定时触发', nodeType: 'trigger', status: 'success', startedAt: '2024-03-18T09:00:00Z', completedAt: '2024-03-18T09:00:00Z', duration: 50 },
      { nodeId: 'n2', nodeName: '发送祝福', nodeType: 'action', status: 'success', startedAt: '2024-03-18T09:00:00Z', completedAt: '2024-03-18T09:00:01Z', duration: 100 },
    ],
    error: undefined,
  },
];

// ============ 工具函数 ============

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let nextWorkflowId = 100;
let nextExecutionId = 100;

// ============ 工作流 CRUD ============

/**
 * 获取所有工作流
 */
export async function getWorkflows(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: Workflow[]; total: number }> {
  await delay(300 + Math.random() * 200);

  let filtered = [...mockWorkflows];

  if (params?.status) {
    filtered = filtered.filter(w => w.status === params.status);
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total: filtered.length };
}

/**
 * 获取单个工作流
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  await delay(200 + Math.random() * 100);
  return mockWorkflows.find(w => w.id === id) ?? null;
}

/**
 * 创建工作流
 */
export async function createWorkflow(
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Workflow> {
  await delay(400 + Math.random() * 200);

  const newWorkflow: Workflow = {
    ...workflow,
    id: `wf${String(++nextWorkflowId).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 实际项目中这里会写入数据库
  mockWorkflows.push(newWorkflow);
  return newWorkflow;
}

/**
 * 更新工作流
 */
export async function updateWorkflow(
  id: string,
  updates: Partial<Omit<Workflow, 'id' | 'createdAt'>>
): Promise<Workflow | null> {
  await delay(300 + Math.random() * 200);

  const index = mockWorkflows.findIndex(w => w.id === id);
  if (index === -1) return null;

  const updated: Workflow = {
    ...mockWorkflows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockWorkflows[index] = updated;
  return updated;
}

/**
 * 删除工作流
 */
export async function deleteWorkflow(id: string): Promise<boolean> {
  await delay(300 + Math.random() * 200);

  const index = mockWorkflows.findIndex(w => w.id === id);
  if (index === -1) return false;

  mockWorkflows.splice(index, 1);
  return true;
}

// ============ 执行相关 ============

/**
 * 执行工作流
 */
export async function executeWorkflow(
  workflowId: string,
  input?: Record<string, unknown>
): Promise<WorkflowExecution> {
  await delay(500 + Math.random() * 300);

  const workflow = mockWorkflows.find(w => w.id === workflowId);
  if (!workflow) {
    throw new Error(`工作流 ${workflowId} 不存在`);
  }

  const execution: WorkflowExecution = {
    id: `exec${String(++nextExecutionId).padStart(3, '0')}`,
    workflowId,
    triggerType: workflow.trigger.type,
    triggeredAt: new Date().toISOString(),
    triggeredBy: 'system',
    recordId: '',
    status: 'running',
    duration: 0,
    nodeExecutions: workflow.nodes.map(n => ({ 
      nodeId: n.id, 
      nodeName: n.name, 
      nodeType: n.type, 
      status: 'skipped' as const,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: 0,
    })),
    error: undefined,
  };

  mockExecutions.push(execution);

  // 模拟异步完成
  setTimeout(() => {
    const idx = mockExecutions.findIndex(e => e.id === execution.id);
    if (idx !== -1) {
      mockExecutions[idx] = {
        ...mockExecutions[idx],
        status: 'success',
        completedAt: new Date().toISOString(),
        duration: 2000 + Math.random() * 1000,
        nodeExecutions: mockExecutions[idx].nodeExecutions.map(n => ({
          ...n,
          status: 'success' as const,
          completedAt: new Date().toISOString(),
          duration: Math.floor(Math.random() * 500),
        })),
      };
    }
  }, 2000);

  return execution;
}

/**
 * 获取执行列表
 */
export async function getExecutions(params?: {
  workflowId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: WorkflowExecution[]; total: number }> {
  await delay(300 + Math.random() * 200);

  let filtered = [...mockExecutions];

  if (params?.workflowId) {
    filtered = filtered.filter(e => e.workflowId === params.workflowId);
  }
  if (params?.status) {
    filtered = filtered.filter(e => e.status === params.status);
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total: filtered.length };
}

/**
 * 获取单个执行记录
 */
export async function getExecutionById(id: string): Promise<WorkflowExecution | null> {
  await delay(200 + Math.random() * 100);
  return mockExecutions.find(e => e.id === id) ?? null;
}

// ============ 统计 ============

/**
 * 获取工作流统计
 */
export async function getWorkflowStats(): Promise<WorkflowStats> {
  await delay(250 + Math.random() * 150);

  const total = mockWorkflows.length;
  const active = mockWorkflows.filter(w => w.status === 'active').length;
  const draft = mockWorkflows.filter(w => w.status === 'draft').length;
  const inactive = mockWorkflows.filter(w => w.status === 'inactive').length;

  return { total, active, draft, inactive, totalExecutions: 0, successExecutions: 0, failedExecutions: 0, avgDuration: 0 };
}

/**
 * 获取执行统计
 */
export async function getExecutionStats(params?: {
  workflowId?: string;
  period?: string;
}): Promise<ExecutionStats> {
  await delay(300 + Math.random() * 200);

  let executions = [...mockExecutions];
  if (params?.workflowId) {
    executions = executions.filter(e => e.workflowId === params.workflowId);
  }

  const total = executions.length;
  const completed = executions.filter(e => e.status === 'success').length;
  const failed = executions.filter(e => e.status === 'failed').length;
  const running = executions.filter(e => e.status === 'running').length;

  const completedOnes = executions.filter(e => e.status === 'success' && e.duration !== undefined && e.duration > 0);
  const avgDuration =
    completedOnes.length > 0
      ? completedOnes.reduce((sum, e) => sum + (e.duration || 0), 0) / completedOnes.length
      : 0;

  const successRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    active: 0,
    inactive: 0,
    draft: 0,
    totalExecutions: total,
    successExecutions: completed,
    failedExecutions: failed,
    avgDuration: Math.round(avgDuration),
  };
}
