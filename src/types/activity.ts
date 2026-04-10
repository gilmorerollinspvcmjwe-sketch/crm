/**
 * Activity Types for CRM System
 */

export type ActivityType = 'call' | 'meeting' | 'email' | 'task' | 'note' | 'visit'
export type ActivityStatus = 'planned' | 'completed' | 'cancelled' | 'overdue'

export interface Activity {
  id: string
  type: ActivityType
  subject: string
  description?: string
  status: ActivityStatus
  startTime: string
  endTime?: string
  duration?: number
  location?: string
  customerId?: string
  customerName?: string
  contactId?: string
  contactName?: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  updatedAt: string
  reminder?: boolean
  reminderTime?: string
}

export interface ActivityListParams {
  page?: number
  pageSize?: number
  search?: string
  type?: ActivityType
  status?: ActivityStatus
  assignee?: string
  customerId?: string
  startDate?: string
  endDate?: string
}

export interface ActivityStats {
  total: number
  planned: number
  completed: number
  cancelled: number
  overdue: number
  byType: Record<ActivityType, number>
  byAssignee: Record<string, number>
}