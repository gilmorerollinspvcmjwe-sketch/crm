/**
 * 通知管理 Hook (useNotifications)
 * 支持：系统通知/待办提醒/审批通知/分配通知
 * 支持未读标记、批量操作
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export type NotificationType = 'system' | 'task' | 'approval' | 'assignment'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    url?: string
    onClick?: () => void
  }
  metadata?: Record<string, string>
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
}

// Mock 通知数据
const mockNotifications: Notification[] = [
  // 待办提醒（高优先级）
  {
    id: 'notif-001',
    type: 'task',
    priority: 'high',
    title: '任务到期提醒',
    message: '您有 3 个待办任务即将到期，请及时处理',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '查看任务', url: '/tasks' },
    metadata: { taskCount: '3', dueDate: '今天' },
  },
  {
    id: 'notif-002',
    type: 'task',
    priority: 'high',
    title: '客户跟进提醒',
    message: '北京科技创新有限公司已超过 7 天未跟进，建议尽快联系',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '立即跟进', url: '/customers/cust-001' },
    metadata: { customer: '北京科技创新', days: '7' },
  },
  // 审批通知（高优先级）
  {
    id: 'notif-003',
    type: 'approval',
    priority: 'high',
    title: '合同审批待处理',
    message: '上海智能制造的合同待您审批，金额 ¥580,000',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '前往审批', url: '/contracts/contract-001/approve' },
    metadata: { customer: '上海智能制造', amount: '¥580,000' },
  },
  {
    id: 'notif-004',
    type: 'approval',
    priority: 'high',
    title: '报价审批待处理',
    message: 'ERP 系统升级项目的报价待您审批，金额 ¥128,000',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '前往审批', url: '/quotes/quote-001/approve' },
    metadata: { project: 'ERP 系统升级', amount: '¥128,000' },
  },
  // 分配通知（中优先级）
  {
    id: 'notif-005',
    type: 'assignment',
    priority: 'medium',
    title: '新客户分配',
    message: '李明分配给您 2 个新客户，请及时跟进',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '查看客户', url: '/customers' },
    metadata: { from: '李明', count: '2' },
  },
  {
    id: 'notif-006',
    type: 'assignment',
    priority: 'medium',
    title: '商机分配',
    message: '王芳分配给您 1 个新商机，预计金额 ¥350,000',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    action: { label: '查看商机', url: '/opportunities' },
    metadata: { from: '王芳', amount: '¥350,000' },
  },
  // 系统通知（中/低优先级）
  {
    id: 'notif-007',
    type: 'system',
    priority: 'medium',
    title: '系统更新通知',
    message: 'CRM 系统已更新至 v2.5.0，新增 AI 销售预测功能',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    action: { label: '查看更新', url: '/changelog' },
    metadata: { version: 'v2.5.0' },
  },
  {
    id: 'notif-008',
    type: 'system',
    priority: 'low',
    title: '数据备份完成',
    message: '系统数据备份已完成，备份文件大小 2.5GB',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    metadata: { size: '2.5GB' },
  },
  // 更多通知用于测试
  {
    id: 'notif-009',
    type: 'task',
    priority: 'medium',
    title: '周报提醒',
    message: '本周工作周报还未提交，请在周五前完成',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    action: { label: '提交周报', url: '/reports/weekly' },
  },
  {
    id: 'notif-010',
    type: 'approval',
    priority: 'urgent',
    title: '紧急：特价审批',
    message: '特价申请待您审批，折扣力度 85%，需总监级别审批',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    action: { label: '立即审批', url: '/quotes/quote-002/approve' },
    metadata: { discount: '85%', level: '总监' },
  },
]

// API 模拟
const notificationApi = {
  async getAll(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockNotifications
  },

  async markAsRead(ids: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    // Mock 更新
    console.log('Mark as read:', ids)
  },

  async markAllAsRead(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    console.log('Mark all as read')
  },

  async delete(ids: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    console.log('Delete notifications:', ids)
  },

  async deleteAll(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    console.log('Delete all notifications')
  },
}

// Query Keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
}

/**
 * 获取通知列表
 */
export function useNotifications() {
  const queryClient = useQueryClient()
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(mockNotifications)

  const query = useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => notificationApi.getAll(),
    initialData: mockNotifications,
  })

  // 标记已读 Mutation
  const markAsReadMutation = useMutation({
    mutationFn: (ids: string[]) => notificationApi.markAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    },
  })

  // 全部已读 Mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    },
  })

  // 删除 Mutation
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => notificationApi.delete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    },
  })

  // 全部删除 Mutation
  const deleteAllMutation = useMutation({
    mutationFn: () => notificationApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() })
    },
  })

  // 计算统计
  const stats: NotificationStats = {
    total: localNotifications.length,
    unread: localNotifications.filter((n) => !n.read).length,
    byType: {
      system: localNotifications.filter((n) => n.type === 'system').length,
      task: localNotifications.filter((n) => n.type === 'task').length,
      approval: localNotifications.filter((n) => n.type === 'approval').length,
      assignment: localNotifications.filter((n) => n.type === 'assignment').length,
    },
    byPriority: {
      low: localNotifications.filter((n) => n.priority === 'low').length,
      medium: localNotifications.filter((n) => n.priority === 'medium').length,
      high: localNotifications.filter((n) => n.priority === 'high').length,
      urgent: localNotifications.filter((n) => n.priority === 'urgent').length,
    },
  }

  // 通知类型配置
  const typeConfig = {
    system: { label: '系统通知', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    task: { label: '待办提醒', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approval: { label: '审批通知', color: 'text-red-500', bg: 'bg-red-500/10' },
    assignment: { label: '分配通知', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  } as const

  const priorityConfig = {
    low: { label: '低', color: 'text-gray-500' },
    medium: { label: '中', color: 'text-blue-500' },
    high: { label: '高', color: 'text-orange-500' },
    urgent: { label: '紧急', color: 'text-red-500' },
  } as const

  return {
    // 数据
    notifications: localNotifications,
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // 操作
    markAsRead: (ids: string[]) => markAsReadMutation.mutate(ids),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    delete: (ids: string[]) => deleteMutation.mutate(ids),
    deleteAll: () => deleteAllMutation.mutate(),

    // 配置
    typeConfig,
    priorityConfig,
  }
}

/**
 * 获取通知统计（轻量版，仅用于徽章显示）
 */
export function useNotificationStats() {
  const { stats, isLoading } = useNotifications()
  return { stats, isLoading }
}
