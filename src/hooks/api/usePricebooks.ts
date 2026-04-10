import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Pricebook,
  PricebookEntry,
  PricebookListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// API Functions
// ============================================================
const pricebookApi = {
  list: async (params?: PricebookListParams): Promise<PaginatedResponse<Pricebook>> => {
    const { data } = await http.get<PaginatedResponse<Pricebook>>('/pricebooks', { params })
    return data
  },

  getById: async (id: string): Promise<Pricebook> => {
    const { data } = await http.get<ApiResponse<Pricebook>>(`/pricebooks/${id}`)
    return data.data
  },

  create: async (pricebook: Omit<Pricebook, 'id' | 'createdAt' | 'updatedAt' | 'entries'>): Promise<Pricebook> => {
    const { data } = await http.post<ApiResponse<Pricebook>>('/pricebooks', pricebook)
    return data.data
  },

  update: async (id: string, pricebook: Partial<Pricebook>): Promise<Pricebook> => {
    const { data } = await http.patch<ApiResponse<Pricebook>>(`/pricebooks/${id}`, pricebook)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/pricebooks/${id}`)
  },

  getEntries: async (pricebookId: string): Promise<PricebookEntry[]> => {
    const { data } = await http.get<ApiResponse<PricebookEntry[]>>(`/pricebooks/${pricebookId}/entries`)
    return data.data
  },

  addEntry: async (pricebookId: string, entry: Omit<PricebookEntry, 'id' | 'pricebookId'>): Promise<PricebookEntry> => {
    const { data } = await http.post<ApiResponse<PricebookEntry>>(`/pricebooks/${pricebookId}/entries`, entry)
    return data.data
  },

  updateEntry: async (pricebookId: string, entryId: string, entry: Partial<PricebookEntry>): Promise<PricebookEntry> => {
    const { data } = await http.patch<ApiResponse<PricebookEntry>>(`/pricebooks/${pricebookId}/entries/${entryId}`, entry)
    return data.data
  },

  deleteEntry: async (pricebookId: string, entryId: string): Promise<void> => {
    await http.delete(`/pricebooks/${pricebookId}/entries/${entryId}`)
  },

  setAsDefault: async (id: string): Promise<Pricebook> => {
    const { data } = await http.patch<ApiResponse<Pricebook>>(`/pricebooks/${id}/default`)
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated pricebook list with filters
 */
export function usePricebooks(params?: PricebookListParams) {
  return useQuery({
    queryKey: queryKeys.pricebooks.list(params || {}),
    queryFn: () => pricebookApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single pricebook by ID
 */
export function usePricebook(id: string | null) {
  return useQuery({
    queryKey: queryKeys.pricebooks.detail(id || ''),
    queryFn: () => pricebookApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch pricebook entries
 */
export function usePricebookEntries(pricebookId: string | null) {
  return useQuery({
    queryKey: queryKeys.pricebooks.entries(pricebookId || ''),
    queryFn: () => pricebookApi.getEntries(pricebookId!),
    enabled: !!pricebookId,
  })
}

/**
 * Create a new pricebook
 */
export function useCreatePricebook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pricebook: Omit<Pricebook, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) =>
      pricebookApi.create(pricebook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.lists() })
    },
  })
}

/**
 * Update an existing pricebook
 */
export function useUpdatePricebook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Pricebook>) =>
      pricebookApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.pricebooks.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.lists() })
    },
  })
}

/**
 * Delete a pricebook
 */
export function useDeletePricebook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => pricebookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.lists() })
    },
  })
}

/**
 * Add a pricebook entry
 */
export function useAddPricebookEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pricebookId, ...entry }: { pricebookId: string } & Omit<PricebookEntry, 'id' | 'pricebookId'>) =>
      pricebookApi.addEntry(pricebookId, entry),
    onSuccess: (_, { pricebookId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.entries(pricebookId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.detail(pricebookId) })
    },
  })
}

/**
 * Update a pricebook entry
 */
export function useUpdatePricebookEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pricebookId, entryId, ...data }: { pricebookId: string; entryId: string } & Partial<PricebookEntry>) =>
      pricebookApi.updateEntry(pricebookId, entryId, data),
    onSuccess: (_, { pricebookId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.entries(pricebookId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.detail(pricebookId) })
    },
  })
}

/**
 * Delete a pricebook entry
 */
export function useDeletePricebookEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pricebookId, entryId }: { pricebookId: string; entryId: string }) =>
      pricebookApi.deleteEntry(pricebookId, entryId),
    onSuccess: (_, { pricebookId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.entries(pricebookId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.detail(pricebookId) })
    },
  })
}

/**
 * Set pricebook as default
 */
export function useSetDefaultPricebook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => pricebookApi.setAsDefault(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.pricebooks.detail(updated.id),
        updated
      )
      // Invalidate all pricebooks to update default status
      queryClient.invalidateQueries({ queryKey: queryKeys.pricebooks.lists() })
    },
  })
}

// Export API for direct usage
export { pricebookApi }