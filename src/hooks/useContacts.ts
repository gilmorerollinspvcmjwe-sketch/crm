/**
 * 联系人 Mock API Hooks
 * 提供联系人列表、详情、创建、更新、删除的 React Query hooks
 * 
 * 基于 mocks/contacts.ts 中的 Mock 数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MockContact } from '@/mocks/contacts'
import { 
  mockContacts, 
  getContactById, 
  getAllContacts,
  getContactsByCustomerId,
  getPrimaryContacts,
  getContactStats,
} from '@/mocks/contacts'

// ============ 延迟模拟 ============

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============ 模拟数据存储 (支持 CRUD 操作) ============

let contactsStore: MockContact[] = [...mockContacts]

function resetStore() {
  contactsStore = [...mockContacts]
}

// ============ CRUD 操作 ============

const contactCrud = {
  /**
   * 获取联系人列表
   */
  async list(params?: {
    customerId?: string
    search?: string
    isPrimary?: boolean
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: MockContact[]; total: number }> {
    await delay(300 + Math.random() * 200)
    
    let result = [...contactsStore]
    
    if (params?.customerId) {
      result = result.filter(c => c.customerId === params.customerId)
    }
    
    if (params?.isPrimary !== undefined) {
      result = result.filter(c => c.isPrimary === params.isPrimary)
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.position.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(searchLower) ||
        c.mobile?.includes(searchLower)
      )
    }
    
    // 排序
    if (params?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = params
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof MockContact]
        const bVal = b[sortBy as keyof MockContact]
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
   * 获取单个联系人
   */
  async getById(id: string): Promise<MockContact | null> {
    await delay(200 + Math.random() * 100)
    return getContactById(id) ?? null
  },

  /**
   * 创建联系人
   */
  async create(contact: Omit<MockContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockContact> {
    await delay(400 + Math.random() * 200)
    
    const now = new Date().toISOString()
    const newContact: MockContact = {
      ...contact,
      id: `CONT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    }
    
    contactsStore.push(newContact)
    return newContact
  },

  /**
   * 更新联系人
   */
  async update(id: string, updates: Partial<MockContact>): Promise<MockContact | null> {
    await delay(300 + Math.random() * 200)
    
    const index = contactsStore.findIndex(c => c.id === id)
    if (index === -1) return null
    
    // 如果设置为主要联系人，取消该客户其他联系人的主要状态
    if (updates.isPrimary === true) {
      const contact = contactsStore[index]
      contactsStore.forEach(c => {
        if (c.customerId === contact.customerId && c.id !== id) {
          c.isPrimary = false
        }
      })
    }
    
    contactsStore[index] = {
      ...contactsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    return contactsStore[index]
  },

  /**
   * 删除联系人
   */
  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200)
    
    const index = contactsStore.findIndex(c => c.id === id)
    if (index === -1) return false
    
    contactsStore.splice(index, 1)
    return true
  },

  /**
   * 批量删除联系人
   */
  async batchDelete(ids: string[]): Promise<number> {
    await delay(400 + Math.random() * 200)
    
    let count = 0
    for (const id of ids) {
      const index = contactsStore.findIndex(c => c.id === id)
      if (index !== -1) {
        contactsStore.splice(index, 1)
        count++
      }
    }
    
    return count
  },

  /**
   * 设置主要联系人
   */
  async setAsPrimary(id: string): Promise<MockContact | null> {
    await delay(300)
    
    const index = contactsStore.findIndex(c => c.id === id)
    if (index === -1) return null
    
    const contact = contactsStore[index]
    
    // 取消该客户其他联系人的主要状态
    contactsStore.forEach(c => {
      if (c.customerId === contact.customerId) {
        c.isPrimary = c.id === id
      }
    })
    
    contactsStore[index] = {
      ...contactsStore[index],
      isPrimary: true,
      updatedAt: new Date().toISOString(),
    }
    
    return contactsStore[index]
  },

  /**
   * 记录联系记录
   */
  async logContact(id: string, contactType: string): Promise<MockContact | null> {
    await delay(200)
    
    const index = contactsStore.findIndex(c => c.id === id)
    if (index === -1) return null
    
    contactsStore[index] = {
      ...contactsStore[index],
      lastContactDate: new Date().toISOString(),
      lastContactType: contactType,
      updatedAt: new Date().toISOString(),
    }
    
    return contactsStore[index]
  },

  /**
   * 获取联系人统计
   */
  async getStats() {
    await delay(200)
    return getContactStats()
  },

  /**
   * 导入联系人
   */
  async import(contacts: Omit<MockContact, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<MockContact[]> {
    await delay(500 + Math.random() * 300)
    
    const now = new Date().toISOString()
    const newContacts: MockContact[] = contacts.map(c => ({
      ...c,
      id: `CONT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    }))
    
    contactsStore.push(...newContacts)
    return newContacts
  },
}

// ============ React Query Keys ============

export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
  stats: () => [...contactKeys.all, 'stats'] as const,
}

// ============ React Query Hooks ============

/**
 * 获取联系人列表
 */
export function useContacts(params?: {
  customerId?: string
  search?: string
  isPrimary?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactCrud.list(params),
  })
}

/**
 * 获取单个联系人
 */
export function useContact(id: string | null) {
  return useQuery({
    queryKey: contactKeys.detail(id || ''),
    queryFn: () => contactCrud.getById(id!),
    enabled: !!id,
  })
}

/**
 * 获取客户联系人
 */
export function useCustomerContacts(customerId: string) {
  return useQuery({
    queryKey: [...contactKeys.all, 'customer', customerId],
    queryFn: () => ({ data: getContactsByCustomerId(customerId), total: getContactsByCustomerId(customerId).length }),
    enabled: !!customerId,
  })
}

/**
 * 获取主要联系人
 */
export function usePrimaryContacts() {
  return useQuery({
    queryKey: [...contactKeys.all, 'primary'],
    queryFn: () => ({ data: getPrimaryContacts(), total: getPrimaryContacts().length }),
  })
}

/**
 * 获取联系人统计
 */
export function useContactStats() {
  return useQuery({
    queryKey: contactKeys.stats(),
    queryFn: () => contactCrud.getStats(),
  })
}

/**
 * 创建联系人
 */
export function useCreateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (contact: Parameters<typeof contactCrud.create>[0]) => 
      contactCrud.create(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

/**
 * 更新联系人
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<MockContact>) =>
      contactCrud.update(id, updates),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(contactKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
    },
  })
}

/**
 * 删除联系人
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => contactCrud.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: contactKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

/**
 * 批量删除联系人
 */
export function useBatchDeleteContacts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => contactCrud.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

/**
 * 设置主要联系人
 */
export function useSetAsPrimary() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => contactCrud.setAsPrimary(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(contactKeys.detail(data.id), data)
      }
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
    },
  })
}

/**
 * 记录联系记录
 */
export function useLogContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, contactType }: { id: string; contactType: string }) =>
      contactCrud.logContact(id, contactType),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(contactKeys.detail(data.id), data)
      }
    },
  })
}

/**
 * 导入联系人
 */
export function useImportContacts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (contacts: Parameters<typeof contactCrud.import>[0]) =>
      contactCrud.import(contacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

// ============ 导出 ============

export type { MockContact }
