import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Payment,
  PaymentListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// API Functions
// ============================================================
const paymentApi = {
  list: async (params?: PaymentListParams): Promise<PaginatedResponse<Payment>> => {
    const { data } = await http.get<PaginatedResponse<Payment>>('/payments', { params })
    return data
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await http.get<ApiResponse<Payment>>(`/payments/${id}`)
    return data.data
  },

  create: async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    const { data } = await http.post<ApiResponse<Payment>>('/payments', payment)
    return data.data
  },

  update: async (id: string, payment: Partial<Payment>): Promise<Payment> => {
    const { data } = await http.patch<ApiResponse<Payment>>(`/payments/${id}`, payment)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/payments/${id}`)
  },

  recordPayment: async (id: string, paidAmount: number, method: Payment['method'], receiptNo?: string): Promise<Payment> => {
    const { data } = await http.post<ApiResponse<Payment>>(`/payments/${id}/pay`, { paidAmount, method, receiptNo })
    return data.data
  },

  refund: async (id: string, amount: number): Promise<Payment> => {
    const { data } = await http.post<ApiResponse<Payment>>(`/payments/${id}/refund`, { amount })
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated payment list with filters
 */
export function usePayments(params?: PaymentListParams) {
  return useQuery({
    queryKey: queryKeys.payments.list(params || {}),
    queryFn: () => paymentApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single payment by ID
 */
export function usePayment(id: string | null) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id || ''),
    queryFn: () => paymentApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new payment
 */
export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) =>
      paymentApi.create(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() })
    },
  })
}

/**
 * Update an existing payment
 */
export function useUpdatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Payment>) =>
      paymentApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.payments.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() })
    },
  })
}

/**
 * Delete a payment
 */
export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => paymentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() })
    },
  })
}

/**
 * Record a payment
 */
export function useRecordPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, paidAmount, method, receiptNo }: { id: string; paidAmount: number; method: Payment['method']; receiptNo?: string }) =>
      paymentApi.recordPayment(id, paidAmount, method, receiptNo),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.payments.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() })
    },
  })
}

/**
 * Refund a payment
 */
export function useRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      paymentApi.refund(id, amount),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.payments.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() })
    },
  })
}

// Export API for direct usage
export { paymentApi }