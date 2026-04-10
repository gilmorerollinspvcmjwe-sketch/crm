/**
 * Activity API Hooks
 * TanStack Query hooks for activity data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '@/lib/axios'
import type {
  Activity,
  ActivityListParams,
  ActivityStats,
} from '@/types/activity'

// ============================================================
// Query Keys
// ============================================================
export const activityKeys = {
  all: ['activities'] as const,
  list: (params?: ActivityListParams) => ['activities', 'list', params] as const,
  detail: (id: string) => ['activities', 'detail', id] as const,
  stats: () => ['activities', 'stats'] as const,
}

// ============================================================
// Mock Data (for development)
// ============================================================
const mockActivities: Activity[] = [
  { id: 'A001', type: 'call', subject: '产品演示会议', description: '为客户演示新产品功能', status: 'completed', startTime: '2026-04-01 10:00', endTime: '2026-04-01 11:30', customerId: 'C001', customerName: '北京科技有限公司', contactId: 'CO001', contactName: '张伟', assignee: '李明', priority: 'high', createdAt: '2026-03-28', updatedAt: '2026-04-01', reminder: true },
  { id: 'A002', type: 'meeting', subject: '季度复盘会议', description: '团队季度业绩复盘', status: 'planned', startTime: '2026-04-05 14:00', endTime: '2026-04-05 16:00', location: '会议室A', assignee: '王芳', priority: 'medium', createdAt: '2026-03-30', updatedAt: '2026-03-30', reminder: true },
  { id: 'A003', type: 'email', subject: '报价单发送', description: '发送产品报价单给客户', status: 'completed', startTime: '2026-04-02 09:00', customerId: 'C002', customerName: '上海贸易集团', assignee: '李明', priority: 'low', createdAt: '2026-04-01', updatedAt: '2026-04-02' },
  { id: 'A004', type: 'task', subject: '合同跟进', description: '跟进合同签署进度', status: 'planned', startTime: '2026-04-03 10:00', customerId: 'C003', customerName: '深圳创新科技', assignee: '陈静', priority: 'high', createdAt: '2026-04-02', updatedAt: '2026-04-02', reminder: true },
  { id: 'A005', type: 'visit', subject: '客户现场拜访', description: '拜访客户工厂现场', status: 'planned', startTime: '2026-04-08 09:00', endTime: '2026-04-08 17:00', location: '广州制造业总部', customerId: 'C004', customerName: '广州制造业', assignee: '王芳', priority: 'high', createdAt: '2026-04-01', updatedAt: '2026-04-01', reminder: true },
  { id: 'A006', type: 'note', subject: '客户需求记录', description: '记录客户提出的特殊需求', status: 'completed', startTime: '2026-03-31 15:00', customerId: 'C006', customerName: '杭州电商', assignee: '李明', priority: 'low', createdAt: '2026-03-31', updatedAt: '2026-03-31' },
  { id: 'A007', type: 'call', subject: '续费沟通', description: '与客户沟通续费事宜', status: 'overdue', startTime: '2026-04-01 14:00', customerId: 'C009', customerName: '西安旅游集团', assignee: '李明', priority: 'medium', createdAt: '2026-03-29', updatedAt: '2026-03-29' },
  { id: 'A008', type: 'meeting', subject: '产品培训', description: '新产品使用培训', status: 'cancelled', startTime: '2026-03-25 10:00', customerId: 'C012', customerName: '青岛海洋科技', assignee: '陈静', priority: 'medium', createdAt: '2026-03-20', updatedAt: '2026-03-25' },
  { id: 'A009', type: 'task', subject: '方案准备', description: '准备客户定制方案', status: 'planned', startTime: '2026-04-04 09:00', customerId: 'C007', customerName: '南京新能源', assignee: '王芳', priority: 'high', createdAt: '2026-04-02', updatedAt: '2026-04-02', reminder: true },
  { id: 'A010', type: 'email', subject: '合同确认', description: '确认合同条款细节', status: 'planned', startTime: '2026-04-06 11:00', customerId: 'C010', customerName: '苏州工业园区', assignee: '李明', priority: 'medium', createdAt: '2026-04-03', updatedAt: '2026-04-03' },
]

// Mock stats
const mockStats: ActivityStats = {
  total: mockActivities.length,
  planned: mockActivities.filter(a => a.status === 'planned').length,
  completed: mockActivities.filter(a => a.status === 'completed').length,
  cancelled: mockActivities.filter(a => a.status === 'cancelled').length,
  overdue: mockActivities.filter(a => a.status === 'overdue').length,
  byType: {
    call: mockActivities.filter(a => a.type === 'call').length,
    meeting: mockActivities.filter(a => a.type === 'meeting').length,
    email: mockActivities.filter(a => a.type === 'email').length,
    task: mockActivities.filter(a => a.type === 'task').length,
    note: mockActivities.filter(a => a.type === 'note').length,
    visit: mockActivities.filter(a => a.type === 'visit').length,
  },
  byAssignee: {
    '李明': mockActivities.filter(a => a.assignee === '李明').length,
    '王芳': mockActivities.filter(a => a.assignee === '王芳').length,
    '陈静': mockActivities.filter(a => a.assignee === '陈静').length,
  },
}

// ============================================================
// Helper Functions
// ============================================================
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

const paginate = <T>(items: T[], page: number = 1, pageSize: number = 10) => ({
  data: items.slice((page - 1) * pageSize, page * pageSize),
  total: items.length,
  page,
  pageSize,
  totalPages: Math.ceil(items.length / pageSize),
})

// ============================================================
// API Hooks
// ============================================================
export function useActivities(params?: ActivityListParams) {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: async () => {
      await delay()
      let data = [...mockActivities]
      
      if (params?.search) {
        const search = params.search.toLowerCase()
        data = data.filter(a =>
          a.subject.toLowerCase().includes(search) ||
          a.customerName?.toLowerCase().includes(search) ||
          a.description?.toLowerCase().includes(search)
        )
      }
      
      if (params?.type) {
        data = data.filter(a => a.type === params.type)
      }
      
      if (params?.status) {
        data = data.filter(a => a.status === params.status)
      }
      
      if (params?.assignee) {
        data = data.filter(a => a.assignee === params.assignee)
      }
      
      if (params?.customerId) {
        data = data.filter(a => a.customerId === params.customerId)
      }
      
      return paginate(data, params?.page || 1, params?.pageSize || 10)
    },
  })
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: async () => {
      await delay()
      const activity = mockActivities.find(a => a.id === id)
      if (!activity) throw new Error(`Activity ${id} not found`)
      return activity
    },
    enabled: !!id,
  })
}

export function useActivityStats() {
  return useQuery({
    queryKey: activityKeys.stats(),
    queryFn: async () => {
      await delay()
      return mockStats
    },
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay()
      const newActivity: Activity = {
        ...data,
        id: `A${String(mockActivities.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      mockActivities.push(newActivity)
      return newActivity
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all })
    },
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Activity> }) => {
      await delay()
      const index = mockActivities.findIndex(a => a.id === id)
      if (index === -1) throw new Error(`Activity ${id} not found`)
      mockActivities[index] = {
        ...mockActivities[index],
        ...data,
        updatedAt: new Date().toISOString().split('T')[0],
      }
      return mockActivities[index]
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: activityKeys.list() })
      queryClient.invalidateQueries({ queryKey: activityKeys.stats() })
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string | string[]) => {
      await delay()
      const ids = Array.isArray(id) ? id : [id]
      ids.forEach(i => {
        const index = mockActivities.findIndex(a => a.id === i)
        if (index !== -1) mockActivities.splice(index, 1)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all })
    },
  })
}

export function useCompleteActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await delay()
      const index = mockActivities.findIndex(a => a.id === id)
      if (index === -1) throw new Error(`Activity ${id} not found`)
      mockActivities[index].status = 'completed'
      mockActivities[index].updatedAt = new Date().toISOString().split('T')[0]
      return mockActivities[index]
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: activityKeys.list() })
      queryClient.invalidateQueries({ queryKey: activityKeys.stats() })
    },
  })
}

// API object for direct access
export const activityApi = {
  list: useActivities,
  detail: useActivity,
  stats: useActivityStats,
  create: useCreateActivity,
  update: useUpdateActivity,
  delete: useDeleteActivity,
  complete: useCompleteActivity,
}