import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  PaymentPlan,
  Reconciliation,
  Invoice,
  ReconciliationRequest,
  RejectRequest,
  InvoiceRequest,
  ReconciliationListParams,
  InvoiceListParams,
  ReconciliationListResponse,
  InvoiceListResponse,
} from '@/types/paymentRecord'
import type { ApiResponse } from '@/types/api'

// ============================================================
// API Functions
// ============================================================

const reconciliationApi = {
  // ========== Payment Plans ==========
  /** 获取回款计划列表 */
  getPaymentPlans: async (paymentId: string): Promise<PaymentPlan[]> => {
    const { data } = await http.get<ApiResponse<PaymentPlan[]>>(`/payments/${paymentId}/plans`)
    return data.data
  },

  /** 获取单个回款计划 */
  getPaymentPlan: async (planId: string): Promise<PaymentPlan> => {
    const { data } = await http.get<ApiResponse<PaymentPlan>>(`/payment-plans/${planId}`)
    return data.data
  },

  // ========== Reconciliation ==========
  /** 获取核销记录列表 */
  getReconciliations: async (params?: ReconciliationListParams): Promise<ReconciliationListResponse> => {
    const { data } = await http.get<ReconciliationListResponse>('/reconciliations', { params })
    return data
  },

  /** 获取单个核销记录 */
  getReconciliation: async (id: string): Promise<Reconciliation> => {
    const { data } = await http.get<ApiResponse<Reconciliation>>(`/reconciliations/${id}`)
    return data.data
  },

  /** 提交核销 */
  submitReconciliation: async (
    paymentId: string,
    request: ReconciliationRequest
  ): Promise<Reconciliation[]> => {
    const { data } = await http.post<ApiResponse<Reconciliation[]>>(
      `/payments/${paymentId}/reconcile`,
      request
    )
    return data.data
  },

  /** 提交驳回 */
  submitReject: async (
    paymentId: string,
    request: RejectRequest
  ): Promise<Reconciliation> => {
    const { data } = await http.post<ApiResponse<Reconciliation>>(
      `/payments/${paymentId}/reject`,
      request
    )
    return data.data
  },

  // ========== Invoice ==========
  /** 获取发票列表 */
  getInvoices: async (params?: InvoiceListParams): Promise<InvoiceListResponse> => {
    const { data } = await http.get<InvoiceListResponse>('/invoices', { params })
    return data
  },

  /** 获取单个发票 */
  getInvoice: async (id: string): Promise<Invoice> => {
    const { data } = await http.get<ApiResponse<Invoice>>(`/invoices/${id}`)
    return data.data
  },

  /** 获取回款记录的发票 */
  getInvoiceByPayment: async (paymentId: string): Promise<Invoice | null> => {
    try {
      const { data } = await http.get<ApiResponse<Invoice>>(`/payments/${paymentId}/invoice`)
      return data.data
    } catch {
      return null
    }
  },

  /** 创建/更新发票 */
  saveInvoice: async (
    paymentId: string,
    request: InvoiceRequest
  ): Promise<Invoice> => {
    const { data } = await http.post<ApiResponse<Invoice>>(
      `/payments/${paymentId}/invoice`,
      request
    )
    return data.data
  },

  /** 更新发票 */
  updateInvoice: async (
    id: string,
    request: Partial<InvoiceRequest>
  ): Promise<Invoice> => {
    const { data } = await http.patch<ApiResponse<Invoice>>(
      `/invoices/${id}`,
      request
    )
    return data.data
  },

  /** 删除发票 */
  deleteInvoice: async (id: string): Promise<void> => {
    await http.delete(`/invoices/${id}`)
  },
}

// ============================================================
// Hooks - Payment Plans
// ============================================================

/**
 * 获取回款计划列表
 */
export function usePaymentPlans(paymentId: string | null) {
  return useQuery({
    queryKey: queryKeys.paymentPlans.list(paymentId || ''),
    queryFn: () => reconciliationApi.getPaymentPlans(paymentId!),
    enabled: !!paymentId,
  })
}

/**
 * 获取单个回款计划
 */
export function usePaymentPlan(planId: string | null) {
  return useQuery({
    queryKey: queryKeys.paymentPlans.detail(planId || ''),
    queryFn: () => reconciliationApi.getPaymentPlan(planId!),
    enabled: !!planId,
  })
}

// ============================================================
// Hooks - Reconciliation
// ============================================================

/**
 * 获取核销记录列表
 */
export function useReconciliations(params?: ReconciliationListParams) {
  return useQuery({
    queryKey: queryKeys.reconciliations.list(params as Record<string, unknown> || {}),
    queryFn: () => reconciliationApi.getReconciliations(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * 获取单个核销记录
 */
export function useReconciliation(id: string | null) {
  return useQuery({
    queryKey: queryKeys.reconciliations.detail(id || ''),
    queryFn: () => reconciliationApi.getReconciliation(id!),
    enabled: !!id,
  })
}

/**
 * 提交核销
 */
export function useSubmitReconciliation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, request }: { paymentId: string; request: ReconciliationRequest }) =>
      reconciliationApi.submitReconciliation(paymentId, request),
    onSuccess: (_, { paymentId }) => {
      // 刷新回款计划列表
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentPlans.list(paymentId),
      })
      // 刷新核销记录列表
      queryClient.invalidateQueries({
        queryKey: queryKeys.reconciliations.lists(),
      })
      // 刷新回款详情
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      })
    },
  })
}

/**
 * 提交驳回
 */
export function useSubmitReject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, request }: { paymentId: string; request: RejectRequest }) =>
      reconciliationApi.submitReject(paymentId, request),
    onSuccess: (_, { paymentId }) => {
      // 刷新回款计划列表
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentPlans.list(paymentId),
      })
      // 刷新核销记录列表
      queryClient.invalidateQueries({
        queryKey: queryKeys.reconciliations.lists(),
      })
      // 刷新回款详情
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      })
    },
  })
}

// ============================================================
// Hooks - Invoice
// ============================================================

/**
 * 获取发票列表
 */
export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params as Record<string, unknown> || {}),
    queryFn: () => reconciliationApi.getInvoices(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * 获取单个发票
 */
export function useInvoice(id: string | null) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id || ''),
    queryFn: () => reconciliationApi.getInvoice(id!),
    enabled: !!id,
  })
}

/**
 * 获取回款记录的发票
 */
export function useInvoiceByPayment(paymentId: string | null) {
  return useQuery({
    queryKey: queryKeys.invoices.byPayment(paymentId || ''),
    queryFn: () => reconciliationApi.getInvoiceByPayment(paymentId!),
    enabled: !!paymentId,
  })
}

/**
 * 保存发票（创建/更新）
 */
export function useSaveInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, request }: { paymentId: string; request: InvoiceRequest }) =>
      reconciliationApi.saveInvoice(paymentId, request),
    onSuccess: (_, { paymentId }) => {
      // 刷新发票详情
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.byPayment(paymentId),
      })
      // 刷新回款详情
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      })
    },
  })
}

/**
 * 更新发票
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: Partial<InvoiceRequest> }) =>
      reconciliationApi.updateInvoice(id, request),
    onSuccess: (updated) => {
      // 刷新发票详情
      queryClient.setQueryData(
        queryKeys.invoices.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.lists(),
      })
    },
  })
}

/**
 * 删除发票
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reconciliationApi.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.lists(),
      })
    },
  })
}

// Export API for direct usage
export { reconciliationApi }
