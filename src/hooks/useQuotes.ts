/**
 * 报价管理 Mock API Hooks
 * 提供报价列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/quotes.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QuoteStatus } from '@/types/cpq'
import type { MockQuote, QuoteProduct } from '@/mocks/quotes'
import { 
  mockQuotes, 
  getQuoteById, 
  getQuoteByQuoteNo,
  getAllQuotes,
  getQuotesByStatus,
  getQuotesByCustomerId,
  getQuotesByOpportunityId,
  getQuoteStats,
} from '@/mocks/quotes'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let quotesStore: MockQuote[] = [...mockQuotes]

function resetStore() {
  quotesStore = [...mockQuotes]
}

// 生成下一个报价单号
function getNextQuoteNo(): string {
  const year = new Date().getFullYear()
  const existingNos = quotesStore
    .filter(q => q.quoteNo.startsWith(`QT-${year}-`))
    .map(q => parseInt(q.quoteNo.split('-')[2]))
  const nextNum = existingNos.length > 0 ? Math.max(...existingNos) + 1 : 1
  return `QT-${year}-${String(nextNum).padStart(3, '0')}`
}

// ============ CRUD 操作 ============

const quoteCrud = {
  /**
   * 获取报价列表
   */
  async list(params?: {
    status?: QuoteStatus
    customerId?: string
    opportunityId?: string
    search?: string
    createdBy?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockQuote[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...quotesStore]
    
    if (params?.status) {
      result = result.filter(q => q.status === params.status)
    }
    
    if (params?.customerId) {
      result = result.filter(q => q.customerId === params.customerId)
    }
    
    if (params?.opportunityId) {
      result = result.filter(q => q.opportunityId === params.opportunityId)
    }
    
    if (params?.createdBy) {
      result = result.filter(q => q.createdBy === params.createdBy)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(q => 
        q.quoteNo.toLowerCase().includes(searchLower) ||
        q.customerName.toLowerCase().includes(searchLower) ||
        q.opportunityName?.toLowerCase().includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockQuote]
        const bVal = b[sortBy as keyof MockQuote]
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
   * 获取单个报价
   */
  async getById(id: string): Promise<MockQuote | null> {
    await delay(200 + Math.random() * 100)
    return getQuoteById(id) ?? null
  },

  /**
   * 创建报价
   */
  async create(quote: Omit<MockQuote, 'id' | 'quoteNo' | 'createdAt' | 'updatedAt'>): Promise<MockQuote> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newQuote: MockQuote = {
      ...quote,
      id: `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      quoteNo: getNextQuoteNo(),
      createdAt: now,
      updatedAt: now,
    }
    
    quotesStore.push(newQuote)
    return newQuote
  },

  /**
   * 更新报价
   */
  async update(id: string, updates: Partial<MockQuote>): Promise<MockQuote | null> {
    await delay(300 + Math.random() * 200)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return null
    
    // 重新计算总计
    const quote = quotesStore[index]
    const subtotal = quote.products.reduce((sum, p) => sum + p.amount, 0)
    const total = subtotal - (updates.discount || quote.discount) + (updates.tax || quote.tax)
    
    quotesStore[index] = {
      ...quotesStore[index],
      ...updates,
      subtotal,
      total,
      updatedAt: new Date().toISOString(),
    }
    
    return quotesStore[index]
  },

  /**
   * 删除报价
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return false
    
    quotesStore.splice(index, 1)
    return true
  },

  /**
   * 发送报价
   */
  async send(id: string): Promise<MockQuote | null> {
    await delay(300)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return null
    
    quotesStore[index] = {
      ...quotesStore[index],
      status: QuoteStatus.SENT,
      updatedAt: new Date().toISOString(),
    }
    
    return quotesStore[index]
  },

  /**
   * 接受报价
   */
  async accept(id: string): Promise<MockQuote | null> {
    await delay(300)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return null
    
    quotesStore[index] = {
      ...quotesStore[index],
      status: QuoteStatus.ACCEPTED,
      updatedAt: new Date().toISOString(),
    }
    
    return quotesStore[index]
  },

  /**
   * 拒绝报价
   */
  async reject(id: string, reason?: string): Promise<MockQuote | null> {
    await delay(300)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return null
    
    quotesStore[index] = {
      ...quotesStore[index],
      status: QuoteStatus.REJECTED,
      remark: reason || quotesStore[index].remark,
      updatedAt: new Date().toISOString(),
    }
    
    return quotesStore[index]
  },

  /**
   * 过期报价
   */
  async expire(id: string): Promise<MockQuote | null> {
    await delay(300)
    
    const index = quotesStore.findIndex(q => q.id === id)
    if (index === -1) return null
    
    quotesStore[index] = {
      ...quotesStore[index],
      status: QuoteStatus.EXPIRED,
      updatedAt: new Date().toISOString(),
    }
    
    return quotesStore[index]
  },

  /**
   * 复制报价
   */
  async duplicate(id: string): Promise<MockQuote | null> {
    await delay(400)
    
    const original = getQuoteById(id)
    if (!original) return null
    
    const now = new Date().toISOString()
    const newQuote: MockQuote = {
      ...original,
      id: `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      quoteNo: getNextQuoteNo(),
      status: QuoteStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
      remark: `副本：${original.remark || ''}`,
    }
    
    quotesStore.push(newQuote)
    return newQuote
  },

  /**
   * 获取报价统计
   */
  async getStats() {
    await delay(200)
    return getQuoteStats()
  },

  /**
   * 检查并更新过期报价
   */
  async checkExpired(): Promise<number> {
    await delay(200)
    
    const now = new Date()
    let count = 0
    
    quotesStore.forEach(q => {
      if (q.status === QuoteStatus.SENT && new Date(q.validUntil) < now) {
        q.status = QuoteStatus.EXPIRED
        q.updatedAt = now.toISOString()
        count++
      }
    })
    
    return count
  },
}

// ============ React Query Keys ============

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...quoteKeys.lists(), params] as const,
  details: () => [...quoteKeys.all, 'detail'] as const,
  detail: (id: string) => [...quoteKeys.details(), id] as const,
  stats: () => [...quoteKeys.all, 'stats'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取报价列表
 */
export function useQuotes(params?: {
  status?: QuoteStatus
  customerId?: string
  opportunityId?: string
  search?: string
  createdBy?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: quoteKeys.list(params),
    queryFn: () => quoteCrud.list(params),
  })
}

