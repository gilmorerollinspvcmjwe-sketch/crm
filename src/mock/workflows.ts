/**
 * Workflows Mock Data - Re-export from workflowData
 * This file exists for compatibility with imports expecting @/mock/workflows
 */

import type { Workflow as WorkflowType } from './workflowData'

export type {
  WorkflowStatus,
  ExecutionStatus,
  WorkflowNode,
  WorkflowExecution,
  Workflow,
  WorkflowNodeType as WorkflowNodeTypeType,
  TriggerType as TriggerTypeType,
} from './workflowData'

export {
  workflows,
  getWorkflowById,
  getExecutionsByWorkflowId,
  getActiveWorkflows,
  getRecentExecutions,
  workflowStats,
  WorkflowNodeType as WorkflowNodeTypeEnum,
  TriggerType as TriggerTypeEnum,
} from './workflowData'

// MockWorkflow type alias for compatibility
export type MockWorkflow = WorkflowType

// Status configuration for UI display
export const statusConfig: Record<string, { label: string; className: string; icon?: string }> = {
  draft: { label: '草稿', className: 'bg-gray-400' },
  active: { label: '运行中', className: 'bg-green-500' },
  paused: { label: '已暂停', className: 'bg-yellow-500' },
  completed: { label: '已完成', className: 'bg-blue-500' },
  failed: { label: '失败', className: 'bg-red-500' },
  cancelled: { label: '已取消', className: 'bg-gray-500' },
}
