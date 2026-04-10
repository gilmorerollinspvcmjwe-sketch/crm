/**
 * 客户管理 Mock API Hooks
 * 提供客户列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/customers.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CustomerStatus } from '@/types/api'
import type { MockCustomer, CustomerType, CustomerIndustry, CustomerSource, CustomerScale } from '@/mocks/customers'
import { 
  mockCustomers, 
  getCustomerById, 
  getAllCustomers,
  getCustomersByStatus,
  getCustomersByType,
  getCustomersByIndustry,
  getActiveCustomers,
  getCustomerStats,
} from '@/mocks/customers'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let customersStore: MockCustomer[] = [...mockCustomers]

function resetStore() {
  customersStore = [...mockCustomers]
}

// ============ CRUD 操作 ============

const customerCrud = {
  /**
   * 获取客户列表
   */
  async list(params?: {
    status?: CustomerStatus
    type?: CustomerType
    industry?: CustomerIndustry
    source?: CustomerSource
    search?: string
    assignee?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockCustomer[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...customersStore]
    
    if (params?.status) {
      result = result.filter(c => c.status === params.status)
    }
    
    if (params?.type) {
      result = result.filter(c => c.type === params.type)
    }
    
    if (params?.industry) {
      result = result.filter(c => c.industry === params.industry)
    }
    
    if (params?.source) {
      result = result.filter(c => c.source === params.source)
    }
    
    if (params?.assignee) {
      result = result.filter(c => c.assignee === params.assignee)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.company.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockCustomer]
        const bVal = b[sortBy as keyof MockCustomer]
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
   * 获取单个客户
   */
  async getById(id: string): Promise<MockCustomer | null> {
    await delay(200 + Math.random() * 100)
    return getCustomerById(id) ?? null
  },

  /**
   * 创建客户
   */
  async create(customer: Omit<MockCustomer, 'id' | 'createdAt' | 'lastContact'>): Promise<MockCustomer> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newCustomer: MockCustomer = {
      ...customer,
      id: `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      lastContact: now,
    }
    
    customersStore.push(newCustomer)
    return newCustomer
  },

  /**
   * 更新客户
   */
  async update(id: string, updates: Partial<MockCustomer>): Promise<MockCustomer | null> {
    await delay(300 + Math.random() * 200)
    
    const index = customersStore.findIndex(c => c.id === id)
    if (index === -1) return null
    
    customersStore[index] = {
      ...customersStore[index],
      ...updates,
      lastContact: updates.lastContact || customersStore[index].lastContact,
    }
    
    return customersStore[index]
  },

  /**
   * 删除客户
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = customersStore.findIndex(c => c.id === id)
    if (index === -1) return false
    
    customersStore.splice(index, 1)
    return true
  },

  /**
   * 批量删除客户
   */
  async batchDelete(ids: string[]): Promise<number> {
    await delay(400 + Math.random() * 200)
    
    let count = 0
    for (const id of ids) {
      const index = customersStore.findIndex(c => c.id === id)
      if (index !== -1) {
        customersStore.splice(index, 1)
        count++
      }
    }
    
    return count
  },

  /**
   * 获取客户统计
   */
  async getStats() {
    await delay(200)
    return getCustomerStats()
  },

  /**
   * 导入客户
   */
  async import(customers: Omit<MockCustomer, 'id' | 'createdAt' | 'lastContact'>[]): Promise<MockCustomer[]> {
    await delay(500 + Math.random() * 300)
    
    const now = new Date().toISOString()
    const newCustomers: MockCustomer[] = customers.map(c => ({
      ...c,
      id: `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      lastContact: now,
    }))
    
    customersStore.push(...newCustomers)
    return newCustomers
  },

  /**
   * 导出客户
   */
  async export(ids?: string[]): Promise<MockCustomer[]> {
    await delay(300)
    
    if (ids && ids.length > 0) {
      return customersStore.filter(c => ids.includes(c.id))
    }
    
    return [...customersStore]
  },
}

// ============ React Query Keys ============

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取客户列表
 */
export function useCustomers(params?: {
  status?: CustomerStatus
  type?: CustomerType
  industry?: CustomerIndustry
  source?: CustomerSource
  search?: string
  assignee?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerCrud.list(params),
  })
}

/**
 * 获取单个客户
 */
export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: customerKeys.detail(id || ''),
    queryFn: () => customerCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取活跃客户
 */
export function useActiveCustomers() {
  return useQuery({
    queryKey: customerKeys.list({ status: '活跃' }),
    queryFn: () => customerCrud.list({ status: '活跃' }),
  })
}

/**
 * 获取客户统计
 */
export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customerCrud.getStats(),
  })
}

/**
 * 创建客户
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (customer: Parameters<typeof customerCrud.create>[0]) => 
      customerCrud.create(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

/**
 * 更新客户
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockCustomer>) =>
      customerCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(customerKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

/**
 * 删除客户
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => customerCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: customerKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

/**
 * 批量删除客户
 */
export function useBatchDeleteCustomers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => customerCrud.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

/**
 * 导入客户
 */
export function useImportCustomers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (customers: Parameters<typeof customerCrud.import>[0]) =>
      customerCrud.import(customers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

/**
 * 导出客户
 */
export function useExportCustomers() {
  return useMutation({
    mutationFn: (ids?: string[]) => customerCrud.export(ids),
  })
}

// ============ 导出配置 ============

export { 
  customerTypeConfig, 
  customerIndustryConfig, 
  customerScaleConfig, 
  customerStatusConfig, 
  customerSourceConfig 
} from '@/mocks/customers'
export type { MockCustomer, CustomerType, CustomerIndustry, CustomerScale, CustomerSource }
