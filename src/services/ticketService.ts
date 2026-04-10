/**
 * Ticket/工单 Service
 * Handles ticket CRUD operations and activity management
 */
import { http } from '@/lib/axios'
import { handleApiError } from './base'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

// ============================================================
// Types
// ============================================================

export type TicketStatus = '待处理' | '进行中' | '待确认' | '已完成' | '已关闭'
export type TicketPriority = '低' | '中' | '高' | '紧急'

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description?: string
  customerId?: string
  customerName?: string
  contactId?: string
  contactName?: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string
  assigneeName?: string
  creatorId: string
  creatorName?: string
  dueDate?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface TicketActivity {
  id: string
  ticketId: string
  type: 'comment' | 'status_change' | 'priority_change' | 'assignee_change' | 'attachment'
  content?: string
  oldValue?: string
  newValue?: string
  userId: string
  userName?: string
  createdAt: string
}

export interface TicketListParams {
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: string
  customerId?: string
  page?: number
  pageSize?: number
  search?: string
}

export interface TicketStats {
  total: number
  byStatus: Record<TicketStatus, number>
  byPriority: Record<TicketPriority, number>
  avgResolveTime: number // in hours
}

export interface CreateTicketData {
  title: string
  description?: string
  customerId?: string
  contactId?: string
  priority: TicketPriority
  assigneeId: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateTicketData {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  assigneeId?: string
  dueDate?: string
  tags?: string[]
}

export interface AddActivityData {
  ticketId: string
  type: TicketActivity['type']
  content?: string
}

// ============================================================
// API Functions
// ============================================================

const ticketApi = {
  /**
   * Get paginated ticket list
   */
  list: async (params?: TicketListParams): Promise<PaginatedResponse<Ticket>> => {
    try {
      const { data } = await http.get<PaginatedResponse<Ticket>>('/tickets', { params })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get ticket by ID
   */
  getById: async (id: string): Promise<Ticket> => {
    try {
      const { data } = await http.get<ApiResponse<Ticket>>(`/tickets/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create new ticket
   */
  create: async (ticketData: CreateTicketData): Promise<Ticket> => {
    try {
      const { data } = await http.post<ApiResponse<Ticket>>('/tickets', ticketData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update ticket
   */
  update: async (id: string, ticketData: UpdateTicketData): Promise<Ticket> => {
    try {
      const { data } = await http.patch<ApiResponse<Ticket>>(`/tickets/${id}`, ticketData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete ticket
   */
  delete: async (id: string): Promise<void> => {
    try {
      await http.delete(`/tickets/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get ticket activities
   */
  getActivities: async (ticketId: string): Promise<TicketActivity[]> => {
    try {
      const { data } = await http.get<ApiResponse<TicketActivity[]>>(`/tickets/${ticketId}/activities`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Add ticket activity
   */
  addActivity: async (activityData: AddActivityData): Promise<TicketActivity> => {
    try {
      const { data } = await http.post<ApiResponse<TicketActivity>>(
        `/tickets/${activityData.ticketId}/activities`,
        activityData
      )
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get ticket statistics
   */
  getStats: async (): Promise<TicketStats> => {
    try {
      const { data } = await http.get<ApiResponse<TicketStats>>('/tickets/stats')
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get status options
   */
  getStatusOptions: async (): Promise<{ value: TicketStatus; label: string }[]> => {
    return [
      { value: '待处理', label: '待处理' },
      { value: '进行中', label: '进行中' },
      { value: '待确认', label: '待确认' },
      { value: '已完成', label: '已完成' },
      { value: '已关闭', label: '已关闭' },
    ]
  },

  /**
   * Get priority options
   */
  getPriorityOptions: async (): Promise<{ value: TicketPriority; label: string }[]> => {
    return [
      { value: '低', label: '低' },
      { value: '中', label: '中' },
      { value: '高', label: '高' },
      { value: '紧急', label: '紧急' },
    ]
  },
}

// ============================================================
// Export
// ============================================================

export { ticketApi }
export default ticketApi