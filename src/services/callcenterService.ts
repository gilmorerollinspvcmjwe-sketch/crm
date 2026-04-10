/**
 * Call Center/呼叫中心 Service
 * Handles outbound tasks, call records, and scripts management
 */
import { http } from '@/lib/axios'
import { handleApiError } from './base'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

// ============================================================
// Types
// ============================================================

export type OutboundTaskStatus = '待执行' | '执行中' | '暂停' | '已完成' | '已取消'

export interface OutboundTask {
  id: string
  name: string
  description?: string
  status: OutboundTaskStatus
  scriptId?: string
  scriptName?: string
  targetCount: number
  completedCount: number
  successCount: number
  failCount: number
  assignedTo: string
  assignedToName?: string
  createdBy: string
  createdByName?: string
  createdAt: string
  scheduledAt?: string
  completedAt?: string
}

export interface CallRecord {
  id: string
  taskId: string
  customerId?: string
  customerName?: string
  customerPhone: string
  status: 'success' | 'fail' | 'no_answer' | 'busy' | 'rejected'
  duration?: number // seconds
  recordingUrl?: string
  notes?: string
  operatorId: string
  operatorName?: string
  calledAt: string
}

export interface CallScript {
  id: string
  name: string
  description?: string
  content: string
  category?: string
  version: number
  isActive: boolean
  createdBy: string
  createdByName?: string
  createdAt: string
  updatedAt: string
}

export interface CallCenterStats {
  totalCalls: number
  successCalls: number
  failCalls: number
  avgDuration: number // seconds
  avgSuccessRate: number
  activeTasks: number
}

export interface OutboundTaskListParams {
  status?: OutboundTaskStatus
  assignedTo?: string
  page?: number
  pageSize?: number
  search?: string
}

export interface CreateOutboundTaskData {
  name: string
  description?: string
  scriptId?: string
  targetCount: number
  assignedTo: string
  scheduledAt?: string
}

export interface UpdateOutboundTaskData {
  name?: string
  description?: string
  status?: OutboundTaskStatus
  scriptId?: string
  assignedTo?: string
}

// ============================================================
// API Functions
// ============================================================

const callcenterApi = {
  // ================== Outbound Tasks ==================

  /**
   * Get outbound task list
   */
  getTaskList: async (params?: OutboundTaskListParams): Promise<PaginatedResponse<OutboundTask>> => {
    try {
      const { data } = await http.get<PaginatedResponse<OutboundTask>>('/callcenter/tasks', { params })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get task by ID
   */
  getTaskById: async (id: string): Promise<OutboundTask> => {
    try {
      const { data } = await http.get<ApiResponse<OutboundTask>>(`/callcenter/tasks/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create outbound task
   */
  createTask: async (taskData: CreateOutboundTaskData): Promise<OutboundTask> => {
    try {
      const { data } = await http.post<ApiResponse<OutboundTask>>('/callcenter/tasks', taskData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update outbound task
   */
  updateTask: async (id: string, taskData: UpdateOutboundTaskData): Promise<OutboundTask> => {
    try {
      const { data } = await http.patch<ApiResponse<OutboundTask>>(`/callcenter/tasks/${id}`, taskData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete outbound task
   */
  deleteTask: async (id: string): Promise<void> => {
    try {
      await http.delete(`/callcenter/tasks/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get task status options
   */
  getTaskStatusOptions: async (): Promise<{ value: OutboundTaskStatus; label: string }[]> => {
    return [
      { value: '待执行', label: '待执行' },
      { value: '执行中', label: '执行中' },
      { value: '暂停', label: '暂停' },
      { value: '已完成', label: '已完成' },
      { value: '已取消', label: '已取消' },
    ]
  },

  // ================== Call Records ==================

  /**
   * Get call records by task
   */
  getCallRecordsByTask: async (taskId: string): Promise<CallRecord[]> => {
    try {
      const { data } = await http.get<ApiResponse<CallRecord[]>>(`/callcenter/tasks/${taskId}/records`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Call Scripts ==================

  /**
   * Get all call scripts
   */
  getScripts: async (): Promise<CallScript[]> => {
    try {
      const { data } = await http.get<ApiResponse<CallScript[]>>('/callcenter/scripts')
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Get script by ID
   */
  getScriptById: async (id: string): Promise<CallScript> => {
    try {
      const { data } = await http.get<ApiResponse<CallScript>>(`/callcenter/scripts/${id}`)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Create call script
   */
  createScript: async (scriptData: Omit<CallScript, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<CallScript> => {
    try {
      const { data } = await http.post<ApiResponse<CallScript>>('/callcenter/scripts', scriptData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Update call script
   */
  updateScript: async (id: string, scriptData: Partial<CallScript>): Promise<CallScript> => {
    try {
      const { data } = await http.patch<ApiResponse<CallScript>>(`/callcenter/scripts/${id}`, scriptData)
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Delete call script
   */
  deleteScript: async (id: string): Promise<void> => {
    try {
      await http.delete(`/callcenter/scripts/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ================== Statistics ==================

  /**
   * Get call center statistics
   */
  getStats: async (): Promise<CallCenterStats> => {
    try {
      const { data } = await http.get<ApiResponse<CallCenterStats>>('/callcenter/stats')
      return data.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// ============================================================
// Export
// ============================================================

export { callcenterApi }
export default callcenterApi