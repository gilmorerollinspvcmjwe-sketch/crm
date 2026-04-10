import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { apiService } from '@/lib/api-service'
import type {
  Customer,
  CustomerListParams,
  PaginatedResponse,
} from '@/types/api'

// ============================================================
// Export Format Types
// ============================================================
export type ExportFormat = 'excel' | 'csv' | 'json'

export interface ExportOptions {
  format: ExportFormat
  fields?: string[] // Specific fields to export, or all if undefined
  includeHeader?: boolean
  fileName?: string
}

// ============================================================
// Bulk Assign Types
// ============================================================
export interface BulkAssignParams {
  ids: string[]
  assignee: string
}

// ============================================================
// API Functions (delegated to apiService for mock/real switching)
// ============================================================
const customerApi = {
  list: (params?: CustomerListParams) => apiService.customers.list(params),
  getById: (id: string) => apiService.customers.getById(id),
  create: (customer: Omit<Customer, 'id' | 'createdAt'>) => apiService.customers.create(customer),
  update: (id: string, customer: Partial<Customer>) => apiService.customers.update(id, customer),
  delete: (id: string) => apiService.customers.delete(id),
  bulkDelete: (ids: string[]) => apiService.customers.bulkDelete(ids),
  
  // New: Export customers
  export: async (ids?: string[], options?: ExportOptions): Promise<Blob> => {
    // Mock implementation - in real app, this would call API
    const { mockCustomerApi } = await import('@/lib/mock-api')
    const customers = ids 
      ? await mockCustomerApi.list().then(res => res.data.filter(c => ids.includes(c.id)))
      : await mockCustomerApi.list().then(res => res.data)
    
    const format = options?.format || 'excel'
    
    if (format === 'json') {
      const json = JSON.stringify(customers, null, 2)
      return new Blob([json], { type: 'application/json' })
    }
    
    if (format === 'csv') {
      const fields = options?.fields || ['id', 'name', 'company', 'email', 'phone', 'status', 'score', 'createdAt', 'lastContact', 'assignee']
      const header = options?.includeHeader !== false ? fields.join(',') + '\n' : ''
      const rows = customers.map(c => 
        fields.map(f => {
          const val = String((c as unknown as Record<string, unknown>)[f] || '')
          // Escape commas and quotes in CSV
          return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
        }).join(',')
      ).join('\n')
      return new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
    }
    
    // Excel format - using simple CSV with BOM for Excel compatibility
    const fields = options?.fields || ['id', 'name', 'company', 'email', 'phone', 'status', 'score', 'createdAt', 'lastContact', 'assignee']
    const header = options?.includeHeader !== false ? fields.join('\t') + '\n' : ''
    const rows = customers.map(c => 
      fields.map(f => String((c as unknown as Record<string, unknown>)[f] || '')).join('\t')
    ).join('\n')
    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF'
    return new Blob([bom + header + rows], { type: 'application/vnd.ms-excel;charset=utf-8' })
  },
  
  // New: Bulk assign customers
  bulkAssign: async (params: BulkAssignParams): Promise<Customer[]> => {
    const { mockCustomerApi } = await import('@/lib/mock-api')
    const updated: Customer[] = []
    for (const id of params.ids) {
      const customer = await mockCustomerApi.update(id, { assignee: params.assignee })
      updated.push(customer)
    }
    return updated
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated customer list with filters
 */
export function useCustomers(params?: CustomerListParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params || {}),
    queryFn: () => customerApi.list(params),
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single customer by ID
 */
export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id || ''),
    queryFn: () => customerApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customer: Omit<Customer, 'id' | 'createdAt'>) => customerApi.create(customer),
    onSuccess: () => {
      // Invalidate all customer list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Update an existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Customer>) =>
      customerApi.update(id, data),
    onSuccess: (updatedCustomer) => {
      // Update the specific customer in cache
      queryClient.setQueryData(
        queryKeys.customers.detail(updatedCustomer.id),
        oldData => oldData
      )
      // Invalidate list queries to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Bulk delete customers with optimistic update
 */
export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => customerApi.bulkDelete(ids),
    onMutate: async (ids) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.lists() })

      // Snapshot previous values
      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.customers.lists(),
      })

      // Optimistically remove deleted customers from all list queries
      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData && typeof oldData === 'object' && 'data' in oldData) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: (oldData as PaginatedResponse<Customer>).data.filter(
              (c) => !ids.includes(c.id)
            ),
          })
        }
      })

      return { previousQueries }
    },
    onError: (_err, _ids, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

/**
 * Export customers to Excel/CSV/JSON
 */
export function useExportCustomers() {
  return useMutation({
    mutationFn: ({ ids, options }: { ids?: string[]; options?: ExportOptions }) =>
      customerApi.export(ids, options),
    onSuccess: (blob, { options }) => {
      // Download the file
      const format = options?.format || 'excel'
      const extension = format === 'excel' ? 'xlsx' : format === 'csv' ? 'csv' : 'json'
      const fileName = options?.fileName || `customers_${new Date().toISOString().split('T')[0]}.${extension}`
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
  })
}

/**
 * Bulk assign customers to a new owner
 */
export function useBulkAssignCustomers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkAssignParams) => customerApi.bulkAssign(params),
    onMutate: async ({ ids, assignee }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.customers.lists() })

      // Snapshot previous values
      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.customers.lists(),
      })

      // Optimistically update assignee for selected customers
      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData && typeof oldData === 'object' && 'data' in oldData) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: (oldData as PaginatedResponse<Customer>).data.map((c) =>
              ids.includes(c.id) ? { ...c, assignee } : c
            ),
          })
        }
      })

      return { previousQueries }
    },
    onError: (_err, _params, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() })
    },
  })
}

// ============================================================
// Export API for direct usage
// ============================================================
export { customerApi }