/**
 * 获取单个报价
 */
export function useQuote(id: string | null) {
  return useQuery({
    queryKey: quoteKeys.detail(id || ''),
    queryFn: () => quoteCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取客户报价
 */
export function useCustomerQuotes(customerId: string) {
  return useQuery({
    queryKey: [...quoteKeys.all, 'customer', customerId],
    queryFn: () => ({ data: getQuotesByCustomerId(customerId), total: getQuotesByCustomerId(customerId).length }),
    enabled: !!customerId,
  })
}

/**
 * 获取商机报价
 */
export function useOpportunityQuotes(opportunityId: string) {
  return useQuery({
    queryKey: [...quoteKeys.all, 'opportunity', opportunityId],
    queryFn: () => ({ data: getQuotesByOpportunityId(opportunityId), total: getQuotesByOpportunityId(opportunityId).length }),
    enabled: !!opportunityId,
  })
}

/**
 * 获取报价统计
 */
export function useQuoteStats() {
  return useQuery({
    queryKey: quoteKeys.stats(),
    queryFn: () => quoteCrud.getStats(),
  })
}

/**
 * 创建报价
 */
export function useCreateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (quote: Parameters<typeof quoteCrud.create>[0]) => 
      quoteCrud.create(quote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

/**
 * 更新报价
 */
export function useUpdateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockQuote>) =>
      quoteCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(quoteKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
    },
  })
}

/**
 * 删除报价
 */
export function useDeleteQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => quoteCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: quoteKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

/**
 * 发送报价
 */
export function useSendQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => quoteCrud.send(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(quoteKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

/**
 * 接受报价
 */
export function useAcceptQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => quoteCrud.accept(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(quoteKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

/**
 * 拒绝报价
 */
export function useRejectQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      quoteCrud.reject(id, reason),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(quoteKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

/**
 * 复制报价
 */
export function useDuplicateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => quoteCrud.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
    },
  })
}

/**
 * 检查过期报价
 */
export function useCheckExpiredQuotes() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => quoteCrud.checkExpired(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: quoteKeys.stats() })
    },
  })
}

// ============ 导出配置 ============

export { quoteStatusConfig } from '@/mocks/quotes'
export type { MockQuote, QuoteProduct }
