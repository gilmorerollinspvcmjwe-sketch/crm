import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { queryKeys } from '@/lib/query-client'
import type {
  Order,
  OrderListParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// ============================================================
// API Functions
// ============================================================
const orderApi = {
  list: async (params?: OrderListParams): Promise<PaginatedResponse<Order>> => {
    const { data } = await http.get<PaginatedResponse<Order>>('/orders', { params })
    return data
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await http.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  },

  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const { data } = await http.post<ApiResponse<Order>>('/orders', order)
    return data.data
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    const { data } = await http.patch<ApiResponse<Order>>(`/orders/${id}`, order)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/orders/${id}`)
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const { data } = await http.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })
    return data.data
  },

  confirm: async (id: string): Promise<Order> => {
    const { data } = await http.post<ApiResponse<Order>>(`/orders/${id}/confirm`)
    return data.data
  },

  ship: async (id: string, shippingDate: string): Promise<Order> => {
    const { data } = await http.post<ApiResponse<Order>>(`/orders/${id}/ship`, { shippingDate })
    return data.data
  },

  receive: async (id: string, receivedDate: string): Promise<Order> => {
    const { data } = await http.post<ApiResponse<Order>>(`/orders/${id}/receive`, { receivedDate })
    return data.data
  },
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch paginated order list with filters
 */
export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params || {}),
    queryFn: () => orderApi.list(params),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch a single order by ID
 */
export function useOrder(id: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id || ''),
    queryFn: () => orderApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) =>
      orderApi.create(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Update an existing order
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Order>) =>
      orderApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.orders.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Delete an order
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.orders.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Confirm an order
 */
export function useConfirmOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orderApi.confirm(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.orders.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Ship an order
 */
export function useShipOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, shippingDate }: { id: string; shippingDate: string }) =>
      orderApi.ship(id, shippingDate),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.orders.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

/**
 * Receive an order
 */
export function useReceiveOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, receivedDate }: { id: string; receivedDate: string }) =>
      orderApi.receive(id, receivedDate),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.orders.detail(updated.id),
        updated
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
    },
  })
}

// Export API for direct usage
export { orderApi }