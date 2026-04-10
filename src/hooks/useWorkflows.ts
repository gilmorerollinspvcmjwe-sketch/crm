/**
 * 工作流 Mock API Hooks
 * 提供工作流列表、详情、创建的 React Query hooks
 * 
 * 基于 mock/workflows.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MockWorkflow, WorkflowExecution, TriggerType } from '@/mocks/workflows'
import { 
  mockWorkflows, 
  getWorkflowById, 
  getAllWorkflows, 
  getActiveWorkflows,
  getWorkflowsByTriggerType,
  getWorkflowsByStatus,
  getWorkflowsByObjectType,
  getRecentExecutions,
  getWorkflowStats,
  triggerTypeConfig,
  statusConfig
} from '@/mocks/workflows'
import type { WorkflowStatus } from '@/types/workflow-engine'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let workflowsStore: MockWorkflow[] = [...mockWorkflows]

function resetStore() {
  workflowsStore = [...mockWorkflows]
}

// ============ CRUD 操作 ============

const workflowCrud = {
  /**
   * 获取所有工作流列表
   */
  async list(params?: {
    status?: WorkflowStatus | string
    triggerType?: TriggerType
    objectType?: string
    search?: string
  }): Promise<MockWorkflow[]> {
    await delay(300 + Math.random() * 200)
    
    let result = [...workflowsStore]
    
    if (params?.status) {
      result = result.filter(wf => wf.status === params.status)
    }
    
    if (params?.triggerType) {
      result = result.filter(wf => wf.triggerType === params.triggerType)
    }
    
    if (params?.objectType) {
      result = result.filter(wf => wf.objectType === params.objectType)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(wf => 
        wf.name.toLowerCase().includes(searchLower) ||
        wf.description.toLowerCase().includes(searchLower)
      )
    }
    
    return result
  },

  /**
   * 获取单个工作流
   */
  async getById(id: string): Promise<MockWorkflow | null> {
    await delay(200 + Math.random() * 100)
    return getWorkflowById(id) ?? null
  },

  /**
   * 创建工作流
   */
  async create(workflow: Omit<MockWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'executions' | 'stats'>): Promise<MockWorkflow> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newWorkflow: MockWorkflow = {
      ...workflow,
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      executions: [],
      stats: {
        totalExecutions: 0,
        successCount: 0,
        failedCount: 0,
        avgDuration: '-',
        lastRun: '-',
      },
    }
    
    workflowsStore.push(newWorkflow)
    return newWorkflow
  },

  /**
   * 更新工作流
   */
  async update(id: string, updates: Partial<MockWorkflow>): Promise<MockWorkflow | null> {
    await delay(300 + Math.random() * 200)
    
    const index = workflowsStore.findIndex(wf => wf.id === id)
    if (index === -1) return null
    
    workflowsStore[index] = {
      ...workflowsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    return workflowsStore[index]
  },

  /**
   * 删除工作流
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = workflowsStore.findIndex(wf => wf.id === id)
    if (index === -1) return false
    
    workflowsStore.splice(index, 1)
    return true
  },

  /**
   * 激活工作流
   */
  async activate(id: string): Promise<MockWorkflow | null> {
    return this.update(id, { status: 'active' })
  },

  /**
   * 停用工作流
   */
  async deactivate(id: string): Promise<MockWorkflow | null> {
    return this.update(id, { status: 'inactive' })
  },

  /**
   * 复制工作流
   */
  async duplicate(id: string): Promise<MockWorkflow | null> {
    const original = getWorkflowById(id)
    if (!original) return null
    
    const { id: _, createdAt:__, updatedAt:___, executions:____, stats:_____, ...rest } = original
    
    return this.create({
      ...rest,
      name: `${original.name} (副本)`,
      status: 'draft',
    })
  },

  /**
   * 执行工作流 (模拟)
   */
  async execute(id: string): Promise<WorkflowExecution | null> {
    await delay(500 + Math.random() * 300)
    
    const workflow = getWorkflowById(id)
    if (!workflow) return null
    
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId: id,
      status: 'success',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: 2000 + Math.random() * 1000,
      trigger: {
        type: 'manual',
        source: 'user:current',
      },
      nodes: workflow.nodes.map(node => ({
        nodeId: node.id,
        status: 'success',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      })),
      result: { executed: true },
    }
    
    // 更新统计
    const index = workflowsStore.findIndex(wf => wf.id === id)
    if (index !== -1) {
      workflowsStore[index].stats.totalExecutions++
      workflowsStore[index].stats.successCount++
      workflowsStore[index].stats.lastRun = '刚刚'
    }
    
    return execution
  },

  /**
   * 获取执行记录
   */
  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    await delay(300)
    
    if (workflowId) {
      const workflow = getWorkflowById(workflowId)
      return workflow?.executions ?? []
    }
    
    // 返回所有工作流的执行记录
    return getRecentExecutions(50)
  },

  /**
   * 获取工作流统计
   */
  async getStats() {
    await delay(200)
    return getWorkflowStats()
  },
}

