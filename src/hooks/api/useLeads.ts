import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Lead,
  LeadListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// Bulk Operation Types
// ============================================================
interface BulkAssignParams {
  ids: string[]
  assignee: string
}

interface BulkTransferParams {
  ids: string[]
  newAssignee: string
}

interface BulkDeleteParams {
  ids: string[]
}

interface BulkUpdateStatusParams {
  ids: string[]
  status: string
}

interface BulkExportParams {
  ids?: string[]
  format?: 'csv' | 'xlsx'
  fields?: string[]
}

interface BulkOperationResult {
  success: number
  failed: number
  message?: string
}

// ============================================================
// API Functions
// ============================================================
const leadApi = {
  list: async (params?: LeadListParams): Promise<PaginatedResponse<Lead>> => {
    const { data } = await http.get<PaginatedResponse<Lead>>('/leads', { params })
    return data
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await http.get<ApiResponse<Lead>>(`/leads/${id}`)
    return data.data
  },

  create: async (lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
    const { data } = await http.post<ApiResponse<Lead>>('/leads', lead)
    return data.data
  },

  update: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    const { data } = await http.patch<ApiResponse<Lead>>(`/leads/${id}`, lead)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/leads/${id}`)
  },

  convert: async (id: string): Promise<{ customerId: string }> => {
    const { data } = await http.post<ApiResponse<{ customerId: string }>>(`/leads/${id}/convert`)
    return data.data
  },

  // Bulk Operations
  bulkAssign: async (params: BulkAssignParams): Promise<BulkOperationResult> => {
    const { data } = await http.post<ApiResponse<BulkOperationResult>>('/leads/bulk/assign', params)
    return data.data
  },

  bulkTransfer: async (params: BulkTransferParams): Promise<BulkOperationResult> => {
    const { data } = await http.post<ApiResponse<BulkOperationResult>>('/leads/bulk/transfer', params)
    return data.data
  },

  bulkDelete: async (params: BulkDeleteParams): Promise<BulkOperationResult> => {
    const { data } = await http.post<ApiResponse<BulkOperationResult>>('/leads/bulk/delete', params)
    return data.data
  },

  bulkUpdateStatus: async (params: BulkUpdateStatusParams): Promise<BulkOperationResult> => {
    const { data } = await http.post<ApiResponse<BulkOperationResult>>('/leads/bulk/status', params)
    return data.data
  },

  bulkExport: async (params: BulkExportParams): Promise<Blob> => {
    const { data } = await http.post<Blob>('/leads/bulk/export', params, {
      responseType: 'blob'
    })
    return data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated lead list with filters
 */
export function useLeads(params?: LeadListParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params || {}),
    queryFn: () => leadApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single lead by ID
 */
export function useLead(id: string | null) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id || ''),
    queryFn: () => leadApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lead: Omit<Lead, 'id' | 'createdAt'>) => leadApi.create(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Update an existing lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Lead>) =>
      leadApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Delete a lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => leadApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Convert a lead to a customer
 */
export function useConvertLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => leadApi.convert(id),
    onSuccess: () => {
      // Invalidate both leads and customers lists
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Bulk assign leads to an assignee
 */
export function useBulkAssignLeads() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkAssignParams) => leadApi.bulkAssign(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Bulk transfer leads to a new assignee
 */
export function useBulkTransferLeads() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkTransferParams) => leadApi.bulkTransfer(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Bulk delete leads
 */
export function useBulkDeleteLeads() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkDeleteParams) => leadApi.bulkDelete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Bulk update lead status
 */
export function useBulkUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkUpdateStatusParams) => leadApi.bulkUpdateStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() })
    },
  })
}

/**
 * Bulk export leads
 */
export function useBulkExportLeads() {
  return useMutation({
    mutationFn: (params: BulkExportParams) => leadApi.bulkExport(params),
  })
}

// Export API for direct usage
export { leadApi }
