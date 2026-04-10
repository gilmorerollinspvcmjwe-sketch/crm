import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { apiService } from '@/lib/api-service'
import type {
  Contact,
  ContactListParams,
  PaginatedResponse,
} from '@/types/api'

// ============================================================
// Bulk Operation Types
// ============================================================
export interface BulkDeleteParams {
  ids: string[]
}

export interface BulkUpdateTypeParams {
  ids: string[]
  type: string
}

export interface BulkAssignParams {
  ids: string[]
  assignee: string
}

export interface BulkExportParams {
  ids?: string[]
  format?: 'csv' | 'xlsx'
  fields?: string[]
}

// ============================================================
// API Functions (delegated to apiService for mock/real switching)
// ============================================================
const contactApi = {
  list: (params?: ContactListParams) => apiService.contacts.list(params),
  getById: (id: string) => apiService.contacts.getById(id),
  create: (contact: Omit<Contact, 'id' | 'createdAt'>) => apiService.contacts.create(contact),
  update: (id: string, contact: Partial<Contact>) => apiService.contacts.update(id, contact),
  delete: (id: string) => apiService.contacts.delete(id),
  getByCustomer: (customerId: string, params?: ContactListParams) => apiService.contacts.getByCustomer(customerId, params),
  
  // Bulk Operations (placeholder - to be implemented)
  bulkDelete: async (params: BulkDeleteParams): Promise<{ success: number }> => {
    // TODO: Implement bulk delete
    console.log('Bulk delete:', params)
    return { success: params.ids.length }
  },
  bulkUpdateType: async (params: BulkUpdateTypeParams): Promise<void> => {
    // TODO: Implement bulk update type
    console.log('Bulk update type:', params)
  },
  bulkAssign: async (params: BulkAssignParams): Promise<{ success: number }> => {
    // TODO: Implement bulk assign
    console.log('Bulk assign:', params)
    return { success: params.ids.length }
  },
  bulkExport: async (params: BulkExportParams): Promise<Blob> => {
    // TODO: Implement bulk export
    console.log('Bulk export:', params)
    return new Blob()
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated contact list with filters
 */
export function useContacts(params?: ContactListParams) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params || {}),
    queryFn: () => contactApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single contact by ID
 */
export function useContact(id: string | null) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id || ''),
    queryFn: () => contactApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch contacts for a specific customer
 */
export function useContactsByCustomer(customerId: string | null, params?: ContactListParams) {
  return useQuery({
    queryKey: queryKeys.contacts.list({ customerId, ...params }),
    queryFn: () => contactApi.getByCustomer(customerId!, params),
    enabled: !!customerId,
  })
}

/**
 * Create a new contact
 */
export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contact: Omit<Contact, 'id' | 'createdAt'>) => contactApi.create(contact),
    onSuccess: (newContact) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
      // Also invalidate the customer's contact list if customerId is available
      if (newContact.customerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.contacts.list({ customerId: newContact.customerId }),
        })
      }
    },
  })
}

/**
 * Update an existing contact
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Contact>) =>
      contactApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
    },
  })
}

/**
 * Delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
    },
  })
}

/**
 * Bulk delete contacts
 */
export function useBulkDeleteContacts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkDeleteParams) => contactApi.bulkDelete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
    },
  })
}

/**
 * Bulk update contact type
 */
export function useBulkUpdateContactType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkUpdateTypeParams) => contactApi.bulkUpdateType(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
    },
  })
}

/**
 * Bulk assign contacts
 */
export function useBulkAssignContacts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BulkAssignParams) => contactApi.bulkAssign(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() })
    },
  })
}

/**
 * Bulk export contacts
 */
export function useBulkExportContacts() {
  return useMutation({
    mutationFn: (params: BulkExportParams) => contactApi.bulkExport(params),
  })
}

// Export API for direct usage
export { contactApi }
