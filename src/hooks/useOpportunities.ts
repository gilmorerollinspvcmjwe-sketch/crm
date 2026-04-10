/**
 * 商机管理 Mock API Hooks
 * 提供商机列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/opportunities.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { OpportunityStage, OpportunityPriority } from '@/types/api'
import type { MockOpportunity } from '@/mocks/opportunities'
import { 
  mockOpportunities, 
  getOpportunityById, 
  getAllOpportunities,
  getOpportunitiesByStage,
  getOpportunitiesByPriority,
  getOpportunitiesByCustomerId,
  getOpportunitiesByAssignee,
  getActiveOpportunities,
  getOpportunityStats,
  getSalesFunnel,
} from '@/mocks/opportunities'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let opportunitiesStore: MockOpportunity[] = [...mockOpportunities]

function resetStore() {
  opportunitiesStore = [...mockOpportunities]
}

// ============ CRUD 操作 ============

const opportunityCrud = {
  /**
   * 获取商机列表
   */
  async list(params?: {
    stage?: OpportunityStage
    priority?: OpportunityPriority
    customerId?: string
    assignee?: string
    search?: string
    minAmount?: number
    maxAmount?: number
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockOpportunity[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...opportunitiesStore]
    
    if (params?.stage) {
      result = result.filter(o => o.stage === params.stage)
    }
    
    if (params?.priority) {
      result = result.filter(o => o.priority === params.priority)
    }
    
    if (params?.customerId) {
      result = result.filter(o => o.customerId === params.customerId)
    }
    
    if (params?.assignee) {
      result = result.filter(o => o.assignee === params.assignee)
    }
    
    if (params?.minAmount !== undefined) {
      result = result.filter(o => o.amount >= params.minAmount!)
    }
    
    if (params?.maxAmount !== undefined) {
      result = result.filter(o => o.amount <= params.maxAmount!)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(o => 
        o.name.toLowerCase().includes(searchLower) ||
        o.customerName?.toLowerCase().includes(searchLower) ||
        o.contactName?.toLowerCase().includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockOpportunity]
        const bVal = b[sortBy as keyof MockOpportunity]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return sortOrder === 'asc' ? 1 : -1
        if (bVal == null) return sortOrder === 'asc' ? -1 : 1
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    
    const total = result.length
    
    // 分页
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      result = result.slice(start, end)
    }
    
    return { data: result, total }
  },

  /**
   * 获取单个商机
   */
  async getById(id: string): Promise<MockOpportunity | null> {
    await delay(200 + Math.random() * 100)
    return getOpportunityById(id) ?? null
  },

  /**
   * 创建商机
   */
  async create(opportunity: Omit<MockOpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockOpportunity> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newOpportunity: MockOpportunity = {
      ...opportunity,
      id: `OPP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
      winRate: opportunity.probability,
    }
    
    opportunitiesStore.push(newOpportunity)
    return newOpportunity
  },

  /**
   * 更新商机
   */
  async update(id: string, updates: Partial<MockOpportunity>): Promise<MockOpportunity | null> {
    await delay(300 + Math.random() * 200)
    
    const index = opportunitiesStore.findIndex(o => o.id === id)
    if (index === -1) return null
    
    opportunitiesStore[index] = {
      ...opportunitiesStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      winRate: updates.probability !== undefined ? updates.probability : opportunitiesStore[index].winRate,
    }
    
    return opportunitiesStore[index]
  },

  /**
   * 删除商机
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = opportunitiesStore.findIndex(o => o.id === id)
    if (index === -1) return false
    
    opportunitiesStore.splice(index, 1)
    return true
  },

  /**
   * 批量删除商机
   */
  async batchDelete(ids: string[]): Promise<number> {
    await delay(400 + Math.random() * 200)
    
    let count = 0
    for (const id of ids) {
      const index = opportunitiesStore.findIndex(o => o.id === id)
      if (index !== -1) {
        opportunitiesStore.splice(index, 1)
        count++
      }
    }
    
    return count
  },

  /**
   * 推进商机阶段
   */
  async advanceStage(id: string, newStage: OpportunityStage): Promise<MockOpportunity | null> {
    await delay(300)
    
    const index = opportunitiesStore.findIndex(o => o.id === id)
    if (index === -1) return null
    
    const updates: Partial<MockOpportunity> = {
      stage: newStage,
      updatedAt: new Date().toISOString(),
    }
    
    // 如果进入成交或失败阶段，更新概率
    if (newStage === '成交') {
      updates.probability = 100
      updates.winRate = 100
      updates.actualCloseDate = new Date().toISOString()
    } else if (newStage === '失败') {
      updates.probability = 0
      updates.winRate = 0
    }
    
    opportunitiesStore[index] = {
      ...opportunitiesStore[index],
      ...updates,
    }
    
    return opportunitiesStore[index]
  },

  /**
   * 获取商机统计
   */
  async getStats() {
    await delay(200)
    return getOpportunityStats()
  },

  /**
   * 获取销售漏斗
   */
  async getFunnel() {
    await delay(200)
    return getSalesFunnel()
  },

  /**
   * 获取我的商机
   */
  async getMyOpportunities(assignee: string): Promise<MockOpportunity[]> {
    await delay(300)
    return getOpportunitiesByAssignee(assignee)
  },
}

// ============ React Query Keys ============

export const opportunityKeys = {
  all: ['opportunities'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...opportunityKeys.lists(), params] as const,
  details: () => [...opportunityKeys.all, 'detail'] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
  stats: () => [...opportunityKeys.all, 'stats'] as const,
  funnel: () => [...opportunityKeys.all, 'funnel'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取商机列表
 */
export function useOpportunities(params?: {
  stage?: OpportunityStage
  priority?: OpportunityPriority
  customerId?: string
  assignee?: string
  search?: string
  minAmount?: number
  maxAmount?: number
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: opportunityKeys.list(params),
    queryFn: () => opportunityCrud.list(params),
  })
}

/**
 * 获取单个商机
 */
export function useOpportunity(id: string | null) {
  return useQuery({
    queryKey: opportunityKeys.detail(id || ''),
    queryFn: () => opportunityCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取活跃商机
 */
export function useActiveOpportunities() {
  return useQuery({
    queryKey: opportunityKeys.list({ active: true }),
    queryFn: () => ({ data: getActiveOpportunities(), total: getActiveOpportunities().length }),
  })
}

/**
 * 获取我的商机
 */
export function useMyOpportunities(assignee: string) {
  return useQuery({
    queryKey: [...opportunityKeys.all, 'mine', assignee],
    queryFn: () => opportunityCrud.getMyOpportunities(assignee),
    enabled: !!assignee,
  })
}

/**
 * 获取商机统计
 */
export function useOpportunityStats() {
  return useQuery({
    queryKey: opportunityKeys.stats(),
    queryFn: () => opportunityCrud.getStats(),
  })
}

/**
 * 获取销售漏斗
 */
export function useSalesFunnel() {
  return useQuery({
    queryKey: opportunityKeys.funnel(),
    queryFn: () => opportunityCrud.getFunnel(),
  })
}

/**
 * 创建商机
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (opportunity: Parameters<typeof opportunityCrud.create>[0]) => 
      opportunityCrud.create(opportunity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.stats() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.funnel() })
    },
  })
}

/**
 * 更新商机
 */
export function useUpdateOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockOpportunity>) =>
      opportunityCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(opportunityKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.stats() })
    },
  })
}

/**
 * 删除商机
 */
export function useDeleteOpportunity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => opportunityCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: opportunityKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.stats() })
    },
  })
}

/**
 * 批量删除商机
 */
export function useBatchDeleteOpportunities() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => opportunityCrud.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.stats() })
    },
  })
}

/**
 * 推进商机阶段
 */
export function useAdvanceOpportunityStage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStage }) =>
      opportunityCrud.advanceStage(id, stage),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(opportunityKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.stats() })
      queryClient.invalidateQueries({ queryKey: opportunityKeys.funnel() })
    },
  })
}

// ============ 导出配置 ============

export { opportunityStageConfig, opportunityPriorityConfig, opportunitySourceConfig } from '@/mocks/opportunities'
export type { MockOpportunity }
