import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Contract,
  ContractListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// API Functions
// ============================================================
const contractApi = {
  list: async (params?: ContractListParams): Promise<PaginatedResponse<Contract>> => {
    const { data } = await http.get<PaginatedResponse<Contract>>('/contracts', { params })
    return data
  },

  getById: async (id: string): Promise<Contract> => {
    const { data } = await http.get<ApiResponse<Contract>>(`/contracts/${id}`)
    return data.data
  },

  create: async (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> => {
    const { data } = await http.post<ApiResponse<Contract>>('/contracts', contract)
    return data.data
  },

  update: async (id: string, contract: Partial<Contract>): Promise<Contract> => {
    const { data } = await http.patch<ApiResponse<Contract>>(`/contracts/${id}`, contract)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/contracts/${id}`)
  },

  updateStatus: async (id: string, status: Contract['status']): Promise<Contract> => {
    const { data } = await http.patch<ApiResponse<Contract>>(`/contracts/${id}/status`, { status })
    return data.data
  },

  sign: async (id: string, signatory: string, signedDate: string): Promise<Contract> => {
    const { data } = await http.post<ApiResponse<Contract>>(`/contracts/${id}/sign`, { signatory, signedDate })
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated contract list with filters
 */
export function useContracts(params?: ContractListParams) {
  return useQuery({
    queryKey: queryKeys.contracts.list(params || {}),
    queryFn: () => contractApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single contract by ID
 */
export function useContract(id: string | null) {
  return useQuery({
    queryKey: queryKeys.contracts.detail(id || ''),
    queryFn: () => contractApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new contract
 */
export function useCreateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) =>
      contractApi.create(contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() })
    },
  })
}

/**
 * Update an existing contract
 */
export function useUpdateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Contract>) =>
      contractApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.contracts.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() })
    },
  })
}

/**
 * Delete a contract
 */
export function useDeleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contractApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() })
    },
  })
}

/**
 * Update contract status
 */
export function useUpdateContractStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Contract['status'] }) =>
      contractApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.contracts.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() })
    },
  })
}

/**
 * Sign a contract
 */
export function useSignContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, signatory, signedDate }: { id: string; signatory: string; signedDate: string }) =>
      contractApi.sign(id, signatory, signedDate),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.contracts.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() })
    },
  })
}

// Export API for direct usage
export { contractApi }