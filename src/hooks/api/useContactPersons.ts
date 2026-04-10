/**
 * 联系人管理 API Hooks
 * 使用 React Query 进行数据获取和管理
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  ContactPerson,
  ContactPersonListParams,
  ContactPersonListResponse,
  ContactPersonResponse,
} from '@/types/contactPerson'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

// ============================================================
// API 基础配置
// ============================================================

const API_BASE_URL = '/api/contact-persons'

// ============================================================
// Mock 数据生成器（开发用）
// ============================================================

function generateMockContactPersons(): ContactPerson[] {
  return [
    {
      id: 'cp1',
      name: '张三',
      gender: '男',
      position: '技术总监',
      jobLevel: '高管',
      decisionRole: '决策者',
      customerId: 'c1',
      customerName: '示例科技公司',
      mobile: '13800138001',
      officePhone: '010-88888888',
      email: 'zhangsan@example.com',
      wechat: 'zhangsan_tech',
      education: '硕士',
      school: '清华大学',
      major: '计算机科学',
      isPrimary: true,
      status: '正常',
      ownerId: 'u1',
      ownerName: '李明',
      createdBy: 'u1',
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'cp2',
      name: '李四',
      gender: '女',
      position: '采购经理',
      jobLevel: '中层',
      decisionRole: '影响者',
      customerId: 'c1',
      customerName: '示例科技公司',
      mobile: '13800138002',
      email: 'lisi@example.com',
      wechat: 'lisi_purchase',
      education: '本科',
      isPrimary: false,
      status: '正常',
      ownerId: 'u1',
      ownerName: '李明',
      createdBy: 'u1',
      createdAt: '2026-01-16T10:00:00Z',
    },
    {
      id: 'cp3',
      name: '王五',
      gender: '男',
      position: 'IT 主管',
      jobLevel: '中层',
      decisionRole: '使用者',
      customerId: 'c2',
      customerName: '示例制造公司',
      mobile: '13800138003',
      email: 'wangwu@example.com',
      isPrimary: true,
      status: '正常',
      ownerId: 'u2',
      ownerName: '王芳',
      createdBy: 'u2',
      createdAt: '2026-01-17T10:00:00Z',
    },
  ]
}

// ============================================================
// API 函数
// ============================================================

async function fetchContactPersons(params: ContactPersonListParams): Promise<PaginatedResponse<ContactPerson>> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(`${API_BASE_URL}?${new URLSearchParams(params as Record<string, string>)}`)
  // return response.json()
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 500))
  const allData = generateMockContactPersons()
  
  // 简单筛选
  let filtered = allData
  if (params.name) {
    filtered = filtered.filter(c => c.name.includes(params.name!))
  }
  if (params.customerId) {
    filtered = filtered.filter(c => c.customerId === params.customerId)
  }
  if (params.customerName) {
    filtered = filtered.filter(c => c.customerName?.includes(params.customerName!))
  }
  if (params.position) {
    filtered = filtered.filter(c => c.position?.includes(params.position!))
  }
  if (params.decisionRole) {
    filtered = filtered.filter(c => c.decisionRole === params.decisionRole)
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const total = filtered.length
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

async function fetchContactPerson(id: string): Promise<ContactPerson> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(`${API_BASE_URL}/${id}`)
  // return response.json()
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 300))
  const allData = generateMockContactPersons()
  const contact = allData.find(c => c.id === id)
  if (!contact) {
    throw new Error('联系人不存在')
  }
  return contact
}

async function createContactPerson(data: Omit<ContactPerson, 'id' | 'createdAt' | 'createdBy'>): Promise<ContactPerson> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(API_BASE_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // return response.json()
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 500))
  const newContact: ContactPerson = {
    ...data,
    id: `cp${Date.now()}`,
    createdBy: 'current_user',
    createdAt: new Date().toISOString(),
  }
  return newContact
}

async function updateContactPerson(id: string, data: Partial<ContactPerson>): Promise<ContactPerson> {
  // TODO: 替换为真实 API 调用
  // const response = await fetch(`${API_BASE_URL}/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // return response.json()
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    id,
    ...data,
  } as ContactPerson
}

async function deleteContactPerson(id: string): Promise<void> {
  // TODO: 替换为真实 API 调用
  // await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 300))
}

async function bulkDeleteContactPersons(ids: string[]): Promise<{ success: number; failed: number }> {
  // TODO: 替换为真实 API 调用
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    success: ids.length,
    failed: 0,
  }
}

async function bulkAssignContactPersons(ids: string[], assignee: string): Promise<{ success: number; failed: number }> {
  // TODO: 替换为真实 API 调用
  
  // Mock 实现
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    success: ids.length,
    failed: 0,
  }
}

// ============================================================
// React Query Hooks
// ============================================================

/**
 * 获取联系人列表
 */
export function useContactPersons(params?: ContactPersonListParams) {
  return useQuery<PaginatedResponse<ContactPerson>>({
    queryKey: ['contactPersons', params],
    queryFn: () => fetchContactPersons(params || {}),
  })
}

/**
 * 获取联系人详情
 */
export function useContactPerson(id: string | null) {
  return useQuery<ContactPerson>({
    queryKey: ['contactPerson', id],
    queryFn: () => fetchContactPerson(id!),
    enabled: !!id,
  })
}

/**
 * 获取客户下的联系人列表
 */
export function useContactPersonsByCustomer(customerId: string | null) {
  return useQuery<PaginatedResponse<ContactPerson>>({
    queryKey: ['contactPersonsByCustomer', customerId],
    queryFn: () => fetchContactPersons({ customerId: customerId || '', pageSize: 100 }),
    enabled: !!customerId,
  })
}

/**
 * 创建联系人
 */
export function useCreateContactPerson() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createContactPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] })
    },
  })
}

/**
 * 更新联系人
 */
export function useUpdateContactPerson() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactPerson> }) =>
      updateContactPerson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] })
      queryClient.invalidateQueries({ queryKey: ['contactPerson', id] })
    },
  })
}

/**
 * 删除联系人
 */
export function useDeleteContactPerson() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteContactPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] })
    },
  })
}

/**
 * 批量删除联系人
 */
export function useBulkDeleteContactPersons() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bulkDeleteContactPersons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] })
    },
  })
}

/**
 * 批量分配联系人
 */
export function useBulkAssignContactPersons() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, assignee }: { ids: string[]; assignee: string }) =>
      bulkAssignContactPersons(ids, assignee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactPersons'] })
    },
  })
}