// ============ React Query Keys ============

export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...workflowKeys.lists(), params] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  executions: (workflowId?: string) => [...workflowKeys.all, 'executions', workflowId] as const,
  stats: () => [...workflowKeys.all, 'stats'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取工作流列表
 */
export function useWorkflows(params?: {
  status?: WorkflowStatus | string
  triggerType?: TriggerType
  objectType?: string
  search?: string
}) {
  return useQuery({
    queryKey: workflowKeys.list(params),
    queryFn: () => workflowCrud.list(params),
  })
}

/**
 * 获取单个工作流
 */
export function useWorkflow(id: string | null) {
  return useQuery({
    queryKey: workflowKeys.detail(id || ''),
    queryFn: () => workflowCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取活跃工作流
 */
export function useActiveWorkflows() {
  return useQuery({
    queryKey: workflowKeys.list({ status: 'active' }),
    queryFn: () => workflowCrud.list({ status: 'active' }),
  })
}

/**
 * 获取工作流执行记录
 */
export function useWorkflowExecutions(workflowId?: string) {
  return useQuery({
    queryKey: workflowKeys.executions(workflowId),
    queryFn: () => workflowCrud.getExecutions(workflowId),
  })
}

/**
 * 获取工作流统计
 */
export function useWorkflowStats() {
  return useQuery({
    queryKey: workflowKeys.stats(),
    queryFn: () => workflowCrud.getStats(),
  })
}

/**
 * 创建工作流
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (workflow: Parameters<typeof workflowCrud.create>[0]) => 
      workflowCrud.create(workflow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workflowKeys.stats() })
    },
  })
}

/**
 * 更新工作流
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockWorkflow>) =>
      workflowCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(workflowKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workflowKeys.stats() })
    },
  })
}

/**
 * 删除工作流
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => workflowCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: workflowKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workflowKeys.stats() })
    },
  })
}

/**
 * 激活工作流
 */
export function useActivateWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => workflowCrud.activate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(workflowKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
    },
  })
}

/**
 * 停用工作流
 */
export function useDeactivateWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => workflowCrud.deactivate(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(workflowKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
    },
  })
}

/**
 * 切换工作流状态 (激活/停用)
 */
export function useToggleWorkflowStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      if (currentStatus === 'active') {
        return workflowCrud.deactivate(id)
      } else {
        return workflowCrud.activate(id)
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(workflowKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
    },
  })
}

/**
 * 复制工作流
 */
export function useDuplicateWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => workflowCrud.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.lists() })
    },
  })
}

/**
 * 执行工作流
 */
export function useExecuteWorkflow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => workflowCrud.execute(id),
    onSuccess: (data, id) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: workflowKeys.detail(id) })
        queryClient.invalidateQueries({ queryKey: workflowKeys.executions(id) })
        queryClient.invalidateQueries({ queryKey: workflowKeys.stats() })
      }
    },
  })
}

// ============ 导出配置和工具 ============

export { triggerTypeConfig, statusConfig }
export type { TriggerType }
